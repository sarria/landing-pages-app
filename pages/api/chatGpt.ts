/* eslint-disable linebreak-style */
import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
// import { prepStream, sendStream, backgroundMessages } from '../../app/utils/streamUtils'

// https://vercel.com/docs/functions/runtimes#max-duration
// https://vercel.com/docs/functions/configuring-functions/duration
export const config = {
    maxDuration: 120,
}

interface RequestData {
    url: string
    objectives: string
    audience: string
    vertical: string
}

interface ResponseData {
    choices?: Array<{ message: { content: string } }>
    error?: string | boolean
    message?: string | null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    // prepStream(res)
    // sendStream(res, 'message', { step: 'Generating AI Content...', percentage: 70 })
    // return res.status(500).json({ error: 'Faking an error on chatGPT' })

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST'])
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    }

    console.log('<<< Ready', req)

    const postData: RequestData = req.body
    const filePath = 'https://townsquareignite.s3.amazonaws.com/landing-pages/prompts/prompt.txt'
    let prompt = ''

    try {
        const promptResponse = await fetch(filePath)
        if (!promptResponse.ok) {
            throw new Error(`Error fetching prompt: ${promptResponse.statusText}`)
        }
        const promptText = await promptResponse.text()

        prompt = promptText
            .replaceAll('[url]', postData.url)
            .replaceAll('[objectives]', postData.objectives)
            .replaceAll('[audience]', postData.audience)
            .replaceAll('[vertical]', postData.vertical)

        console.log('prompt', prompt)

    } catch (error) {
        return res.status(500).json({ error: 'Error processing prompt at ' + filePath })
    }

    const apiKey = process.env.OPENAI_API_KEY
    console.log('apiKey', apiKey)

    try {
        // Send the file to ChatGPT for analysis
        const chatGptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                // model: 'gpt-4',
                model: 'gpt-4o',
                // model: 'gpt-4-turbo',
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                    // Uncomment and use the below message if needed
                    // {
                    //     role: 'system',
                    //     content: `The following is a ${fileType} file encoded in base64. Please analyze it for phone numbers and colors used: ${base64File}`,
                    // },
                ],
                // Optional parameters for fine-tuning the response
                // temperature: 0.7, // Adjust for creativity
                // max_tokens: 256, // Adjust for length of completion
                // top_p: 1.0,
                // frequency_penalty: 0.0,
                // presence_penalty: 0.0,
            }),
        })

        if (!chatGptResponse.ok) {
            return res.status(500).json({ error: 'OpenAI API call failed' })
        }

        // sendStream(res, 'message', { step: 'Landing Page Created!', percentage: 100 })

        const result = await chatGptResponse.json() as ResponseData

        // Send the final response using sendStream
        // sendStream(res, 'end', result)
        return res.status(200).json(result)

    } catch (error) {
        return res.status(500).json({ error: 'Failed call to ChatGPT: ' + (error as Error).message })
    }
}
