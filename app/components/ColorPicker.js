'use strict'

import React, { useState } from 'react'
import styles from './colorPicker.module.scss'
import { SketchPicker } from 'react-color'

export default function ColorPicker({colorKey, color, colors, onChange}) {
    const [display, setDisplay] = useState(false)

    const handleClick = () => {
        setDisplay(!display)
    }

    const handleClose = () => {
        setDisplay(false)
    }

    const handleChange = (color) => {
        onChange(colorKey, color.hex)
    }

    return (
        <div>
            <div className={ styles.swatch } onClick={ handleClick }>
                <div className={ styles.color } style={{backgroundColor: color }} />
            </div>
            { display ? <div className={ styles.popover }>
                <div className={ styles.cover } onClick={ handleClose }/>
                <SketchPicker
                    color={ color }
                    presetColors={ colors }
                    onChange={ handleChange }
                />
            </div> : null }
        </div>
    )

}

