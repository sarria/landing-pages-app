import Image from 'next/legacy/image'
import React from 'react'
import styles from './logo.module.scss'

const Logo = () => {
    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <Image
                    src="https://townsquareignite.s3.amazonaws.com/landing-pages/assets/ignite-logo.svg"
                    alt="Ignite Logo"
                    layout="fill" // This makes the image fill its parent container
                    objectFit="contain" // Keeps the aspect ratio while filling the height or width
                    unoptimized={true}
                    priority
                />
            </div>
        </div>
    )
}

export default Logo
