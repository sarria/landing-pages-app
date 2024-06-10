import clsx from 'clsx'
import styles from './loaders.module.scss'

const Image = () => {
    return (
        <>
            <div className={clsx(styles.card, styles.label)}></div>
            <div className={clsx(styles.card, styles.image)}></div>
        </>
    )
}

const Input = () => {
    return (
        <div className={clsx(styles.field)}>
            <div className={clsx(styles.card, styles.label)}></div>
            <div className={clsx(styles.card, styles.input)}></div>
        </div>
    )
}

const Textarea = () => {
    return (
        <div className={clsx(styles.field)}>
            <div className={clsx(styles.card, styles.label)}></div>
            <div className={clsx(styles.card, styles.input, styles.textarea)}></div>
        </div>
    )
}

export const LoadingGenerator = () => {
    return (
        <div className={styles.generator}>
            <Input />
            <Input />
            <Input />
        </div>
    )
}

export const LoadingGeneralInfo = () => {
    return (
        <div className={styles.twoCols}>
            <div>
                <div className={clsx(styles.card, styles.label)}></div>
                <Image />
            </div>
            <div>
                <Input />
                <Input />
                <Input />
                <Input />
            </div>
        </div>
    )
}

export const LoadingColors = () => {
    return (
        <div className={styles.colors}>
            <Input />
        </div>
    )
}

export const LoadingSocial = () => {
    return (
        <div className={styles.social}>
            <Input />
        </div>
    )
}

export const LoadingTop = () => {
    return (
        <div className={styles.top}>
            <div>
                <Input />
                <Input />
                <Input />
                <Input />
            </div>
            <div className={styles.twoCols}>
                <div>
                    <Image />
                </div>
                <div>
                    <Image />
                </div>
            </div>
        </div>
    )
}

export const LoadingMiddle = () => {
    return (
        <div className={styles.middle}>
            <Input />
            <Input />
            <Input />
            <Input />
            <Textarea />
            <Textarea />
            <Input />
        </div>
    )
}

export const LoadingBottom = () => {
    return (
        <div className={styles.bottom}>
            <Input />
            <Input />
            <Input />
        </div>
    )
}