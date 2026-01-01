
const OrgLocation = ({theme}) => {

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
        <h1 style={{fontSize: '30.5px', lineHeight: '30px'}}>860 Washington Street</h1>
        <div style={{lineHeight: '29px', fontSize: '22px', color: theme.palette.text.secondary}}>WellCube Science Lab</div>
        <div style={{lineHeight: '18px', fontSize: '18px', color: theme.palette.text.secondary}}>4th Floor</div>
    </div>
}

export default OrgLocation