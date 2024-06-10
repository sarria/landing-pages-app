import React, { useState } from 'react'
import PropTypes from 'prop-types';
import ImagePicker from './ImagePicker'
import styles from './imageSelector.module.scss'
import '../utils/imagePicker.css'
import MyModal from './Modal' // Import the custom Modal

export default function ImageSelector({ image, imageList, onChange, name, section, component }) {
    const [display, setDisplay] = useState(false)

    const handleClick = () => {
        setDisplay(!display)
    }

    const handleClose = () => {
        setDisplay(false)
    }

    const handleChange = (image) => {
        onChange(name, image.src, section, component)
        handleClose()
    }

    return (
        <div className={styles.root}>
            <div className={styles.wrapper}>
                <div className={styles.imageBox} onClick={handleClick}>
                    <div className={styles.image} style={{ backgroundImage: `url(${image})` }} />
                </div>
                <MyModal isOpen={display} onRequestClose={handleClose} contentLabel="Image Editor" className={styles.modal}>
                    <ImagePicker
                        images={imageList.map((image, i) => ({ src: image, value: i }))}
                        onPick={handleChange}
                    />
                </MyModal>
            </div>
        </div>
    )
}

ImageSelector.propTypes = {
    image: PropTypes.string.isRequired,
    imageList: PropTypes.arrayOf(
        PropTypes.shape({
            src: PropTypes.string.isRequired,
        })
    ).isRequired,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    section: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
