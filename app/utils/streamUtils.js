export const prepStream = (res) => {
    if (!res) {
        return
    }

    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')
    res.flushHeaders()

    res.on('close', () => {
        res.end()
    })
}

export const sendStream = (res, event, data) => {
    console.log('sendStream', event, data)
    res.write(`event: ${event}\n`)
    res.write(`data: ${JSON.stringify(data)}\n\n`)

    if (typeof res.flush == 'function') {
        res.flush()
    }

    if (event === 'end') {
        res.statusCode = 200 // Set status code to 200
        res.end()
    }
}

export const readStream = async (response, setVariables) => {
    if (!response.body) {
        console.error('Response body is null')
        return null
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let finalResponse = null

    const processStream = async () => {
        const { done, value } = await reader.read()
        if (done) return finalResponse

        const text = decoder.decode(value)
        // console.log('stream value >>>', text)
        const progressMatch = text.match(/event: message\ndata: ({.*})/)

        if (progressMatch) {
            const data = JSON.parse(progressMatch[1])
            setVariables(prevVariables => ({
                ...prevVariables,
                progress: data
            }))
        }

        const endMatch = text.match(/event: end\ndata: ({.*})/)
        if (endMatch) {
            finalResponse = JSON.parse(endMatch[1])
            return finalResponse
        }

        return processStream()
    }

    return await processStream()
}

export const backgroundMessages = (res, progress) => {
    let stepIndex = 0
    const intervalId = setInterval(() => {
        if (stepIndex < progress.length) {
            const step = progress[stepIndex]
            sendStream(res, 'message', { step: step.step, percentage: step.percentage })
            stepIndex++
        } else {
            clearInterval(intervalId)
        }
    }, 2000) // Send updates every 2 seconds
}
