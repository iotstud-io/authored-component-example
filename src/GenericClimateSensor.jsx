import React from 'react';

const GenericClimateSensor = ({ 
    temp_celcius=null, 
    temp_fahrenheit=null, 
    humidity=null,
    settings={},
}) => {

    const format = settings?.temperature_format || 'f';

    let temperature = '--';
    let relative_humidity = '--';

    if(humidity) {
        relative_humidity = humidity;
    }

    if(format === 'c') {
        if(temp_celcius) {
            temperature = temp_celcius;
        } 
        if(temp_celcius === null && temp_fahrenheit) {
            temperature = Math.round((temp_fahrenheit - 32) * 5 / 9);
        }
    }

    if(format === 'f') {
        if(temp_fahrenheit) {
            temperature = temp_fahrenheit;
        }
        if(temp_fahrenheit === null && temp_celcius) {
            temperature = Math.round((temp_celcius * 9 / 5) + 32);
        }
    }

    return <div style={{ padding: 20, border: '1px solid #ccc', borderRadius: 8, background: '#f9f9f9', width: 220 }}>
        <h3 style={{ margin: 0 }}>Climate Sensor</h3>
        <div style={{ fontSize: 32, fontWeight: 'bold', color: '#0077cc' }}>{temperature}°{format}</div>
        <div style={{ fontSize: 24, color: '#009966' }}>{relative_humidity}% RH</div>
    </div>
};

export default GenericClimateSensor;
