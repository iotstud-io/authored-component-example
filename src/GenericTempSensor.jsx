import React from 'react'

import { c_to_f, f_to_c, roundUpIfNeeded, tempColor } from './Functions'

const GenericTempSensor = ({ 
    title='Temperature',
    theme,
    temperature=null,
    settings={},
}) => {

    const format = settings?.temperature_format === 'c' ? 'c' : 'f'
    const t = temperature !== null ? `${roundUpIfNeeded(temperature)}°${format}`: '--'
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
        outline: `3px solid ${tcolor}`,
        backgroundColor: theme.palette.background.paper,
    }

    let temperature_opposite_unit = null
    let temperature_opposite_value = null

    if(format === 'c' && temperature !== null) {
        temperature_opposite_unit = c_to_f(temperature)
        temperature_opposite_value = `${roundUpIfNeeded(temperature_opposite_unit)}°f`
    }

    if(format === 'f' && temperature !== null) {
        temperature_opposite_unit = f_to_c(temperature)
        temperature_opposite_value = `${roundUpIfNeeded(temperature_opposite_unit)}°c`
    }

    return <div className='climate-card flx align-center justify-left' style={instanceContainerStyle}>

        <div className='climate-card_temp' style={instanceTempStyle}>{t}</div>

        <div className='climate-card_info txt-center'>

            <h4>{title}</h4>

            <div className="climate-card_info_subtitle">
                <span style={infoTempStyle}>{temperature_opposite_value}</span> 
            </div>
        </div>
    </div>
}

export default GenericTempSensor