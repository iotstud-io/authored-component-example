import React from 'react';

let temp_style = {
    width: 'fit-content',
    padding: 20,
    fontWeight: 'bold',
    textShadow: '1px 1px #2b2b2b',
};

const info_style = {
    width: 'fit-content',
    padding: 10,
};

const GenericClimateSensor = ({ 
    title='Climate Sensor',
    theme,
    temp_celcius=null, 
    temp_fahrenheit=null, 
    humidity=null,
    settings={},
}) => {

    const format = settings?.temperature_format || 'f';

    let temperature = '--';
    let relative_humidity = '--';

    if(humidity !== null) {
        relative_humidity = humidity;
    }

    if(format === 'c') {

        if(temp_celcius !== null) {
            temperature = temp_celcius;
        } 

        if(temp_celcius === null && temp_fahrenheit !== null) {
            temperature = Math.round((temp_fahrenheit - 32) * 5 / 9);
        }
    }

    if(format === 'f') {

        if(temp_fahrenheit !== null) {
            temperature = temp_fahrenheit;
        }

        if(temp_fahrenheit === null && temp_celcius !== null) {
            temperature = Math.round((temp_celcius * 9 / 5) + 32);
        }
    }

    const t = `${temperature}°${format}`;
    const h = `${relative_humidity}% RH`;

    const temp_color = (t, f, theme) => [
        theme.palette.info.main,
        theme.palette.info.light,
        theme.palette.success.light,
        theme.palette.success.main,
        theme.palette.warning.light,
        theme.palette.error.light,
        theme.palette.error.main
    ][
        Math.min(6, Math.floor((Math.max(0, Math.min(100, f=='f'?t:(t*9/5+32))))/100*7))
    ]

    temp_style.backgroundColor = temp_color(temperature, format, theme);

    return <div className='flx align-center fs34'>

        <div className='txt-center' style={temp_style}>{t}</div>

        <div className='txt-left' style={info_style}>
            <h3>{title}</h3>
            <div className='txt-left'>{t} / {h}</div>
        </div>
    </div>
};

export default GenericClimateSensor;
