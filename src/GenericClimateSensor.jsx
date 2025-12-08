import React from 'react'

let container_style = {
    width: 'fit-content',
    borderRadius: 10,
    overflow: 'hidden',
}

let temp_style = {
    backgroundColor: 'none',
    width: 'fit-content',
    lineHeight: '45px',
    padding: '1px 12px 6px 10px',
    fontSize: 50,
    fontWeight: 'bold',
    textShadow: '#2b2b2b 1.4px 1.4px 1px',
}

const info_style = {
    width: 'fit-content',
    padding: '0 10px',
}

const roundUpIfNeeded = value => {

    const n = Number(value)

    if(!Number.isFinite(n)) return value

    if(Number.isInteger(n)) return n

    return Math.ceil(n)
}

const c_to_f = c => (c * 9 / 5) + 32
const f_to_c = f => (f - 32) * 5 / 9

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
    const seperator = (temperature !== null && humidity !== null) ? '|': ''

    const tempColor = (t, u, th)=> (
        f => [
            th.palette.info.main,
            th.palette.info.light,
            th.palette.success.light,
            th.palette.success.main,
            th.palette.warning.light,
            th.palette.error.light,
            th.palette.error.main
        ][f <= 32 ? 0: f >= 100 ? 6: 1 + ((f-32)/68*5|0)]
    )(u==='f' ? t: t*9/5+32)

    const tcolor = tempColor(temperature, format, theme)
    const infoTempStyle = { color: tcolor }
    const instanceContainerStyle = { ...container_style, border: `1px solid ${tcolor}` }
    const instanceTempStyle = { 
        ...temp_style, 
        backgroundColor: tcolor,
        borderRight: `1px solid ${tcolor}`
    }

    return <div className='flx align-center' style={instanceContainerStyle}>

        <div className='txt-center' style={instanceTempStyle}>{t}</div>

        <div className='txt-center' style={info_style}>

            <h4>{title}</h4>

            <div>
                <span style={infoTempStyle}>{tou}</span> {seperator} {h}
            </div>
        </div>
    </div>
}

export default GenericClimateSensor