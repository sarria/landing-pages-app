// utils/colorUtils.js

// Function to sort colors by their RGB values
export function sortColorsByRGB(colors) {
    return colors.sort(function (a, b) {
        // Extracting RGB values from the string 'rgb(r, g, b)'
        var rgbA = (a.key || a).match(/\d+/g)
        var rgbB = (b.key || b).match(/\d+/g)

        if (!rgbA || !rgbB) {
            return 0 // In case of an error in matching, consider them equal
        }

        // Convert the match results to numbers
        rgbA = rgbA.map(Number)
        rgbB = rgbB.map(Number)

        // Compare red, then green, then blue
        for (var i = 0; i < 3; i++) {
            if (rgbA[i] !== rgbB[i]) {
                return rgbA[i] - rgbB[i]
            }
        }

        // If all components are equal, return 0
        return 0
    })
}
