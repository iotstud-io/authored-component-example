import React from 'react';

const GenericClimateSensor = ({ 
    temp_c=null, 
    temp_f=null, 
    humidity='--',
    settings={},
}) => {

    const format = settings['temperature_format'] || 'f';

    let temperature = '--';

    if(format === 'c') {
        if(temp_c !== null) {
            temperature = temp_c;
        } 
        if(temp_c === null && temp_f !== null) {
            temperature = Math.round((temp_f - 32) * 5 / 9);
        }
    }

    if(format === 'f') {
        if(temp_f !== null) {
            temperature = temp_f;
        }
        if(temp_f === null && temp_c !== null) {
            temperature = Math.round((temp_c * 9 / 5) + 32);
        }
    }

    return <div style={{ padding: 20, border: '1px solid #ccc', borderRadius: 8, background: '#f9f9f9', width: 220 }}>
        <h3 style={{ margin: 0 }}>Climate Sensor</h3>
        <div style={{ fontSize: 32, fontWeight: 'bold', color: '#0077cc' }}>{temperature}°{format}</div>
        <div style={{ fontSize: 24, color: '#009966' }}>{humidity}% RH</div>
    </div>
};

export default GenericClimateSensor;
