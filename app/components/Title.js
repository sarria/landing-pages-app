import styles from './title.module.scss' // Assuming you use CSS modules

export default function Title() {
    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <div><span className={styles.gradient}>AI Landing Page</span> Builder</div>
            </div>
        </div>
    )
}
