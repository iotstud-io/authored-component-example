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
    fontSize: '20px',
    fontWeight: 'bold',
    padding: '12px 0',
}

const cngColor = (ppm, theme) => {

    const value = Number.isFinite(Number(ppm)) ? Math.max(0, Math.min(65535, Number(ppm))) : 0
    const palette = [
        theme.palette.success.main,
        theme.palette.warning.light,
        theme.palette.warning.main,
        theme.palette.warning.dark,
        theme.palette.error.light,
        theme.palette.error.main,
        theme.palette.error.dark,
    ]
    const idx = Math.min(6, Math.floor((value / 65535) * 6))

    return palette[idx]
}

const CngSensor = ({ cng=0, title='CNG Sensor', theme }) => {

    const color = cngColor(cng, theme)
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
        outline: `3px solid ${color}`,
        backgroundColor: theme.palette.background.paper,
    }

    return <div className='flx align-center justify-center' style={instanceContainerStyle}>

        <div style={instancePpmStyle}>

            {cng}
            
            <div style={{fontSize: 12, color: theme.palette.text.secondary, lineHeight: '0px'}}>
                ppm
            </div>
        </div>

        <div style={{paddingRight: '12px'}}>

            <h4>{title}</h4>

            <div style={{ fontWeight: 'bold', color}}>

                {cng}

                <span style={{fontSize: 13, color: theme.palette.text.secondary}}>
                    ppm
                </span>
            </div>
        </div>
    </div>
}

export default CngSensor