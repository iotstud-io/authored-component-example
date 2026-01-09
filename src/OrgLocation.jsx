
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

    const between_padding = size === 'small' ? 0 : size === 'medium' ? '8px' : size === 'large' ? '15px' : 0

    const style = { 
        width: 'fit-content',
        border: '1px solid transparent',
        borderRadius: '10px',
        height: 'auto', 
        padding: '10px 10px 5px 10px',
        boxShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        background:
            `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box,
            linear-gradient(135deg, ${theme.palette.background.paper}, #000000) border-box`,
    }

    return <div style={style}>

        <h1 style={{
            fontSize: '30.5px', lineHeight: '30px'
        }}>860 Washington Street</h1>

        <div style={{
            paddingTop: between_padding, 
            lineHeight: '29px', 
            fontSize: '22px', 
            color: theme.palette.text.secondary
        }}>WellCube Science Lab</div>

        <div style={{
            paddingTop: between_padding, 
            lineHeight: '18px', 
            fontSize: '18px', 
            color: theme.palette.text.secondary
        }}>4th Floor</div>

        {show_room_level && 
        <div style={{
            paddingTop: between_padding, 
            lineHeight: '18px', 
            fontSize: '18px', 
            color: theme.palette.text.secondary
        }}>Conference Room A</div>}
    </div>
}

export default OrgLocation