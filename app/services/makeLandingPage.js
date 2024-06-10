
export const makeLandingPage = async (data, setData, variables, setVariables) => {
    // console.log('Making the Landing Page', data)

    try {
        const response = await fetch('https://cms-routes.vercel.app/api/cms-routes/landing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        // console.log('landing page result: ', result)

        if (result && result.domain) {
            var url = result.domain.startsWith('https://') ? result.domain : 'https://' + result.domain
            window.open(url, 'LandingPageWindow')

        } else {
            console.error('No domain returned from makeLandingPage')
        }

        setVariables(prevVariables => ({...prevVariables, created: true}))

    } catch (error) {
        console.error('Failed to create the Landing Page', error)
    }

}
