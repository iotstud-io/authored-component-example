import { useEffect, useRef, useState } from 'react'
import { hasOperation, operationReadValue } from './Functions'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const min = 0
const max = 100

const toPercentValue = value => {
    const numeric = Number(value)

    if(!Number.isFinite(numeric)) {
        return 0
    }

    return clamp(Math.round(numeric), min, max)
}

const hasPercentValue = value => Number.isFinite(Number(value))

const GenericLightDimmer = ({
    theme,
    title='Lights',
    operations={},
    triggerCapability,
}) => {

    const trackRef = useRef(null)
    const [dragging, setDragging] = useState(false)
    const [dragValue, setDragValue] = useState(0)

    const rangeMin = min
    const rangeMax = max
    const brightnessReadValue = operationReadValue(operations, 'brightness_percent')
    const lightStateReadValue = operationReadValue(operations, 'light_state')
    const hasBrightness = hasPercentValue(brightnessReadValue)
    const brightnessValue = hasBrightness ? toPercentValue(brightnessReadValue) : 0
    const stateValue = lightStateReadValue ?? ''
    const hasLightState = stateValue.length > 0
    const isOn = hasLightState ? stateValue === 'on' : hasBrightness && brightnessValue > 0
    const hostValue = hasBrightness
        ? (hasLightState && !isOn ? 0 : brightnessValue)
        : (isOn ? rangeMax : rangeMin)
    const value = dragging ? dragValue : hostValue
    const canSetBrightness = hasOperation(operations, 'brightness_percent', 'set')
    const canSetLightState = hasOperation(operations, 'light_state', 'set')
    const canToggleLightState = hasOperation(operations, 'light_state', 'toggle')
    const canAdjustBrightness = hasBrightness && canSetBrightness
    const hasKnownPowerState = hasLightState || hasBrightness
    const canTogglePowerState = canToggleLightState && hasKnownPowerState
    const canChoosePowerState = canSetLightState || canTogglePowerState

    useEffect(() => {
        if(!dragging) {
            setDragValue(hostValue)
        }
    }, [dragging, hostValue])

    const callTrigger = async (capabilityKey, operationKey, nextValue) => {
        if(typeof triggerCapability !== 'function') {
            return
        }

        await triggerCapability(capabilityKey, operationKey, nextValue)
    }

    const setPower = async nextState => {
        if(nextState === 'off') {
            if(canSetLightState) {
                await callTrigger('light_state', 'set', 'off')
            } else if(canToggleLightState && isOn) {
                await callTrigger('light_state', 'toggle')
            } else if(canSetBrightness) {
                await callTrigger('brightness_percent', 'set', rangeMin)
            }
            return
        }

        if(canSetLightState) {
            await callTrigger('light_state', 'set', 'on')
        } else if(canToggleLightState && !isOn) {
            await callTrigger('light_state', 'toggle')
        } else if(canSetBrightness && hostValue <= rangeMin) {
            await callTrigger('brightness_percent', 'set', 1)
        }
    }

    const commitBrightness = async next => {
        const normalized = clamp(Math.round(next), rangeMin, rangeMax)

        if(normalized <= 0) {
            await setPower('off')
            return
        }

        if(hostValue <= 0) {
            await setPower('on')
        }

        if(canSetBrightness) {
            await callTrigger('brightness_percent', 'set', normalized)
        }
    }

    const getValueFromPointer = clientX => {

        if(!trackRef.current) return value

        const rect = trackRef.current.getBoundingClientRect()

        if(rect.width === 0) return value

        const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
        const raw = rangeMin + ratio * (rangeMax - rangeMin)

        return clamp(Math.round(raw), rangeMin, rangeMax)
    }

    const handlePointerDown = event => {

        if(!trackRef.current || !canAdjustBrightness) return

        const nextValue = getValueFromPointer(event.clientX)

        setDragValue(nextValue)
        setDragging(true)
        event.currentTarget.setPointerCapture(event.pointerId)
    }

    const handlePointerMove = event => {

        if(!dragging || !canAdjustBrightness) return

        setDragValue(getValueFromPointer(event.clientX))
    }

    const handlePointerUp = async event => {

        if(!dragging) return
        
        const nextValue = getValueFromPointer(event.clientX)

        setDragging(false)
        setDragValue(nextValue)
        event.currentTarget.releasePointerCapture?.(event.pointerId)

        await commitBrightness(nextValue)
    }

    const handleKeyDown = async event => {
        if(!canAdjustBrightness) return

        if(event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            event.preventDefault()
            await commitBrightness(clamp(hostValue - 1, rangeMin, rangeMax))
        }

        if(event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            event.preventDefault()
            await commitBrightness(clamp(hostValue + 1, rangeMin, rangeMax))
        }

        if(event.key === 'Home') {
            event.preventDefault()
            await commitBrightness(rangeMin)
        }
        
        if(event.key === 'End') {
            event.preventDefault()
            await commitBrightness(rangeMax)
        }
    }

    const percent = rangeMax === rangeMin
        ? 0
        : ((value - rangeMin) / (rangeMax - rangeMin)) * 100

    const ticks = []
    const tickStart = Math.ceil(rangeMin / 5) * 5
    const tickEnd = Math.floor(rangeMax / 5) * 5

    for(let tick = tickStart; tick <= tickEnd; tick += 5) {
        ticks.push(tick)
    }

    const midValue = Math.round((rangeMin + rangeMax) / 2)

    const handleToggle = async next => {
        if(next === 'toggle') {
            if(canTogglePowerState) {
                await callTrigger('light_state', 'toggle')
            } else if(canChoosePowerState) {
                await setPower(isOn ? 'off' : 'on')
            }
            return
        }

        if(!canChoosePowerState) {
            return
        }

        await setPower(next)
    }

    const rootStyle = {
        boxShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        background:
            `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box,
            linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.shadow}) border-box`,
    }

    const trackStyle = {
        cursor: canAdjustBrightness ? 'pointer' : 'default',
        opacity: canAdjustBrightness ? 1 : 0.6,
    }

    const handleStyle = {
        cursor: canAdjustBrightness ? (dragging ? 'grabbing' : 'grab') : 'default',
    }

    const modeLabelStyle = (selected, accent) => ({
        cursor: canChoosePowerState ? 'pointer' : 'default',
        fontSize: selected ? '20px' : '18px',
        fontWeight: selected ? 'bold' : 'normal',
        color: selected ? accent : theme.palette.text.secondary,
    })

    return <div className='generic-light-dimmer' style={rootStyle}>

        <div className='generic-light-dimmer__title txt-center'>
            {title}
        </div>

        <div className='flx align-center'>

            <div
                className='generic-light-dimmer__mode txt-left'
                role='button'
                aria-disabled={!canChoosePowerState}
                tabIndex={canChoosePowerState ? 0 : -1}
                onClick={() => void handleToggle('off')}
                onKeyDown={async event => {
                    if(event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        await handleToggle('off')
                    }
                }}
                style={modeLabelStyle(!isOn, '#6b7280')}>
                OFF
            </div>

            <div
                className='generic-light-dimmer__value txt-center'
                role={canTogglePowerState ? 'button' : undefined}
                aria-label={canTogglePowerState ? 'Toggle light' : undefined}
                tabIndex={canTogglePowerState ? 0 : undefined}
                style={{ cursor: canTogglePowerState ? 'pointer' : 'default' }}
                onClick={canTogglePowerState ? () => void handleToggle('toggle') : undefined}
                onKeyDown={canTogglePowerState ? async event => {
                    if(event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        await handleToggle('toggle')
                    }
                } : undefined}>
                {value}%
            </div>

            <div
                className='generic-light-dimmer__mode txt-right'
                role='button'
                aria-disabled={!canChoosePowerState}
                tabIndex={canChoosePowerState ? 0 : -1}
                onClick={() => void handleToggle('on')}
                onKeyDown={async event => {
                    if(event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        await handleToggle('on')
                    }
                }}
                style={modeLabelStyle(isOn, '#16a34a')}>
                ON
            </div>

        </div>

        <div className='generic-light-dimmer__track-wrap'>

            <div
                ref={trackRef}
                className='generic-light-dimmer__track'
                style={trackStyle}
                role='slider'
                aria-disabled={!canAdjustBrightness}
                aria-valuemin={rangeMin}
                aria-valuemax={rangeMax}
                aria-valuenow={value}
                aria-valuetext={`${value}%`}
                tabIndex={canAdjustBrightness ? 0 : -1}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={event => void handlePointerUp(event)}
                onPointerCancel={event => void handlePointerUp(event)}
                onKeyDown={event => void handleKeyDown(event)}>

                <div className='generic-light-dimmer__fill' style={{ width: `${percent}%` }}></div>
                <div className='generic-light-dimmer__handle' style={{ ...handleStyle, left: `${percent}%` }}></div>

                <div className='generic-light-dimmer__ticks'>

                    {ticks.map(tick => {

                        const ratio = rangeMax === rangeMin
                            ? 0
                            : (tick - rangeMin) / (rangeMax - rangeMin)
                        const isLabel = tick === rangeMin || tick === midValue || tick === rangeMax
                        const isCurrent = tick === value

                        return <div
                            key={tick}
                            className='generic-light-dimmer__tick'
                            style={{ left: `${ratio * 100}%` }}
                            data-value={tick}>

                            {isLabel ? (
                                <div
                                    className='generic-light-dimmer__tick-label'
                                    style={{
                                        fontWeight: isCurrent ? 'bold' : 'normal',
                                        color: isCurrent ? 'inherit' : '#6b7280',
                                    }}>
                                    {tick}
                                </div>
                            ) : null}

                        </div>
                    })}

                </div>
            </div>
        </div>
    </div>
}

export default GenericLightDimmer
