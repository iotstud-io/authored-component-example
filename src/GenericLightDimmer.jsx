import { useEffect, useRef, useState } from 'react'

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

const GenericLightDimmer = ({
    brightness_percent,
    light_state,
    set_brightness=false,
    set_light_state=false,
    theme,
    title='Lights',
    triggerCapability,
}) => {

    const trackRef = useRef(null)
    const [dragging, setDragging] = useState(false)
    const [dragValue, setDragValue] = useState(0)

    const rangeMin = min
    const rangeMax = max
    const brightnessValue = toPercentValue(brightness_percent)
    const stateValue = typeof light_state === 'string' ? light_state.toLowerCase() : ''
    const hasLightState = stateValue.length > 0
    const isOn = hasLightState ? stateValue === 'on' : brightnessValue > 0
    const hostValue = hasLightState && !isOn ? 0 : brightnessValue
    const value = dragging ? dragValue : hostValue
    const canSetBrightness = set_brightness === true
    const canSetLightState = set_light_state === true

    useEffect(() => {
        if(!dragging) {
            setDragValue(hostValue)
        }
    }, [dragging, hostValue])

    const callTrigger = async (name, nextValue) => {
        if(typeof triggerCapability !== 'function') {
            return
        }

        await triggerCapability(name, nextValue)
    }

    const commitBrightness = async next => {
        const normalized = clamp(Math.round(next), rangeMin, rangeMax)

        if(normalized <= 0) {
            if(canSetLightState) {
                await callTrigger('set_light_state', 'off')
            }
            return
        }

        if(canSetLightState && hostValue <= 0) {
            await callTrigger('set_light_state', 'on')
        }

        if(canSetBrightness) {
            await callTrigger('set_brightness', normalized)
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

        if(!trackRef.current || !canSetBrightness) return

        const nextValue = getValueFromPointer(event.clientX)

        setDragValue(nextValue)
        setDragging(true)
        event.currentTarget.setPointerCapture(event.pointerId)
    }

    const handlePointerMove = event => {

        if(!dragging || !canSetBrightness) return

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
        if(!canSetBrightness) return

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

        if(next === 'off') {
            if(canSetLightState) {
                await callTrigger('set_light_state', 'off')
            } else if(canSetBrightness) {
                await commitBrightness(0)
            }
            return
        }

        if(canSetLightState) {
            await callTrigger('set_light_state', 'on')
        }

        if(canSetBrightness && hostValue <= 0) {
            await callTrigger('set_brightness', 1)
        }
    }

    const rootStyle = {
        boxShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        background:
            `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box,
            linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.shadow}) border-box`,
    }

    const trackStyle = {
        cursor: canSetBrightness ? 'pointer' : 'default',
        opacity: canSetBrightness ? 1 : 0.6,
    }

    const handleStyle = {
        cursor: canSetBrightness ? (dragging ? 'grabbing' : 'grab') : 'default',
    }

    const modeLabelStyle = (selected, accent) => ({
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
                tabIndex={0}
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

            <div className='generic-light-dimmer__value txt-center'>
                {value}%
            </div>

            <div
                className='generic-light-dimmer__mode txt-right'
                role='button'
                tabIndex={0}
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
                aria-valuemin={rangeMin}
                aria-valuemax={rangeMax}
                aria-valuenow={value}
                aria-valuetext={`${value}%`}
                tabIndex={canSetBrightness ? 0 : -1}
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
