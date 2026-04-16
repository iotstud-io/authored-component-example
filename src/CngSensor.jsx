const cngState = (cng, theme) => {

    const value = Number(cng)

    if(!Number.isFinite(value)) {
        return {
            badge: '--',
            detail: 'Unknown',
            color: theme.palette.text.secondary,
            hasValue: false,
        }
    }

    const safeValue = Math.max(0, Math.min(65535, value))

    return {
        badge: safeValue,
        detail: safeValue,
        color: cngColor(safeValue, theme),
        hasValue: true,
    }
}

const cngColor = (ppm, theme) => {

    const value = Number.isFinite(Number(ppm)) ? Math.max(0, Number(ppm)) : 0

    if(value < 500) return theme.palette.success.main
    if(value <= 5000) return theme.palette.warning.light
    if(value <= 10000) return theme.palette.warning.main
    if(value <= 20000) return theme.palette.warning.dark
    if(value <= 30000) return theme.palette.error.light
    if(value <= 40000) return theme.palette.error.main

    return theme.palette.error.dark
}

const CngSensor = ({ cng=null, title='CNG Sensor', theme }) => {

    const status = cngState(cng, theme)
    const instanceContainerStyle = { 
        boxShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        background:
            `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box,
            linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.shadow}) border-box`,
    }
    const instancePpmStyle = { 
        textShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        outline: `3px solid ${status.color}`,
        backgroundColor: theme.palette.background.paper,
    }

    return <div className='cng-sensor flx align-center justify-left' style={instanceContainerStyle}>

        <div className='cng-sensor__badge' style={instancePpmStyle}>

            {status.badge}

            {status.hasValue && <div className='cng-sensor__badge-unit' style={{ color: theme.palette.text.secondary }}>
                ppm
            </div>}
        </div>

        <div className='cng-sensor__content'>

            <h4>{title}</h4>

            <div className='cng-sensor__detail' style={{ color: status.color }}>

                {status.detail}

                {status.hasValue && <span className='cng-sensor__detail-unit' style={{ color: theme.palette.text.secondary }}>
                    ppm
                </span>}
            </div>
        </div>
    </div>
}

export default CngSensor
