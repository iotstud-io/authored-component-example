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
    const infoStatusStyle = { color: status.color }
    const instanceContainerStyle = {
        boxShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        background:
            `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box,
            linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.shadow}) border-box`,
    }
    const instanceStatusStyle = {
        textShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        outline: `3px solid ${status.color}`,
        backgroundColor: theme.palette.background.paper,
    }

    return <div className='generic-leak-detector flx align-center justify-left' style={instanceContainerStyle}>

        <div className='generic-leak-detector__status' style={instanceStatusStyle}>{status.badge}</div>

        <div className='generic-leak-detector__info txt-center'>

            <h4>{title}</h4>

            <div className='generic-leak-detector__subtitle'>
                <span className='generic-leak-detector__detail' style={infoStatusStyle}>{status.detail}</span>
            </div>
        </div>
    </div>
}

export default GenericLeakDetector
