// import { readStream } from '../utils/streamUtils'

export const handleChatGPT = async (url, setData, variables, setVariables) => {
    console.log('Submitting to ChatGPT')

    try {
        setVariables(prevVariables => ({...prevVariables,progress: {step: 'Generating AI Content...', percentage: 75} }))
        // throw new Error('Test error: This is a manually thrown error for testing purposes.')

        const response = await fetch('/api/chatGpt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url,
                objectives: variables.objectives.map(item => item.value),
                audience: variables.overrides.audience === '' ? variables.audience.value : variables.overrides.audience,
                vertical: variables.overrides.vertical === '' ? variables.vertical.map(item => item.value) : variables.overrides.vertical
            }),
        })

        console.log('status:: /api/chatGpt >>> ', response, response.ok, response.status)

        if (response.ok) {
            const returned = await response.json()

            if (returned?.choices) {
                console.log('AI finished and the data received is:', returned)
                const strContent = returned.choices[0]?.message.content
                let jsonString = {}

                try {
                    jsonString = extractAndParseJSON(strContent)
                    const content = JSON.parse(jsonString)
                    console.log('parsed result from chatGpt >>> ', content)

                    content.page.sections[1].desc = content.page.sections[1].descLessText
                    content.page.sections[1].desc2 = content.page.sections[1].desc2LessText

                    setData(prevData => ({
                        ...prevData,
                        siteName: content.siteName,
                        colors: {
                            ...prevData.colors,
                            ...content.colors
                        },
                        seo: {
                            ...prevData.seo,
                            ...content.seo
                        },
                        page: {
                            ...prevData.page,
                            sections: [
                                {
                                    ...prevData.page.sections[0],
                                    ...content.page.sections[0],
                                    components: [
                                        {
                                            ...prevData.page.sections[0].components[0],
                                            ...content.page.sections[0].components[0]
                                        },
                                        {
                                            ...prevData.page.sections[0].components[1],
                                            ...content.page.sections[0].components[1]
                                        }
                                    ]
                                },
                                {
                                    ...prevData.page.sections[1],
                                    ...content.page.sections[1]
                                },
                                {
                                    ...prevData.page.sections[2],
                                    ...content.page.sections[2]
                                }
                            ]
                        }
                    }))

                } catch (error) {
                    console.error('Failed to parse JSON from ChatGPT:', error, strContent)
                    setVariables(prevVariables => ({
                        ...prevVariables,
                        error: {
                            ...prevVariables.error,
                            chatgpt: {
                                message: 'We encountered some errors parsing the data returned by ChatGPT. ' + error.message,
                                debug: jsonString
                            }
                        },
                    }))
                }

            } else {
                console.error('ChatGPT did not returned a response', returned || '')
                setVariables(prevVariables => ({
                    ...prevVariables,
                    error: {
                        ...prevVariables.error,
                        chatgpt: {
                            message: 'ChatGPT did not returned a response',
                            debug: JSON.stringify(response)
                        }
                    },
                }))
            }
        } else {
            console.error('ChatGPT returned an error', response)
            const errorData = await response.json()
            setVariables(prevVariables => ({
                ...prevVariables,
                error: {
                    ...prevVariables.error,
                    chatgpt: {
                        message: `We encountered an issue while AI Analyzing ${url}. ${errorData.error ?? ''}`,
                        debug: (errorData.error ?? '') + ' => ' + JSON.stringify(response)
                    }
                },
            }))
        }
    } catch (error) {
        console.error('Error submitting to ChatGPT:', error)
        setVariables(prevVariables => ({
            ...prevVariables,
            error: {
                ...prevVariables.error,
                chatgpt: {
                    message: 'Error submitting to ChatGPT. ' + error.message,
                    debug: ''
                }
            },
        }))
    }

}

function extractAndParseJSON(text) {
    const jsonStartIndex = text.indexOf('{')
    const jsonEndIndex = text.lastIndexOf('}') + 1

    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
        throw new Error('No JSON object found in the provided text >>> ' + text)
    }

    return text.substring(jsonStartIndex, jsonEndIndex)
}
