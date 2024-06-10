import React, { useState } from 'react'
import PropTypes from 'prop-types';
import styles from './error.module.scss'
import MyModal from './Modal' // Import the custom Modal

const Error = ({ error, runScrape, runAnalysis }) => {
    const [display, setDisplay] = useState(false)

    // Destructure the error object to make the code cleaner
    const { scrape = {}, chatgpt = {} } = error
    const scrapeMessage = scrape.message || ''
    const chatgptMessage = chatgpt.message || ''

    const handleClick = () => {
        setDisplay(!display)
    }

    const handleClose = () => {
        setDisplay(false)
    }

    return (scrapeMessage !== '' || chatgptMessage !== '') && (
        <>
            <div className={styles.root}>
                <div className={styles.wrapper}>
                    {scrapeMessage !== '' && (
                        <div className={styles.scrape}>
                            {scrapeMessage}
                            <br /><br />
                            You can try again by clicking the "Scrape" button at the top of the page or by <span className={styles.link} onClick={runScrape}>clicking here.</span>
                        </div>
                    )}
                    {chatgptMessage !== '' && (
                        <div className={styles.chatgpt}>
                            {scrapeMessage !== '' && <p><br/></p>}
                            {chatgptMessage}
                            <br /><br />
                            You can try again by clicking the "AI Analysis" button at the top of the page or by <span className={styles.link} onClick={handleClick}>clicking here.</span>.
                            {/* You can also <span className={styles.link} onClick={runAnalysis}>click here</span> to copy and send the result for debugging */}
                        </div>
                    )}
                </div>
                <MyModal isOpen={display} onRequestClose={handleClose} className={styles.modal}>
                    {chatgpt.debug}
                </MyModal>
            </div>
        </>
    )
}

Error.propTypes = {
    error: PropTypes.shape({
        scrape: PropTypes.shape({
            message: PropTypes.string,
        }),
        chatgpt: PropTypes.shape({
            message: PropTypes.string,
            debug: PropTypes.string,
        }),
    }).isRequired,
    runScrape: PropTypes.func.isRequired,
    runAnalysis: PropTypes.func.isRequired,
};

export default Error
