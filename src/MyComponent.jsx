import React from 'react';

/**
 * Example IoT Dashboard Tile Component
 * Props: temperature (number), humidity (number)
 */
const MyComponent = ({ temperature, humidity }) => (
  <div style={{ padding: 20, border: '1px solid #ccc', borderRadius: 8, background: '#f9f9f9', width: 220 }}>
    <h3 style={{ margin: 0 }}>DHT22 Sensor</h3>
    <div style={{ fontSize: 32, fontWeight: 'bold', color: '#0077cc' }}>{temperature}°C</div>
    <div style={{ fontSize: 24, color: '#009966' }}>{humidity}% RH</div>
    <div style={{ marginTop: 10, fontSize: 12, color: '#888' }}>Powered by IoT Studio</div>
  </div>
);

export default MyComponent;
