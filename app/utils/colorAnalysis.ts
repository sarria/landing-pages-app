import { Page, ElementHandle } from 'puppeteer-core'
import chroma from 'chroma-js'

const parseColor = (color: string): number[] | null => {
    const rgbaMatch = color.match(/rgba?\((\d+), (\d+), (\d+)(, [\d.]+)?\)/)
    if (rgbaMatch) {
        // // console.log('Match A')
        return [
            parseInt(rgbaMatch[1]),
            parseInt(rgbaMatch[2]),
            parseInt(rgbaMatch[3]),
        ]
    }
    const rgbMatch = color.match(/rgb\((\d+), (\d+), (\d+)\)/)
    if (rgbMatch) {
        // // console.log('Match B')
        return [
            parseInt(rgbMatch[1]),
            parseInt(rgbMatch[2]),
            parseInt(rgbMatch[3]),
        ]
    }
    return null
}

const rgbToHex = (rgb: number[]): string | null => {
    if (!rgb) return null
    return chroma(rgb).hex()
}

const adjustColorWeight = (rgb: number[]): number[] | null => {
    const hsv = chroma(rgb).hsv()
    // // console.log('adjustColorWeight hsv:', hsv)
    if (hsv[1] > 0.1 && hsv[2] > 0.2 && hsv[2] < 0.8) {
        return rgb
    }
    return null
}

const getColors = async (page: Page, element: ElementHandle<Element>): Promise<string[]> => {
    const color = await page.evaluate(el => window.getComputedStyle(el).color, element)
    const backgroundColor = await page.evaluate(el => window.getComputedStyle(el).backgroundColor, element)
    return [color, backgroundColor]
}

const processColors = (color: string, backgroundColor: string): number[][] => {
    // // console.log(`processColors:: color: ${color}, background: ${backgroundColor}`)

    const colorSamples: number[][] = []
    const parsedColor = parseColor(color)
    const parsedBgColor = parseColor(backgroundColor)

    // // console.log(`Parsed color: ${parsedColor}, Parsed background color: ${parsedBgColor}`)

    if (parsedColor) {
        // // console.log('parsedColor:', parsedColor)
        const adjustedColor = adjustColorWeight(parsedColor)
        // // console.log('adjustedColor:', adjustedColor)
        if (adjustedColor) {
            // // console.log(`Adjusted color: ${adjustedColor}`)
            colorSamples.push(adjustedColor)
        } else {
            // // console.log(`Color did not pass adjustment: ${parsedColor}`)
        }
    }

    if (parsedBgColor) {
        // // console.log('parsedBgColor:', parsedBgColor)
        const adjustedBgColor = adjustColorWeight(parsedBgColor)
        // // console.log('adjustedBgColor:', adjustedBgColor)
        if (adjustedBgColor) {
            // // console.log(`Adjusted background color: ${adjustedBgColor}`)
            colorSamples.push(adjustedBgColor)
        } else {
            // // console.log(`Background color did not pass adjustment: ${parsedBgColor}`)
        }
    }

    return colorSamples
}

export const fetchComputedStyles = async (page: Page): Promise<number[][]> => {
    await page.waitForSelector('body *')
    const elements = await page.$$('body *')
    const colorSamplesSet: Set<string> = new Set()

    // // console.log(`Total elements found: ${elements.length}`)

    for (const element of elements) {
        const [color, backgroundColor] = await getColors(page, element)
        // // console.log(`Element color: ${color}, background color: ${backgroundColor}`)
        processColors(color, backgroundColor).forEach(sample => {
            colorSamplesSet.add(JSON.stringify(sample))
        })
    }

    const colorSamples: number[][] = Array.from(colorSamplesSet).map(sample => JSON.parse(sample))
    // // console.log(`Total unique color samples extracted: ${colorSamples.length}`)

    return colorSamples
}

const calculateDistance = (a: number[], b: number[]): number => {
    return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0))
}

const findClosestCentroid = (point: number[], centroids: number[][]): number => {
    let minDistance = Infinity
    let closestIndex = -1
    for (let i = 0; i < centroids.length; i++) {
        const distance = calculateDistance(point, centroids[i])
        if (distance < minDistance) {
            minDistance = distance
            closestIndex = i
        }
    }
    return closestIndex
}

const calculateNewCentroid = (points: number[][]): number[] => {
    const numPoints = points.length
    const numDimensions = points[0].length
    const centroid = Array(numDimensions).fill(0)
    points.forEach(point => {
        for (let i = 0; i < numDimensions; i++) {
            centroid[i] += point[i]
        }
    })
    return centroid.map(val => val / numPoints)
}

export const performClustering = (colorSamples: number[][], k: number): number[][] => {
    // // console.log('performClustering', colorSamples)
    const centroids = colorSamples.slice(0, k)
    let clusters: number[][][] = Array.from({ length: k }, () => [])

    for (let iteration = 0; iteration < 100; iteration++) {
        clusters = Array.from({ length: k }, () => [])

        for (const sample of colorSamples) {
            const clusterIndex = findClosestCentroid(sample, centroids)
            clusters[clusterIndex].push(sample)
        }

        for (let i = 0; i < k; i++) {
            if (clusters[i].length > 0) {
                centroids[i] = calculateNewCentroid(clusters[i])
            }
        }
    }

    return centroids
}

export const main = async (page: Page): Promise<string[]> => {
    const colorSamples = await fetchComputedStyles(page)
    if (!colorSamples.length) {
        // // console.log('No color data extracted.')
        return []
    }

    const centers = performClustering(colorSamples, 5)
    return centers.map(center => rgbToHex(center)).filter((hex): hex is string => hex !== null)
}
