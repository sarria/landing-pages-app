import { S3Client, GetObjectCommand, S3ClientConfig } from '@aws-sdk/client-s3'
import { NextApiRequest, NextApiResponse } from 'next'

const awsConfig: S3ClientConfig = {
    region: process.env.AWS_REGION || '',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
}

const s3 = new S3Client(awsConfig)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // res.status(500).json({ error: 'Forciong failing for debuging' })

    try {
        const command = new GetObjectCommand({
            Bucket: 'townsquareignite',
            Key: 'landing-pages/variables/options.json',
        })
        const data = await s3.send(command)
        const str = await data.Body?.transformToString()
        const options = JSON.parse(str || '')
        res.status(200).json(options)
    } catch (error) {
        console.error('Failed to fetch options from S3', error)
        res.status(500).json({ error: 'Failed to fetch options from S3' })
    }
}
