'use client'

import React, { useState, useEffect, useRef } from 'react'
import { handleScrape } from './services/handleScrape'
import { handleChatGPT } from './services/handleChatGPT'
import { makeLandingPage } from './services/makeLandingPage'
import {
    defaultObjectives, defaultVertical, defaultAudience,
    initialVariablesState, initialDataState
} from './data/initialStates'
import styles from './styles/page.module.scss'
import Header from './components/Header'
import Title from './components/Title'
import Tabs from './components/Tabs'
import Generator from './components/Generator'
import Editor from './components/Editor'
import ProgressTracker from './components/ProgressTracker'
import Error from './components/Error'
import ProgressBar from './components/progressBar'

// Define types for the state variables
type DataState = typeof initialDataState
type VariablesState = typeof initialVariablesState

export default function Home() {
    const [data, setData] = useState<DataState>(initialDataState)
    const [variables, setVariables] = useState<VariablesState>(initialVariablesState)

    // Refs to always have the latest state
    const dataRef = useRef(data)
    const variablesRef = useRef(variables)

    // Ref Pattern: Use a ref to keep track of the most current state. This ensures that asynchronous functions can always access the latest state without relying on closures capturing the state.
    useEffect(() => {
        dataRef.current = data
        variablesRef.current = variables
    }, [data, variables])

    useEffect(() => {
        console.log('Starting the tool by fetching variables options from S3')

        const fetchData = async () => {
            try {
                const response = await fetch('/api/s3')
                const options = await response.json()

                // Dropdown options
                const objectives = options.objectives.map((item: string) => ({ value: item, label: item }))
                const vertical = options.vertical.map((item: string) => ({ value: item, label: item }))
                const audience = options.audience.map((item: string) => ({ value: item, label: item }))
                const selectDefaults = {
                    objectives: defaultObjectives(objectives),
                    vertical: defaultVertical(vertical),
                    audience: defaultAudience(audience)
                }
                const progressMessages = options.progressMessages

                setVariables(prevVariables => ({
                    ...prevVariables,
                    ...selectDefaults,
                    selectDefaults,
                    loadingOptions: false,
                    options: {
                        ...prevVariables.options,
                        objectives,
                        vertical,
                        audience,
                        progressMessages
                    }
                }))
            } catch (error) {
                console.error('Failed to fetch data:', error)
            }
        }

        fetchData()
    }, [])

    const runScrape = async () => {
        setVariables(prevVariables => ({...prevVariables, scraping: true, error: {...prevVariables.error,scrape: {message: '', debug: ''}}}))
        await handleScrape(dataRef.current.url, setData, setVariables)
        setVariables(prevVariables => ({...prevVariables, scraping: false, scraped: true, activeTab: 'Editor'}))
    }

    const runAnalysis = async () => {
        setVariables(prevVariables => ({...prevVariables, analyzing: true, error: {...prevVariables.error,chatgpt: {message: '', debug: ''}}}))
        await handleChatGPT(dataRef.current.url, setData, variablesRef.current, setVariables)
        setVariables(prevVariables => ({...prevVariables, analyzing: false, analyzed: true}))
    }

    const runCreate = async () => {
        setVariables(prevVariables => ({...prevVariables, creating: true}))
        await makeLandingPage(dataRef.current, setData, variablesRef.current, setVariables)
        setVariables(prevVariables => ({...prevVariables, creating: false}))
    }

    const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // console.log('Generate Clicked!')

        await runScrape()
        await runAnalysis()

        setVariables(prevVariables => ({
            ...prevVariables,
            generateStarted: false
        }))

    }

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await runCreate()
    }

    const disabledBtns = !data.url || variables.objectives.length === 0 || (variables.audience.length === 0 && variables.overrides.audience==='') || (variables.vertical.length === 0 && variables.overrides.vertical==='')  || variables.scraping || variables.analyzing || variables.creating

    return (
        <>
            <Header />
            <div className={styles.root}>
                <div className={styles.wrapper}>
                    <Title />
                    <ProgressTracker
                        variables={variables}
                        runScrape={runScrape}
                        runAnalysis={runAnalysis}
                        runCreate={runCreate}
                    />
                    {/* <ProgressBar
                        step={variables.progress.step}
                        percentage={variables.progress.percentage}
                    /> */}
                    <Error
                        error={variables.error}
                        runScrape={runScrape}
                        runAnalysis={runAnalysis}
                    />
                    <Tabs
                        setVariables={setVariables}
                        variables={variables}
                    />
                    {variables.activeTab === 'Generator' && (
                        <Generator
                            key="generator-key"
                            handleGenerate={handleGenerate}
                            data={data}
                            setData={setData}
                            variables={variables}
                            setVariables={setVariables}
                            disabledBtns={disabledBtns}
                        />
                    )}
                    {variables.activeTab === 'Editor' && (
                        <Editor
                            key="editor-key"
                            handleCreate={handleCreate}
                            data={data}
                            setData={setData}
                            variables={variables}
                            setVariables={setVariables}
                        />
                    )}
                </div>
            </div>
        </>
    )
}
