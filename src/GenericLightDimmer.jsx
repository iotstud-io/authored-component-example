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

    const root_style = { 
        width: '100%',
        minWidth: '300px',
        height: '100%', 
        border: '1px solid transparent',
        borderRadius: '10px',
        margin: 0,
        padding: '5px 20px 25px 20px',
        boxShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        background:
            `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box,
            linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.shadow}) border-box`,
    }

    const containerStyle = {
        width: '100%',
        margin: '5px 5px 15px 0',
        padding: '0',
    }

    const trackStyle = {
        position: 'relative',
        height: '40px',
        borderRadius: '10px',
        borderShape: 'squircle',
        background: 'linear-gradient(90deg, #646464ff 0%, #d7d7d7 100%)',
        cursor: canSetBrightness ? 'pointer' : 'default',
        touchAction: 'none',
        userSelect: 'none',
        outline: 'none',
        opacity: canSetBrightness ? 1 : 0.6,
    }

    const fillStyle = {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        borderRadius: '10px',
        borderShape: 'squircle',
        pointerEvents: 'none',
    }

    const handleStyle = {
        position: 'absolute',
        top: '50%',
        width: '20px',
        height: '50px',
        borderRadius: '4px',
        backgroundColor: '#ffffff',
        border: '2px solid #111827',
        transform: 'translate(-50%, -50%)',
        cursor: canSetBrightness ? (dragging ? 'grabbing' : 'grab') : 'default',
        boxSizing: 'border-box',
    }

    const tickContainerStyle = {
        position: 'absolute',
        left: 0,
        right: 0,
        top: '100%',
        marginTop: '6px',
        height: '6px',
        pointerEvents: 'none',
    }

    const tickStyle = {
        position: 'absolute',
        width: '1px',
        height: '6px',
        backgroundColor: '#9ca3af',
        transform: 'translateX(-50%)',
    }

    const tickLabelStyle = {
        position: 'absolute',
        top: '8px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '10px',
        color: '#6b7280',
        whiteSpace: 'nowrap',
    }

    const modeLabelStyle = (selected, accent) => ({
        fontSize: selected ? '20px' : '18px',
        fontWeight: selected ? 'bold' : 'normal',
        color: selected ? accent : theme.palette.text.secondary,
        cursor: 'pointer',
    })

    return <div style={root_style}>

        <div className='txt-center' style={{fontWeight: 'bold', fontSize: '24px'}}>
            {title}
        </div>

        <div className='flx align-center'>

            <div
                className='txt-left'
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

            <div className='txt-center' style={{
                margin: '0 auto', 
                fontWeight: 'bold', 
                fontSize: '20px'
            }}>
                {value}%
            </div>

            <div
                className='txt-right'
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

        <div style={containerStyle}>

            <div
                ref={trackRef}
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

                <div style={{ ...fillStyle, width: `${percent}%` }}></div>
                <div style={{ ...handleStyle, left: `${percent}%` }}></div>

                <div style={tickContainerStyle}>

                    {ticks.map(tick => {

                        const ratio = rangeMax === rangeMin
                            ? 0
                            : (tick - rangeMin) / (rangeMax - rangeMin)
                        const isLabel = tick === rangeMin || tick === midValue || tick === rangeMax
                        const isCurrent = tick === value

                        return <div
                            key={tick}
                            style={{ ...tickStyle, left: `${ratio * 100}%` }}
                            data-value={tick}>

                            {isLabel ? (
                                <div
                                    style={{
                                        ...tickLabelStyle,
                                        fontWeight: isCurrent ? 'bold' : 'normal',
                                        color: isCurrent ? 'inherit' : tickLabelStyle.color,
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
