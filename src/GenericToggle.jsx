import { hasOperation, normalizedLightState, operationReadValue } from './Functions'

const GenericToggle = ({
    title='Power Switch',
    theme,
    light_state=null,
    operations={},
    triggerCapability,
}) => {

    const lightStateReadValue = operationReadValue(operations, 'light_state')
    const stateValue = normalizedLightState(lightStateReadValue ?? light_state)
    const isOn = stateValue === 'on'
    const canSetLightState = hasOperation(operations, 'light_state', 'set')
    const statusLabel = isOn ? 'On' : 'Off'
    const activeColor = theme.palette.warning.light
    const disabledColor = theme.palette.action.disabled

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

        <div className='generic-toggle__status' style={instanceStatusStyle}>{statusLabel}</div>

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
