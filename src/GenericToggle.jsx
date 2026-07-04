import { hasOperation, operationReadValue } from './Functions'

const BoltOnIcon = ({fill}) => (
    <svg className='generic-toggle__status-icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960' fill={fill} aria-hidden='true'>
        <path d='m480-336 128-184H494l80-280H360v320h120v144ZM400-80v-320H280v-480h400l-80 280h160L400-80Zm80-400H360h120Z' />
    </svg>
)

const BoltOffIcon = ({fill}) => (
    <svg className='generic-toggle__status-icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960' fill={fill} aria-hidden='true'>
        <path d='M280-880h400l-80 280h160L643-431l-57-57 22-32h-54l-47-47 67-233H360v86l-80-80v-86ZM400-80v-320H280v-166L55-791l57-57 736 736-57 57-241-241L400-80Zm73-521Z' />
    </svg>
)

const BulbOnIcon = ({fill}) => (
    <svg className='generic-toggle__status-icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960' fill={fill} aria-hidden='true'>
        <path d='M423.5-103.5Q400-127 400-160h160q0 33-23.5 56.5T480-80q-33 0-56.5-23.5ZM320-200v-80h320v80H320Zm10-120q-69-41-109.5-110T180-580q0-125 87.5-212.5T480-880q125 0 212.5 87.5T780-580q0 81-40.5 150T630-320H330Zm24-80h252q45-32 69.5-79T700-580q0-92-64-156t-156-64q-92 0-156 64t-64 156q0 54 24.5 101t69.5 79Zm126 0Z' />
    </svg>
)

const BulbOffIcon = ({fill}) => (
    <svg className='generic-toggle__status-icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960' fill={fill} aria-hidden='true'>
        <path d='M423.5-103.5Q400-127 400-160h160q0 33-23.5 56.5T480-80q-33 0-56.5-23.5ZM480-800q-44 0-81.5 15.5T332-742l-58-56q41-38 93.5-60T480-880q125 0 212.5 87.5T780-580q0 71-25 121.5T698-376l-56-56q21-23 39.5-59t18.5-89q0-92-64-156t-156-64Zm368 688-57 57-265-265H330q-69-41-109.5-110T180-580q0-20 2.5-39t7.5-37L56-792l56-56 736 736ZM354-400h92L260-586v6q0 54 24.5 101t69.5 79Zm-6-98Zm134-94Zm164 312v80H320v-80h326Z' />
    </svg>
)

const displayIcons = {
    bolt: {
        off: BoltOffIcon,
        on: BoltOnIcon,
    },
    bulb: {
        off: BulbOffIcon,
        on: BulbOnIcon,
    },
}

const GenericToggle = ({
    title='Power Switch',
    theme,
    light_state=null,
    operations={},
    settings={},
    triggerCapability,
}) => {

    const lightStateReadValue = operationReadValue(operations, 'light_state')
    const stateValue = lightStateReadValue ?? light_state ?? ''
    const isOn = stateValue === 'on'
    const canSetLightState = hasOperation(operations, 'light_state', 'set')
    const statusLabel = isOn ? 'On' : 'Off'
    const activeColor = theme.palette.warning.light
    const disabledColor = theme.palette.action.disabled
    const displayIcon = settings?.display_icon
    const StatusIcon = displayIcons[displayIcon]?.[stateValue]
    const statusColor = isOn ? activeColor : disabledColor

    const callTrigger = async nextState => {
        if(!canSetLightState || typeof triggerCapability !== 'function') {
            return
        }

        await triggerCapability('light_state', 'set', nextState)
    }

    const handleKeyDown = async (event, nextState) => {
        if(event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            await callTrigger(nextState)
        }
    }

    const instanceContainerStyle = {
        boxShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        background:
            `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box,
            linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.shadow}) border-box`,
    }

    const instanceStatusStyle = {
        textShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        outline: `3px solid ${isOn ? activeColor : disabledColor}`,
        backgroundColor: theme.palette.background.paper,
        color: isOn ? activeColor : disabledColor,
    }

    const modeStyle = nextState => {
        const selected = nextState === stateValue
        const onSelected = nextState === 'on' && isOn

        return {
            color: onSelected ? activeColor : disabledColor,
            cursor: canSetLightState ? 'pointer' : 'default',
            fontWeight: selected ? 'bold' : 'normal',
        }
    }

    return <div className='generic-toggle flx align-center justify-left' style={instanceContainerStyle}>

        <div className='generic-toggle__status' style={instanceStatusStyle}>
            {StatusIcon
                ? <span role='img' aria-label={statusLabel}>
                    <StatusIcon fill={statusColor} />
                </span>
                : statusLabel}
        </div>

        <div className='generic-toggle__info txt-center'>

            <h4>{title}</h4>

            <div className='generic-toggle__subtitle'>
                <span
                    className='generic-toggle__mode'
                    role='button'
                    aria-disabled={!canSetLightState}
                    tabIndex={canSetLightState ? 0 : -1}
                    style={modeStyle('off')}
                    onClick={() => void callTrigger('off')}
                    onKeyDown={event => void handleKeyDown(event, 'off')}>
                    Off
                </span>

                <span className='generic-toggle__separator' style={{ color: disabledColor }}>|</span>

                <span
                    className='generic-toggle__mode'
                    role='button'
                    aria-disabled={!canSetLightState}
                    tabIndex={canSetLightState ? 0 : -1}
                    style={modeStyle('on')}
                    onClick={() => void callTrigger('on')}
                    onKeyDown={event => void handleKeyDown(event, 'on')}>
                    On
                </span>
            </div>
        </div>
    </div>
}

export default GenericToggle
