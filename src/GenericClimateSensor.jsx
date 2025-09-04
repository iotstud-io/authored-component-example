import React from 'react';

const GenericClimateSensor = ({ 
    temp_c=null, 
    temp_f=null, 
    humidity='--' 
}) => {

    let temperature = '--';

    if(temp_c !== null) {
        temperature = temp_c;
    }

    if(temp_f !== null) {
        temperature = temp_f;
    }

    return <div style={{ padding: 20, border: '1px solid #ccc', borderRadius: 8, background: '#f9f9f9', width: 220 }}>
        <h3 style={{ margin: 0 }}>Climate Sensor</h3>
        <div style={{ fontSize: 32, fontWeight: 'bold', color: '#0077cc' }}>{temperature}°C</div>
        <div style={{ fontSize: 24, color: '#009966' }}>{humidity}% RH</div>
        <div style={{ marginTop: 10, fontSize: 12, color: '#888' }}>Powered by IoT Studio</div>
    </div>
};

export default GenericClimateSensor;
