import React from 'react'
import clsx from 'clsx'
import styles from './progressTracker.module.scss'

const ProgressTracker = ({variables, runScrape, runAnalysis, runCreate}) => {
    const scrapeCompleted = !variables.scraping && variables.scraped
    const analyzeCompleted = !variables.analyzing && variables.analyzed
    const createCompleted = !variables.creating && variables.created
    const completed = scrapeCompleted && analyzeCompleted

    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <div onClick={completed ? runScrape : () => {}} className={clsx(styles.point, {[styles.completed]: scrapeCompleted})} data-label="Scrape">
                    {variables.scraping && <span className={styles.loader}></span>}
                    {scrapeCompleted && <div className={styles.check}></div>}
                </div>
                <div onClick={completed ? runAnalysis : () => {}} className={clsx(styles.point, {[styles.completed]: analyzeCompleted})} data-label="AI Analysis">
                    {variables.analyzing && <span className={styles.loader}></span>}
                    {analyzeCompleted && <div className={styles.check}></div>}
                </div>
                <div onClick={completed && variables.created ? runCreate : () => {}} className={clsx(styles.point, {[styles.completed]: createCompleted})} data-label="Create Page">
                    {variables.creating && <span className={styles.loader}></span>}
                    {createCompleted && <span className={styles.check}></span>}
                </div>
            </div>
        </div>
    )
}

export default ProgressTracker
