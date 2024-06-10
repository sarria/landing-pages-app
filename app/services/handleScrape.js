// import { readStream } from '../utils/streamUtils'

export const handleScrape = async (url, setData, setVariables) => {
    // console.log('Scraping')

    try {
        setVariables(prevVariables => ({...prevVariables,progress: {step: 'Starting Scraping Process...', percentage: 30} }))

        const response = await fetch('/api/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        })

        console.log('status:: /api/scrape >>> ', response, response.ok, response.status)

        if (response.ok) {
            // const scrapedData = await readStream(response, setVariables)
            const scrapedData = await response.json()

            if (scrapedData) {
                console.log('Scrape readStream finished and data received:', scrapedData)

                const title = scrapedData.metaTags.find((tag) => tag.name === 'og:title')?.content || scrapedData.title
                const description = scrapedData.metaTags.find((tag) => tag.name === 'description')?.content
                const og_description = scrapedData.metaTags.find((tag) => tag.name === 'og:xdescription')?.content
                const options = {
                    phones: [
                        ...scrapedData.phones.map(item => ({ value: item, label: item })),
                        // { value: '123-456-7890', label: '123-456-7890' },
                        // { value: '098-765-4321', label: '098-765-4321' }
                    ],
                    emails: [
                        ...scrapedData.emails.map(item => ({ value: item, label: item })),
                        // { value: 'test1@example.com', label: 'test1@example.com' },
                        // { value: 'test2@exampleofafakeemail.com', label: 'test2@exampleofafakeemail.com' }
                    ]
                }

                setVariables(prevVariables => ({
                    ...prevVariables,
                    phone: options.phones[0] ?? prevVariables.phoneNumber,
                    email: options.emails[0] ?? prevVariables.email,
                    options: {
                        ...prevVariables.options,
                        ...options
                    },
                    scrapedData
                }))

                setData(prevData => ({
                    ...prevData,
                    title,
                    description: og_description ?? prevData.description,
                    logo: scrapedData.logos[0] ?? prevData.logo,
                    phoneNumber: options.phones[0]?.value ?? prevData.phoneNumber,
                    email: options.emails[0]?.value ?? prevData.email,
                    socials: scrapedData.socialLinks,
                    colors: {
                        ...prevData.colors,
                        primary: scrapedData.colorClusters[0] ?? prevData.colors.primary,
                        accent: scrapedData.colorClusters[1] ?? prevData.colors.accent,
                        tertiary: scrapedData.colorClusters[2] ?? prevData.colors.tertiary,
                    }
                }))

            } else {
                console.error('Error data from handleScrape api readStream', scrapedData)
                setVariables(prevVariables => ({
                    ...prevVariables,
                    error: {
                        ...prevVariables.error,
                        scrape: {
                            message: 'The data we received could not be parsed correctly',
                            debug: scrapedData
                        }
                    },
                }))
            }
        } else {
            const errorData = await response.json()
            setVariables(prevVariables => ({
                ...prevVariables,
                error: {
                    ...prevVariables.error,
                    scrape: {
                        message: `We encountered an issue while scraping ${url}. ${errorData.error ?? ''}`,
                        debug: errorData.error ?? ''
                    }
                },
            }))
        }
    } catch (error) {
        console.error('Failed to scrape the URL', error)
    }
}
