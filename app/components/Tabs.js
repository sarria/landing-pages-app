'use client'

import Button from '../elements/Button'
import styles from './tabs.module.scss'

export default function Tabs({setVariables, variables}) {

    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <Button
                    disabled=""
                    label="Generator"
                    isCurrent={variables.activeTab=='Generator'}
                    onClick={() => setVariables(prevVariables => ({...prevVariables, activeTab: 'Generator' }))}
                />
                <Button
                    disabled={!variables.scraped}
                    label="Editor"
                    isCurrent={variables.activeTab=='Editor'}
                    onClick={() => setVariables(prevVariables => ({...prevVariables, activeTab: 'Editor' }))}
                />
            </div>
        </div>
    )
}
