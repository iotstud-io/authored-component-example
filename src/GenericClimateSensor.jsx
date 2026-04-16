import React from 'react'

import { c_to_f, f_to_c, roundUpIfNeeded, tempColor } from './Functions'

const GenericClimateSensor = ({ 
    title='Climate Sensor',
    theme,
    temp_celcius=null, 
    temp_fahrenheit=null, 
    humidity=null,
    settings={},
}) => {

    let format = 'f'
    let temperature = null
    let temperature_opposite_unit = null

    if(settings?.temperature_format === 'c') {
        format = 'c'
    }

    if(format === 'c') {

        if(temp_celcius !== null) {
            temperature = temp_celcius
            temperature_opposite_unit = c_to_f(temp_celcius)
        } 

        if(temp_celcius === null && temp_fahrenheit !== null) {
            temperature = f_to_c(temp_fahrenheit)
            temperature_opposite_unit = temp_fahrenheit
        }        
    }

    if(format === 'f') {

        if(temp_fahrenheit !== null) {
            temperature = temp_fahrenheit
            temperature_opposite_unit = f_to_c(temp_fahrenheit)
        }

        if(temp_fahrenheit === null && temp_celcius !== null) {
            temperature = c_to_f(temp_celcius)
            temperature_opposite_unit = temp_celcius
        }
    }

    const t = temperature !== null ? `${roundUpIfNeeded(temperature)}°${format}`: '--'
    const tou = temperature_opposite_unit !== null ? `${roundUpIfNeeded(temperature_opposite_unit)}°${format === 'f' ? 'c': 'f'}`: '--'
    const h = humidity !== null ? `${roundUpIfNeeded(humidity)}% RH`: ''
    const seperator = (temperature !== null && humidity !== null) ? <span style={{color: theme.palette.text.secondary}}>|</span>: ''
    const tcolor = tempColor(temperature, format, theme)
    const infoTempStyle = { color: tcolor, fontWeight: 'bold' }
    const instanceContainerStyle = { 
        boxShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        background:
            `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box,
            linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.shadow}) border-box`,
    }
    const instanceTempStyle = { 
        textShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        //backgroundColor: tcolor,
        outline: `3px solid ${tcolor}`,
        backgroundColor: theme.palette.background.paper,
    }

    return <div className='climate-card flx align-center justify-left' style={instanceContainerStyle}>

        <div className='climate-card_temp' style={instanceTempStyle}>{t}</div>

        <div className='climate-card_info txt-center'>

            <h4>{title}</h4>

            <div className="climate-card_info_subtitle">
                <span style={infoTempStyle}>{tou}</span> {seperator} {h}
            </div>
        </div>
    </div>
}

export default GenericClimateSensor
