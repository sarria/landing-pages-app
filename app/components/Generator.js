import React from 'react'
import formStyles from '../styles/form.module.scss'
import styles from './generator.module.scss'
import { LoadingGenerator } from './Loaders'
import Button from '../elements/Button'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'

const animatedComponents = makeAnimated()

export default function Generator({ handleGenerate, data, setData, variables, setVariables, disabledBtns }) {
    // Function to handle URL changes
    function handleURLChange(event) {
        setData({ ...data, url: event.target.value })
    }

    // Function to handle objective selection changes
    function handleObjectiveChange(selectedOption) {
        setVariables({ ...variables, objectives: selectedOption })
    }

    function handleAudienceChange(selectedOption) {
        if (selectedOption && selectedOption.target) {
            setVariables({
                ...variables,
                audience: [],
                overrides: {
                    ...variables.overrides,
                    audience: selectedOption.target.value
                }
            })

            if (selectedOption.target.value === '') {
                handleAudienceChange(variables.selectDefaults.audience)
            }
        } else {
            setVariables({
                ...variables,
                audience: selectedOption,
                overrides: {
                    ...variables.overrides,
                    audience: ''
                }
            })
        }
    }

    function handleVerticalChange(selectedOption) {
        if (selectedOption && selectedOption.target) {
            setVariables({
                ...variables,
                vertical: [],
                overrides: {
                    ...variables.overrides,
                    vertical: selectedOption.target.value
                }
            })

            if (selectedOption.target.value === '') {
                handleVerticalChange(variables.selectDefaults.vertical)
            }
        } else {
            setVariables({
                ...variables,
                vertical: selectedOption,
                overrides: {
                    ...variables.overrides,
                    vertical: ''
                }
            })
        }
    }

    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <form className={formStyles.root}>

                    <div className={formStyles.field}>
                        <label htmlFor="title" className={formStyles.centered}>Advertiser Website</label>
                        <input
                            type="url"
                            name="url"
                            value={data.url}
                            onChange={handleURLChange}
                        />
                    </div>

                    {variables.loadingOptions && <div className={styles.loading}><LoadingGenerator /></div>}

                    {!variables.loadingOptions && (
                        <>
                            {variables.options.objectives.length !== 0 && (
                                <div className={formStyles.field}>
                                    <label htmlFor="objectives" className={formStyles.centered}>Campaign Objectives:</label>
                                    <Select
                                        closeMenuOnSelect={true}
                                        components={animatedComponents}
                                        value={variables.objectives}
                                        isMulti
                                        options={variables.options.objectives}
                                        onChange={handleObjectiveChange}
                                    />
                                </div>
                            )}

                            <div className={formStyles.field}>
                                <label htmlFor="audience" className={formStyles.centered}>Target Audience:</label>
                                <div className={formStyles.pair}>
                                    <div className={formStyles.pairLeft}>
                                        {variables.options.audience.length !== 0 && (
                                            <Select
                                                value={variables.audience}
                                                options={variables.options.audience}
                                                name="audience"
                                                onChange={handleAudienceChange}
                                                closeMenuOnSelect={true}
                                            />
                                        )}
                                    </div>
                                    <div className={formStyles.pairRight}>
                                        <input
                                            type="text"
                                            name="audience"
                                            value={variables.overrides.audience}
                                            onChange={handleAudienceChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={formStyles.field}>
                                <label htmlFor="vertical" className={formStyles.centered}>Business Vertical:</label>
                                <div className={formStyles.pair}>
                                    <div className={formStyles.pairLeft}>
                                        {variables.options.vertical.length !== 0 && (
                                            <Select
                                                value={variables.vertical}
                                                options={variables.options.vertical}
                                                name="vertical"
                                                onChange={handleVerticalChange}
                                                isMulti
                                                closeMenuOnSelect={true}
                                                components={animatedComponents}
                                            />
                                        )}
                                    </div>
                                    <div className={formStyles.pairRight}>
                                        <input
                                            type="text"
                                            name="vertical"
                                            // placeholder='Vertical Override'
                                            value={variables.overrides.vertical}
                                            onChange={handleVerticalChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="button"
                                onClick={handleGenerate}
                                disabled={disabledBtns}
                                label="Generate Content"
                            />

                        </>
                    )}

                </form>
            </div>

        </div>
    )
}
