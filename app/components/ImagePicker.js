// components/ImagePicker.js
import React from 'react'
import PropTypes from 'prop-types';
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

ImagePicker.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
            src: PropTypes.string.isRequired,
        })
    ).isRequired,
    onPick: PropTypes.func.isRequired,
};

export default ImagePicker
