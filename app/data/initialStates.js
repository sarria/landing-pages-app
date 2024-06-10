export const defaultObjectives = (objectives) => {
    return objectives.filter(option => ['Lead generation'].includes(option.value))
}
export const defaultAudience = (audience) => {
    return audience.find(option => option.value === 'Homeowners')
}
export const defaultVertical = (vertical) => {
    return vertical.filter(option => ['HVAC', 'Plumbing', 'Electric'].includes(option.value))
}
export const initialVariablesState = {
    activeTab: 'Generator',
    objectives: [],
    audience: [],
    vertical: [],
    phone: '',
    email: '',
    overrides: {
        audience: '',
        vertical: '',
        phone: '',
        email: ''
    },
    styles: {
        backgroundColors: [],
        backgroundImages: [],
        fontFamilies: [],
        colors: []
    },
    options: {
        objectives: [],
        audience: [],
        vertical: [],
        phones: [],
        emails: [],
        progressMessages: []
    },
    error: {
        scrape: {
            message: '',
            debug: ''
        },
        chatgpt: {
            message: '',
            debug: ''
        },
        create: {
            message: '',
            debug: ''
        }
    },
    progress: {
        step: '',
        percentage: 0
    },
    loadingOptions: true,
    generateStarted: false,
    scraped: false,
    scraping: false,
    analyzed: false,
    analyzing: false,
    created: false,
    creating: false,
}

export const initialDataState = {
    'url': '',
    'siteName': '',
    'title': '',
    'description': '',
    'logo': '',
    'favicon': '',
    'phoneNumber': '',
    'email': '',
    'colors': {
        'primary': '',
        'accent': '',
        'tertiary': '',
        'headerBackground': '',
        'footerText': '',
        'footerBackground': ''
    },
    'seo': {
        'global': {
            'aiosp_home_title': '',
            'aiosp_google_verify': '',
            'aiosp_home_description': '',
            'aiosp_page_title_format': '',
            'aiosp_description_format': '',
            'aiosp_404_title_format': ''
        }
    },
    'customComponents': [
        {
            'type': 'Webchat',
            'apiKey': ''
        },
        {
            'type': 'ScheduleEngine',
            'apiKey': ''
        }
    ],
    'page': {
        'sections': [
            {
                'headline': '',
                'subheader': '',
                'ctaText': '',
                'ctaLink': '',
                'image': '',
                'components': [
                    {
                        'type': 'coupon',
                        'image': ''
                    },
                    {
                        'type': 'form'
                    }
                ]
            },
            {
                'headline': '',
                'subheader': '',
                'desc': '',
                'desc2': '',
                'ctaText': '',
                'ctaLink': '',
                'components': [
                    {
                        'type': 'video',
                        'videoUrl': ''
                    }
                ]
            },
            {
                'headline': '',
                'ctaText': '',
                'ctaLink': '',
                'reviewHeadline': '',
                'reviews': [
                    {
                        'text': '',
                        'name': ''
                    }
                ]
            }
        ]
    },
    'socials': ['']
}

