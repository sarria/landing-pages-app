import { NextApiRequest, NextApiResponse } from 'next'
import chromium from '@sparticuz/chromium-min'
import puppeteer, { Page } from 'puppeteer-core'
// import { prepStream, sendStream } from '../../app/utils/streamUtils'
import { main as colorAnalysis } from '../../app/utils/colorAnalysis'

// https://vercel.com/docs/functions/runtimes#max-duration
// https://vercel.com/docs/functions/configuring-functions/duration
export const config = {
    maxDuration: 120,
}

interface MetaTag {
    name?: string;
    content?: string;
}

interface Image {
    url: string;
    link: string;
}

interface Video {
    url: string;
    title: string;
}

interface Style {
    key: string;
    count: number;
    isFirstPlace?: boolean;
}

interface Styles {
    backgroundColors: Style[],
    backgroundImages: Style[],
    fontFamilies: Style[],
    colors: Style[]
}
interface DataResponse {
    url?: string;
    title?: string;
    metaTags?: MetaTag[];
    emails?: string[],
    phones?: string[],
    images?: Image[];
    videos?: Video[];
    logos?: string[];
    styles? : Styles;
    socialLinks?: string[];
}

const getBrowserOptions = async () => {
    // console.log('process.platform', process.platform, chromium.headless)

    if (process.env.APP_ENV === 'local') {
        return {
            args: chromium.args,
            executablePath: process.env.CHROMIUM_PATH,
            headless: true,
        }
    }

    return {
        args: chromium.args,
        executablePath: await chromium.executablePath(process.env.CHROMIUM_PATH),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<DataResponse | { error: string }>) {
    // prepStream(res)
    if (req.method === 'POST') {
        const { url } = req.body

        if (typeof url !== 'string') {
            res.status(400).json({
                error: 'Invalid format fopr the URL: ' + url
            })
            return
        }

        try {
            const browserOptions = await getBrowserOptions()
            const browser = await puppeteer.launch(browserOptions)
            const page = await browser.newPage()

            // // sendStream(res, 'message', { step: 'Navigating to Website...', percentage: 10 })
            // sendStream(res, 'message', { step: 'Starting Scraping Process...', percentage: 10 })

            // await page.goto(url, { waitUntil: 'load' })
            // await page.goto(url, { waitUntil: 'domcontentloaded' })
            await page.goto(url, { waitUntil: 'networkidle2' })
            // await page.goto(url, { waitUntil: 'networkidle0' })

            // // sendStream(res, 'message', { step: 'Starting Scraping Process...', percentage: 20 })
            const title = await page.title()

            // Scroll to the bottom of the page
            await autoScroll(page)

            // Extract meta tags information
            // sendStream(res, 'message', { step: 'Extracting Meta Tags...', percentage: 30 })
            const metaTags = await page.evaluate(() => {
                const tags = Array.from(document.getElementsByTagName('meta'))
                return tags
                    .map((tag) => {
                        return {
                            name: tag.getAttribute('name') || tag.getAttribute('property') || '',
                            content: tag.getAttribute('content') || ''
                        }
                    })
                    .filter((tag) => tag.name) // Filter out tags without name and property
            })

            // sendStream(res, 'message', { step: 'Extracting Images...', percentage: 40 })
            // Extracting images and logos
            const result = await page.evaluate(() => {
                const imageMap = new Map()
                const imagesLogo: string[] = []

                // Extract the domain name from the URL
                // const domainName = window.location.hostname

                Array.from(document.images).forEach((img) => {
                    const url = img.src.split('?')[0]

                    if (!url.startsWith('data:image') && !imageMap.has(url)) {
                        const link = img.closest('a')?.href || ''
                        imageMap.set(url, { url, link })

                        if (
                            url.toLowerCase().includes('logo') ||
                            img.className.toLowerCase().includes('logo') ||
                            img.id.toLowerCase() === 'logo' ||
                            img.alt.toLowerCase() === 'logo' // ||
                            // url.toLowerCase().includes(domainName.toLowerCase())  // Check if the URL contains the domain name
                        ) {
                            imagesLogo.push(url)
                        }
                    }
                })

                return {
                    images: Array.from(imageMap.values()),
                    logos: imagesLogo
                }
            })

            const { images, logos } = result

            // Extracting videos
            const videos = await page.evaluate(() => {
                const videoElements = Array.from(document.getElementsByTagName('video'))
                return videoElements.map((video) => {
                    return {
                        url: video.src,
                        title: video.title || ''
                    }
                })
            })

            // sendStream(res, 'message', { step: 'Extracting CSS...', percentage: 50 })
            const styles = await page.evaluate(() => {
                console.log('styles start')

                function sortColorsByRGB(colors: Style[]): Style[] {
                    return colors.sort((a, b) => {
                        // Extracting RGB values from the string 'rgb(r, g, b)'
                        const rgbA = a.key.match(/\d+/g)?.map(Number)
                        const rgbB = b.key.match(/\d+/g)?.map(Number)

                        if (!rgbA || !rgbB) {
                            return 0 // In case of an error in matching, consider them equal
                        }

                        // Compare red, then green, then blue
                        for (let i = 0; i < 3; i++) {
                            if (rgbA[i] !== rgbB[i]) {
                                return rgbA[i] - rgbB[i]
                            }
                        }

                        // If all components are equal, return 0
                        return 0
                    })
                }

                function mapToArray(map: Map<string, number>): Style[] {
                    const sortedArray = Array.from(map).sort((a, b) => b[1] - a[1])
                    return sortedArray.map(([key, count], index) => ({
                        key,
                        count,
                        isFirstPlace: index === 0  // The first element has the highest count
                    }))
                }

                function extractImageUrls(backgroundImages: Style[]) {
                    return backgroundImages.map((image: Style) => {
                        const match = image.key.match(/url\("(.*)"\)/)
                        return {
                            key: match ? match[1] : image.key,
                            count: image.count,
                            isFirstPlace: image.isFirstPlace
                        }
                    })
                }

                const styleCounts = {
                    backgroundColors: new Map<string, number>(),
                    backgroundImages: new Map<string, number>(),
                    fontFamilies: new Map<string, number>(),
                    colors: new Map<string, number>()
                }

                // Collect style counts
                document.querySelectorAll('*').forEach(el => {
                    const style = getComputedStyle(el)
                    // console.log('style', style)
                    if (style.backgroundColor && !style.backgroundColor.includes('rgba') && !style.backgroundColor.includes('hsla')) {
                        styleCounts.backgroundColors.set(style.backgroundColor, (styleCounts.backgroundColors.get(style.backgroundColor) || 0) + 1)
                    }
                    if (style.color && !style.color.includes('rgba') && !style.color.includes('hsla')) {
                        styleCounts.colors.set(style.color, (styleCounts.colors.get(style.color) || 0) + 1)
                    }
                    if (style.backgroundImage !== 'none') {
                        styleCounts.backgroundImages.set(style.backgroundImage, (styleCounts.backgroundImages.get(style.backgroundImage) || 0) + 1)
                    }
                    if (style.fontFamily) {
                        styleCounts.fontFamilies.set(style.fontFamily, (styleCounts.fontFamilies.get(style.fontFamily) || 0) + 1)
                    }
                })

                // Convert Maps to arrays of objects for better readability in JSON
                return {
                    backgroundColors: sortColorsByRGB(mapToArray(styleCounts.backgroundColors)),
                    backgroundImages: extractImageUrls(mapToArray(styleCounts.backgroundImages)),
                    fontFamilies: mapToArray(styleCounts.fontFamilies),
                    colors: sortColorsByRGB(mapToArray(styleCounts.colors))
                }
            })

            const emailPhones = await page.evaluate(() => {
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g
                const phoneRegex = /(\+\d{1,2}\s?)?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g
                const text = document.body.innerText
                const emails = text.match(emailRegex) || []
                const phones = text.match(phoneRegex) || []

                return { emails, phones }
            })

            // Remove duplicates
            const emails = Array.from(new Set(emailPhones.emails))
            const phones = Array.from(new Set(emailPhones.phones))

            const socialLinks = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('a'))
                const socialMediaPatterns = [
                    'facebook.com',
                    'twitter.com',
                    'instagram.com',
                    'linkedin.com',
                    'youtube.com',
                    'pinterest.com',
                    'tiktok.com',
                    'snapchat.com'
                ]
                const uniqueSocialLinks = new Set<string>()
                links.forEach(link => {
                    const href = link.href
                    if (socialMediaPatterns.some(pattern => href.includes(pattern))) {
                        uniqueSocialLinks.add(href)
                    }
                })
                return Array.from(uniqueSocialLinks)
            })

            // sendStream(res, 'message', { step: 'Performing color analysis', percentage: 60 })
            const colorClusters = await colorAnalysis(page)

            // await browser.close();
            // sendStream(res, 'message', { step: 'Scraping Completed!', percentage: 65 })

            const returnData = {
                url,
                title,
                metaTags,
                emails,
                phones,
                images,
                videos,
                logos,
                styles,
                socialLinks,
                colorClusters
            }

            // Send the final response using sendStream
            // sendStream(res, 'end', returnData)
            res.status(200).json(returnData)

        } catch (error) {
            res.status(500).json({
                error: (error as Error).message
            })
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}

async function autoScroll(page: Page) {
    await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
            let totalHeight = 0
            const distance = 100  // Should be less than or equal to window.innerHeight
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight
                window.scrollBy(0, distance)
                totalHeight += distance

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer)
                    resolve()
                }
            }, 100)  // Adjust time interval as needed for your site
        })
    })
}

