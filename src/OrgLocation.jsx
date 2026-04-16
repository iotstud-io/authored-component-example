
const OrgLocation = ({settings, theme}) => {

    let show_room_level = false
    let size = 'small'

    if(settings?.size === 'medium') {
        size = 'medium'
    }

    if(settings?.size === 'large') {
        size = 'large'
    }

    if(settings?.show_room_level === true) {
        show_room_level = true
    }

    const style = {
        boxShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        background:
            `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box,
            linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.shadow}) border-box`,
    }

    return <div className={`org-location org-location--${size}`} style={style}>

        <h1 className='org-location__street'>860 Washington Street</h1>

        <div className='org-location__line org-location__line--lab' style={{ color: theme.palette.text.secondary }}>WellCube Science Lab</div>

        <div className='org-location__line' style={{ color: theme.palette.text.secondary }}>4th Floor</div>

        {show_room_level && 
        <div className='org-location__line' style={{ color: theme.palette.text.secondary }}>Conference Room A</div>}
    </div>
}

export default OrgLocation