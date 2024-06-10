import styles from './progressBar.module.scss'
import clsx from 'clsx'

const ProgressBar = ({step, percentage}) => {
    // // console.log('progress',progress)
    return (
        <div className={styles.root}>
            <div className={clsx(styles.wrapper, {[styles.off]:percentage===0})}>
                <div className={styles.percentage} style={{width: `${percentage}%`}} />
                {step && <div className={styles.step}>{step}</div>}
            </div>
        </div>
    )
}

export default ProgressBar
