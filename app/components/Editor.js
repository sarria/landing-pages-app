'use client'

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faCirclePlus } from '@fortawesome/pro-solid-svg-icons'
import clsx from 'clsx'
import formStyles from '../styles/form.module.scss'
import { sortColorsByRGB } from '../utils/colorUtils'
import { LoadingGeneralInfo, LoadingColors, LoadingSocial, LoadingTop, LoadingMiddle, LoadingBottom } from './Loaders'
import styles from './editor.module.scss'
import Button from '../elements/Button'
import ColorPicker from './ColorPicker'
import ImageSelector from './ImageSelector'
import TextOptions from './TextOptions'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

const animatedComponents = makeAnimated()

// Function to extract color keys
const getColorKeys = (colorArray) => {
    return colorArray.map(color => color.key)
}

const getDefault = (selectedOption, options) => {
    return selectedOption && selectedOption.target ? (selectedOption.target.value === '' ? (options[0]?.value || '') : selectedOption.target.value) : selectedOption.value
}

export default function Editor({handleCreate, data, setData, variables, setVariables}) {
    const textColors = variables.scrapedData?.styles.colors ? getColorKeys(variables.scrapedData.styles.colors) : []
    const backgroundColors = variables.scrapedData?.styles.backgroundColors ? getColorKeys(variables.scrapedData.styles.backgroundColors) : []
    const colors = sortColorsByRGB([...textColors, ...backgroundColors])
    const imageList = variables.scrapedData ? [...variables.scrapedData.images, ...variables.scrapedData.styles.backgroundImages].map(image => image.url || image.key) : []
    // console.log('imageList', imageList)

    function handleColorChange(colorKey, color) {
        setData({
            ...data,
            colors: {
                ...data.colors,
                [colorKey]: color
            }
        })
    }

    // function handleDataChange(event) {
    //     // // console.log('handleDataChange', event)
    //     changeData(event.target.name, event.target.value)
    // }

    function changeData(key, value) {
        console.log(key, value)
        setData({
            ...data,
            [key]: value
        })
    }

    function handleAPIKeyChange(event) {
        const { value } = event.target
        const component = event.target.getAttribute('component')
        setData(prevData => {
            // Create a new object for immutability
            const newData = { ...prevData }
            newData.customComponents[component].apiKey = value
            return newData
        })
    }

    function changeSectionData(key, value, section) {
        // // console.log(key, value, section)
        setData(prevData => {
            // Create a new object for immutability
            const newData = { ...prevData }
            newData.page.sections[section][key] = value
            return newData
        })
    }

    function handleSectionDataChange(event) {
        // // console.log('handleSectionDataChange', event)
        const { type, name, value} = event.target
        const section = event.target.getAttribute('section')
        if (type == 'text') {
            changeSectionData(name, value, section)
        }
        if (type == 'textarea') {
            changeSectionData(name, value, section)
        }
    }

    function changeSectionComponentData(name, value, section, component) {
        setData(prevData => {
            // Create a new object for immutability
            const newData = { ...prevData }
            newData.page.sections[section].components[component][name] = value
            return newData
        })
    }

    function handleSectionComponentData(event) {
        const { name, value } = event.target
        const section = event.target.getAttribute('section')
        const component = event.target.getAttribute('component')

        changeSectionComponentData(name, value, section, component)
    }

    function handleAddSocialLink() {
        setData(prevData => {
            // Create a new object for immutability
            const newData = {
                ...prevData,
                socials: [...prevData.socials, '']
            }
            return newData
        })
    }

    function handleDeleteSocialLink(index) {
        setData(prevData => {
            // Create a new object for immutability and update socials directly
            const newData = {
                ...prevData,
                socials: prevData.socials.filter((_, i) => i !== index)
            }
            return newData
        })
    }

    function handleSocialLinkChange(index, value) {
        setData(prevData => {
            const newSocials = prevData.socials.map((link, i) => i === index ? value : link)
            return {
                ...prevData,
                socials: newSocials
            }
        })
    }

    function handleTextSizeChange(event, section, field) {
        console.log(event.target.value, section, field)

        setData(prevData => {
            // Create a new object for immutability and update socials directly
            const newSections = prevData.page.sections.map((sec, index) => {
                if (index === section) {
                    return {
                        ...sec,
                        [field]: sec[event.target.value],
                        [field + 'Size']: event.target.value
                    }
                }
                return sec
            })

            return {
                ...prevData,
                page: {
                    ...prevData.page,
                    sections: newSections
                }
            }
        })
    }

    function handleEmailChange(selectedOption) {
        if (selectedOption && selectedOption.target) {
            // Set Override and clear out selected
            setVariables({
                ...variables,
                email: [],
                overrides: {
                    ...variables.overrides,
                    email: selectedOption.target.value
                }
            })

            // If override is empty select the first option if any
            if (selectedOption.target.value === '') {
                handleEmailChange(variables.options.emails[0] || '')
            }
        } else {
            // Set selected and clear out override
            setVariables({
                ...variables,
                email: selectedOption,
                overrides: {
                    ...variables.overrides,
                    email: ''
                }
            })
        }

        setData(prevData => ({
            ...prevData,
            email: getDefault(selectedOption, variables.options.emails)
        }))
    }

    function handlePhoneChange(selectedOption) {
        if (selectedOption && selectedOption.target) {
            // Set Override and clear out selected
            setVariables({
                ...variables,
                phone: [],
                overrides: {
                    ...variables.overrides,
                    phone: selectedOption.target.value
                }
            })

            // If override is empty select the first option if any
            if (selectedOption.target.value === '') {
                handlePhoneChange(variables.options.phones[0] || '')
            }
        } else {
            // Set selected and clear out override
            setVariables({
                ...variables,
                phone: selectedOption,
                overrides: {
                    ...variables.overrides,
                    phone: ''
                }
            })
        }

        setData(prevData => ({
            ...prevData,
            phoneNumber: getDefault(selectedOption, variables.options.phones)
        }))
    }

    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <form className={formStyles.root}>

                    <h2>General Information</h2>

                    {variables.scraping && <LoadingGeneralInfo />}

                    {!variables.scraping && (
                        <div className={styles.box}>
                            <div className={formStyles.field}>
                                <label htmlFor="title">Logo</label>
                                <div className={styles.ColorPicker}>
                                    <ImageSelector
                                        name='logo'
                                        image={data.logo}
                                        imageList={imageList}
                                        onChange={changeData}
                                    />
                                </div>
                            </div>
                            <div className={styles.rightInputs}>
                                <div className={formStyles.field}>
                                    <label htmlFor="title">Phone Number</label>
                                    <div className={formStyles.pair}>
                                        <div className={formStyles.pairLeft}>
                                            <Select
                                                value={variables.phone}
                                                options={variables.options.phones}
                                                name="emails"
                                                onChange={handlePhoneChange}
                                                closeMenuOnSelect={true}
                                                components={animatedComponents}
                                            />
                                        </div>
                                        <div className={formStyles.pairRight}>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={variables.overrides.phone}
                                                onChange={handlePhoneChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={formStyles.field}>
                                    <label htmlFor="title">Email</label>
                                    <div className={formStyles.pair}>
                                        <div className={formStyles.pairLeft}>
                                            <Select
                                                value={variables.email}
                                                options={variables.options.emails}
                                                name="emails"
                                                onChange={handleEmailChange}
                                                closeMenuOnSelect={true}
                                                components={animatedComponents}
                                            />
                                        </div>
                                        <div className={formStyles.pairRight}>
                                            <input
                                                type="text"
                                                name="email"
                                                value={variables.overrides.email}
                                                onChange={handleEmailChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={formStyles.field}>
                                    <label htmlFor="title">Web Chat API Key</label>
                                    <input
                                        type="text"
                                        name="webChatapiKey"
                                        component="0"
                                        value={data.customComponents[0].apiKey}
                                        onChange={handleAPIKeyChange}
                                    />
                                </div>
                                <div className={formStyles.field}>
                                    <label htmlFor="title">Schedule Engine API Key</label>
                                    <input
                                        type="text"
                                        name="scheduleapiKey"
                                        component="1"
                                        value={data.customComponents[1].apiKey}
                                        onChange={handleAPIKeyChange}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <h2>Colors</h2>

                    {variables.scraping && <LoadingColors />}

                    {!variables.scraping && (
                        <div className={styles.box}>
                            <div className={formStyles.field}>
                                <label htmlFor="title" className={formStyles.centered}>Primary</label>
                                <div className={styles.ColorPicker}>
                                    <ColorPicker
                                        colorKey='primary'
                                        color={data.colors.primary}
                                        colors={colors}
                                        onChange={handleColorChange}
                                    />
                                </div>
                            </div>
                            <div className={formStyles.field}>
                                <label htmlFor="title" className={formStyles.centered}>Accent</label>
                                <div className={styles.ColorPicker}>
                                    <ColorPicker
                                        colorKey='accent'
                                        color={data.colors.accent}
                                        colors={colors}
                                        onChange={handleColorChange}
                                    />
                                </div>
                            </div>
                            <div className={formStyles.field}>
                                <label htmlFor="title" className={formStyles.centered}>Tertiary</label>
                                <div className={styles.ColorPicker}>
                                    <ColorPicker
                                        colorKey='tertiary'
                                        color={data.colors.tertiary}
                                        colors={colors}
                                        onChange={handleColorChange}
                                    />
                                </div>
                            </div>
                            <div className={formStyles.field}>
                                <label htmlFor="title" className={formStyles.centered}>Header Background</label>
                                <div className={styles.ColorPicker}>
                                    <ColorPicker
                                        colorKey='headerBackground'
                                        color={data.colors.headerBackground}
                                        colors={colors}
                                        onChange={handleColorChange}
                                    />
                                </div>
                            </div>
                            <div className={formStyles.field}>
                                <label htmlFor="title" className={formStyles.centered}>Footer Text</label>
                                <div className={styles.ColorPicker}>
                                    <ColorPicker
                                        colorKey='footerText'
                                        color={data.colors.footerText}
                                        colors={colors}
                                        onChange={handleColorChange}
                                    />
                                </div>
                            </div>
                            <div className={formStyles.field}>
                                <label htmlFor="title" className={formStyles.centered}>Footer Background</label>
                                <div className={styles.ColorPicker}>
                                    <ColorPicker
                                        colorKey='footerBackground'
                                        color={data.colors.footerBackground}
                                        colors={colors}
                                        onChange={handleColorChange}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <h2 className={styles.socialLinksHeader}>
                        <div>Social Links</div>
                        <div onClick={handleAddSocialLink} className={styles.addIco}>
                            <FontAwesomeIcon icon={faCirclePlus} data-testid="icon" />
                        </div>
                    </h2>

                    {variables.scraping && <LoadingSocial />}

                    {!variables.scraping && (
                        <div className={clsx(formStyles.field, styles.socialLinks)}>
                            {data.socials.map((link, index) => (
                                <div key={index} className={styles.socialLink}>
                                    <input
                                        type="text"
                                        id={`social-url-${index}`}
                                        value={link}
                                        onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                                    />
                                    <div onClick={() => handleDeleteSocialLink(index)} className={styles.deleteIco}>
                                        <FontAwesomeIcon icon={faTrashCan} data-testid="icon" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <h2>Top Section</h2>

                    {variables.analyzing && <LoadingTop />}

                    {!variables.analyzing && (
                        <>
                            <div className={formStyles.field}>
                                <label htmlFor="title">Headline</label>
                                <input
                                    type="text"
                                    name="headline"
                                    section="0"
                                    value={data.page.sections[0].headline}
                                    onChange={handleSectionDataChange}
                                />
                            </div>
                            <div className={formStyles.field}>
                                <label htmlFor="title">Secondary Headline</label>
                                <input
                                    type="text"
                                    name="subheader"
                                    section="0"
                                    value={data.page.sections[0].subheader}
                                    onChange={handleSectionDataChange}
                                />
                            </div>
                            <div className={formStyles.field}>
                                <label htmlFor="title">Action Link Text</label>
                                <input
                                    type="text"
                                    name="ctaText"
                                    section="0"
                                    value={data.page.sections[0].ctaText}
                                    onChange={handleSectionDataChange}
                                />
                            </div>
                            <div className={formStyles.field}>
                                <label htmlFor="title">Action Link</label>
                                <input
                                    type="text"
                                    name="ctaLink"
                                    section="0"
                                    value={data.page.sections[0].ctaLink}
                                    onChange={handleSectionDataChange}
                                />
                            </div>

                            <div className={styles.box}>
                                <div className={formStyles.field}>
                                    <label htmlFor="title">Hero Image</label>
                                    <div className={styles.imageEditor}>
                                        <ImageSelector
                                            name="image"
                                            section="0"
                                            image={data.page.sections[0].image}
                                            imageList={imageList}
                                            onChange={changeSectionData}
                                        />
                                    </div>
                                </div>
                                <div className={formStyles.field}>
                                    <label htmlFor="title">Section Image</label>
                                    <div className={styles.imageEditor}>
                                        <ImageSelector
                                            name="image"
                                            section="0"
                                            component="0"
                                            image={data.page.sections[0].components[0].image}
                                            imageList={imageList}
                                            onChange={changeSectionComponentData}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <h2>Middle Section</h2>

                    {variables.analyzing && <LoadingMiddle />}

                    {!variables.analyzing && (
                        <>
                            <div className={formStyles.field}>
                                <label htmlFor="title">Headline</label>
                                <input
                                    type="text"
                                    name="headline"
                                    section="1"
                                    value={data.page.sections[1].headline}
                                    onChange={handleSectionDataChange}
                                />
                            </div>
                            <div className={formStyles.field}>
                                <label htmlFor="title">Secondary Headline</label>
                                <input
                                    type="text"
                                    name="subheader"
                                    section="1"
                                    value={data.page.sections[1].subheader}
                                    onChange={handleSectionDataChange}
                                />
                            </div>
                            <div className={formStyles.field}>
                                <label htmlFor="title">Action Link Text</label>
                                <input
                                    type="text"
                                    name="ctaText"
                                    section="1"
                                    value={data.page.sections[1].ctaText}
                                    onChange={handleSectionDataChange}
                                />
                            </div>
                            <div className={formStyles.field}>
                                <label htmlFor="title">Action Link</label>
                                <input
                                    type="text"
                                    name="ctaLink"
                                    section="1"
                                    value={data.page.sections[1].ctaLink}
                                    onChange={handleSectionDataChange}
                                />
                            </div>
                            <div className={formStyles.field}>
                                <label htmlFor="desc">Description:</label>
                                <textarea
                                    type="textarea"
                                    name="desc"
                                    section="1"
                                    value={data.page.sections[1].desc}
                                    onChange={handleSectionDataChange}
                                />
                                <TextOptions
                                    value={data.page.sections[1].descSize}
                                    onChange={(event) => handleTextSizeChange(event, 1, 'desc')}
                                    name="desc"
                                />
                            </div>
                            <div className={formStyles.field}>
                                <label htmlFor="desc2">Secondary Description:</label>
                                <textarea
                                    type="textarea"
                                    name="desc2"
                                    section="1"
                                    value={data.page.sections[1].desc2}
                                    onChange={handleSectionDataChange}
                                />
                                <TextOptions
                                    value={data.page.sections[1].desc2Size}
                                    onChange={(event) => handleTextSizeChange(event, 1, 'desc2')}
                                    name="desc2"
                                />
                            </div>
                            <div className={formStyles.field}>
                                <label htmlFor="title">Video URL</label>
                                <input
                                    type="text"
                                    name="videoUrl"
                                    section="1"
                                    component="0"
                                    value={data.page.sections[1].components[0].videoUrl}
                                    onChange={handleSectionComponentData}
                                />
                            </div>
                        </>
                    )}

                    <h2>Bottom Section</h2>

                    {variables.analyzing && <LoadingBottom />}

                    {!variables.analyzing && (
                        <>

                            <div className={formStyles.field}>
                                <label htmlFor="title">Headline</label>
                                <input
                                    type="text"
                                    name="headline"
                                    section="2"
                                    value={data.page.sections[2].headline}
                                    onChange={handleSectionDataChange}
                                />
                            </div>
                            <div className={formStyles.field}>
                                <label htmlFor="title">Action Link Text</label>
                                <input
                                    type="text"
                                    name="ctaText"
                                    section="2"
                                    value={data.page.sections[2].ctaText}
                                    onChange={handleSectionDataChange}
                                />
                            </div>
                            <div className={formStyles.field}>
                                <label htmlFor="title">Action Link</label>
                                <input
                                    type="text"
                                    name="ctaLink"
                                    section="2"
                                    value={data.page.sections[2].ctaLink}
                                    onChange={handleSectionDataChange}
                                />
                            </div>

                            <div className={styles.createLandingPageBtn}>
                                <Button
                                    type="button"
                                    onClick={handleCreate}
                                    label="Create Landing Page"
                                    disabled={variables.creating}
                                />
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    )
}
