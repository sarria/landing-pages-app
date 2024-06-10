// components/ImagePicker.js
import React from 'react'
// import Image from 'next/image'
import styles from './imagePicker.module.scss'

const ImagePicker = ({ images, onPick }) => {
    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                {images.map((image, index) => (
                    <div
                        key={index}
                        onClick={() => onPick(image)}
                        className={styles.imageBox}
                    >
                        <div
                            className={styles.image}
                            style={{ backgroundImage: `url(${image.src})` }}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ImagePicker
