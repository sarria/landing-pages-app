import { useState } from 'react'
import styles from './TextOptions.module.scss'

const TextOptions = ({ name, value, onChange }) => {
    const [selectedOption, setSelectedOption] = useState(value || name + 'LessText')

    const handleOptionChange = (event) => {
        const newValue = event.target.value
        setSelectedOption(newValue)
        onChange(event) // Passing the event object to maintain compatibility with the handleTextSizeChange function
    }

    // const selectedOption = data.page.section[section][name + 'Size']

    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <label>
                    <input
                        type="radio"
                        name={name + 'textOptions'}
                        value={name + 'LessText'}
                        checked={selectedOption === name + 'LessText'}
                        onChange={handleOptionChange}
                    />
                    Less Text
                </label>
                <label>
                    <input
                        type="radio"
                        name={name + 'textOptions'}
                        value={name + 'MoreText'}
                        checked={selectedOption === name + 'MoreText'}
                        onChange={handleOptionChange}
                    />
                    More Text
                </label>
                <label>
                    <input
                        type="radio"
                        name={name + 'textOptions'}
                        value={name + 'MaxText'}
                        checked={selectedOption === name + 'MaxText'}
                        onChange={handleOptionChange}
                    />
                    Max Text
                </label>
            </div>
        </div>
    )
}

export default TextOptions
