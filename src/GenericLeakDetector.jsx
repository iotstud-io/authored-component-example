import React from 'react'

let container_style = {
    border: '1px solid transparent',
    borderRadius: '10px',
    width: '100%',
    height: '100%',
    minWidth: '235px',
}

let status_style = {
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

const leakState = (water_detected, theme) => {

    if(water_detected === true) {
        return {
            badge: 'Leak',
            detail: 'Leak Detected',
            color: theme.palette.error.main,
        }
    }

    if(water_detected === false) {
        return {
            badge: 'OK',
            detail: 'No Leak',
            color: theme.palette.success.main,
        }
    }

    return {
        badge: '--',
        detail: 'Unknown',
        color: theme.palette.text.secondary,
    }
}

const GenericLeakDetector = ({
    title='Leak Detector',
    theme,
    water_detected=null,
}) => {

    const status = leakState(water_detected, theme)
    const infoStatusStyle = { color: status.color, fontWeight: 'bold' }
    const instanceContainerStyle = {
        ...container_style,
        boxShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        background:
            `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box,
            linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.shadow}) border-box`,
    }
    const instanceStatusStyle = {
        ...status_style,
        textShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        outline: `3px solid ${status.color}`,
        backgroundColor: theme.palette.background.paper,
    }

    return <div className='flx align-center justify-center' style={instanceContainerStyle}>

        <div style={instanceStatusStyle}>{status.badge}</div>

        <div className='txt-center' style={info_style}>

            <h4>{title}</h4>

            <div style={{ paddingTop: '5px' }}>
                <span style={infoStatusStyle}>{status.detail}</span>
            </div>
        </div>
    </div>
}

export default GenericLeakDetector
