import {
    Battery1BarIcon,
    Battery2BarIcon,
    Battery3BarIcon,
    Battery4BarIcon,
    Battery5BarIcon,
    Battery6BarIcon,
    BatteryAlertIcon,
    BatteryFullIcon,
} from './BatteryIcons'

const min = 0
const max = 100

const clamp = (value, minValue, maxValue) => Math.min(maxValue, Math.max(minValue, value))

const batteryIcon = value => {

    if(value === null || value <= 20) return BatteryAlertIcon
    if(value <= 30) return Battery1BarIcon
    if(value <= 40) return Battery2BarIcon
    if(value <= 50) return Battery3BarIcon
    if(value <= 65) return Battery4BarIcon
    if(value <= 80) return Battery5BarIcon
    if(value < 100) return Battery6BarIcon

    return BatteryFullIcon
}

const batteryState = (life_percent, theme) => {
    const numeric = Number(life_percent)

    if(!life_percent || !Number.isFinite(numeric)) {
        return {
            value: '--',
            detail: 'Unknown',
            color: theme.palette.text.secondary,
            Icon: batteryIcon(null),
        }
    }

    const value = clamp(Math.round(numeric), min, max)
    const Icon = batteryIcon(value)

    if(value > 50) {
        return {
            value: `${value}%`,
            detail: 'Good',
            color: theme.palette.success.main,
            Icon,
        }
    }

    if(value > 20) {
        return {
            value: `${value}%`,
            detail: 'Low',
            color: theme.palette.warning.main,
            Icon,
        }
    }

    return {
        value: `${value}%`,
        detail: 'Critical',
        color: theme.palette.error.main,
        Icon,
    }
}

const GenericBatteryLife = ({
    life_percent=null,
    theme,
    title='Battery Life',
}) => {

    const status = batteryState(life_percent, theme)
    const StatusIcon = status.Icon
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

    return <div className='generic-battery-life flx align-center justify-left' style={instanceContainerStyle}>

        <div className='generic-battery-life__status' style={instanceStatusStyle}>{status.value}</div>

        <div className='generic-battery-life__info txt-center'>

            <h4>{title}</h4>

            <div className='generic-battery-life__subtitle'>
                <span className='generic-battery-life__detail' style={infoStatusStyle}>
                    <StatusIcon className='generic-battery-life__icon' />
                    {status.detail}
                </span>
            </div>
        </div>
    </div>
}

export default GenericBatteryLife
