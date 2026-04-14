let container_style = {
    border: '1px solid transparent',
    borderRadius: '10px',
    width: '100%',
    height: '100%', 
}

let ppm_style = {
    flexShrink: 0,
    borderRadius: '50%',
    width: '65px',
    height: '65px',
    textAlign: 'center',
    margin: '12px 14px',
    fontSize: '18px',
    fontWeight: 'bold',
    padding: '12px 0',
}

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
        ...container_style,
        boxShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        background:
            `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box,
            linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.shadow}) border-box`,
    }
    const instancePpmStyle = { 
        ...ppm_style, 
        textShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        outline: `3px solid ${status.color}`,
        backgroundColor: theme.palette.background.paper,
    }

    return <div className='flx align-center justify-center' style={instanceContainerStyle}>

        <div style={instancePpmStyle}>

            {status.badge}

            {status.hasValue && <div style={{fontSize: 12, color: theme.palette.text.secondary, lineHeight: '0px'}}>
                ppm
            </div>}
        </div>

        <div style={{paddingRight: '12px'}}>

            <h4>{title}</h4>

            <div style={{ fontWeight: 'bold', color: status.color}}>

                {status.detail}

                {status.hasValue && <span style={{fontSize: 13, color: theme.palette.text.secondary}}>
                    ppm
                </span>}
            </div>
        </div>
    </div>
}

export default CngSensor
