'use client'

import clsx from 'clsx'
import styles from './buttons.module.scss'

function Button({ label, disabled, onClick, className, isCurrent }) {
    return (
        <button
            disabled={disabled}
            className={clsx(styles.tab, {[styles.isCurrent]: isCurrent})}
            onClick={onClick}>
            {label}
        </button>
    )
}

export default Button
