import React from 'react'

let container_style = {
    width: 'fit-content',
    borderRadius: 10,
    overflow: 'hidden',
}

let temp_style = {
    backgroundColor: 'none',
    width: 'fit-content',
    linbeHeight: '41px',
    padding: '5px 10px 10px 10px',
    fontWeight: 'bold',
    textShadow: '1px 1px #2b2b2b',
}

const info_style = {
    width: 'fit-content',
    padding: '0 14px',
}

const roundUpIfNeeded = value => {

    const n = Number(value)

    if(!Number.isFinite(n)) return value

    if(Number.isInteger(n)) return n

    return Math.ceil(n)
}

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

    if(settings && settings?.temperature_format === 'c') {
        format = 'c'
    }

    if(format === 'c') {

        if(temp_celcius !== null) {
            temperature = temp_celcius
        } 

        if(temp_celcius === null && temp_fahrenheit !== null) {
            temperature = Math.round((temp_fahrenheit - 32) * 5 / 9)
        }
    }

    if(format === 'f') {

        if(temp_fahrenheit !== null) {
            temperature = temp_fahrenheit
        }

        if(temp_fahrenheit === null && temp_celcius !== null) {
            temperature = Math.round((temp_celcius * 9 / 5) + 32)
        }
    }

    const t = temperature !== null ? `${roundUpIfNeeded(temperature)}°${format}`: '--'
    const h = humidity !== null ? `| ${roundUpIfNeeded(humidity)}% RH`: ''
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

        <div className='txt-center fs40' style={instanceTempStyle}>{t}</div>

        <div className='txt-left' style={info_style}>

            <h4>{title}</h4>

            <div className='txt-center'>
                <span style={infoTempStyle}>{t}</span> {seperator} {h}
            </div>
        </div>
    </div>
}

export default GenericClimateSensor
