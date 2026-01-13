import React from 'react'

let container_style = {
    border: '1px solid transparent',
    borderRadius: '10px',
    width: '100%',
    height: '100%',
    minWidth: '235px',
}

let temp_style = {
    flexShrink: 0,
    borderRadius: '50%',
    width: '65px',
    height: '65px',
    textAlign: 'center',
    margin: '12px 14px',
    fontSize: '22px',
    fontWeight: 'bold',
    padding: '14px 0',
}

const info_style = {
    fontSize: '18px',
    width: 'fit-content',
    padding: '0 10px 0 0',
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
    const seperator = (temperature !== null && humidity !== null) ? <span style={{color: theme.palette.text.secondary}}>|</span>: ''

    const tempColor = (t, u, th) => (
        f => {
            const colors = [
                th.palette.tertiary.dark,
                th.palette.tertiary.main,
                th.palette.info.main,
                th.palette.info.light,
                th.palette.success.light,
                th.palette.success.main,
                th.palette.warning.light,
                th.palette.error.light,
                th.palette.error.main
            ]

            if(f <= 0) return colors[0]
            if(f <= 16) return colors[1]
            if(f <= 32) return colors[2]
            if(f <= 55) return colors[3]
            if(f <= 65) return colors[4]
            if(f <= 80) return colors[5]
            if(f <= 90) return colors[6]
            if(f <= 100) return colors[7]
            if(f >= 101) return colors[8]
        }
    )(u === 'f' ? t : (t * 9 / 5 + 32))

    const tcolor = tempColor(temperature, format, theme)
    const infoTempStyle = { color: tcolor, fontWeight: 'bold' }
    const instanceContainerStyle = { 
        ...container_style,
        boxShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        background:
            `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box,
            linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.shadow}) border-box`,
    }
    const instanceTempStyle = { 
        ...temp_style, 
        textShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        //backgroundColor: tcolor,
        outline: `3px solid ${tcolor}`,
        backgroundColor: theme.palette.background.paper,
    }

    return <div className='flx align-center justify-center' style={instanceContainerStyle}>

        <div style={instanceTempStyle}>{t}</div>

        <div className='txt-center' style={info_style}>

            <h4>{title}</h4>

            <div style={{ paddingTop: '5px' }}>
                <span style={infoTempStyle}>{tou}</span> {seperator} {h}
            </div>
        </div>
    </div>
}

export default GenericClimateSensor