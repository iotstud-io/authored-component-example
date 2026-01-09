import { useEffect, useRef, useState } from 'react'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const min = 50
const max = 80

const GenericThermostatSlider = ({
    value: controlledValue,
    defaultValue,
    theme,
    title='Thermostat',
}) => {

    const trackRef = useRef(null)
    const [dragging, setDragging] = useState(false)
    const [mode, setMode] = useState('cool')
    const toggleMode = next => {
        setMode(prev => (prev === next ? null : next))
    }

    const safeMin = Number.isFinite(min) ? min : 0
    const safeMaxRaw = Number.isFinite(max) ? max : safeMin + 1
    const safeMax = safeMaxRaw === safeMin ? safeMin + 1 : safeMaxRaw
    const rangeMin = Math.min(safeMin, safeMax)
    const rangeMax = Math.max(safeMin, safeMax)

    const isControlled = Number.isFinite(controlledValue)
    const [internalValue, setInternalValue] = useState(() => {

        const startValue = Number.isFinite(defaultValue) ? defaultValue : rangeMin

        return clamp(Math.round(startValue), rangeMin, rangeMax)
    })

    const value = clamp(
        isControlled ? controlledValue : internalValue,
        rangeMin,
        rangeMax
    )

    useEffect(() => {

        if(isControlled) return

        setInternalValue(prev => clamp(prev, rangeMin, rangeMax))

    }, [isControlled, rangeMin, rangeMax])

    const commitValue = next => {

        if(next === value) return

        if(!isControlled) setInternalValue(next)
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

        if(!trackRef.current) return

        commitValue(getValueFromPointer(event.clientX))
        setDragging(true)
        event.currentTarget.setPointerCapture(event.pointerId)
    }

    const handlePointerMove = event => {

        if(!dragging) return

        commitValue(getValueFromPointer(event.clientX))
    }

    const handlePointerUp = event => {

        if(!dragging) return
        
        setDragging(false)
        event.currentTarget.releasePointerCapture?.(event.pointerId)
    }

    const handleKeyDown = event => {

        if(event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            event.preventDefault()
            commitValue(clamp(value - 1, rangeMin, rangeMax))
        }

        if(event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            event.preventDefault()
            commitValue(clamp(value + 1, rangeMin, rangeMax))
        }

        if(event.key === 'Home') {
            event.preventDefault()
            commitValue(rangeMin)
        }
        
        if(event.key === 'End') {
            event.preventDefault()
            commitValue(rangeMax)
        }
    }

    const percent = rangeMax === rangeMin
        ? 0
        : ((value - rangeMin) / (rangeMax - rangeMin)) * 100

    const ticks = []
    const tickStart = Math.ceil(rangeMin)
    const tickEnd = Math.floor(rangeMax)

    for(let tick = tickStart; tick <= tickEnd; tick += 1) {
        ticks.push(tick)
    }

    const root_style = { 
        maxWidth: '325px',
        border: '1px solid transparent',
        borderRadius: '10px',
        height: 'auto', 
        margin: 0,
        padding: '5px 20px 20px 20px',
        boxShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        background:
            `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box,
            linear-gradient(135deg, ${theme.palette.background.paper}, #000000) border-box`,
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
        background: 'linear-gradient(90deg, #3c7cdc 0%, #d56262 100%)',
        cursor: 'pointer',
        touchAction: 'none',
        userSelect: 'none',
        outline: 'none',
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
        cursor: dragging ? 'grabbing' : 'grab',
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
                onClick={() => toggleMode('cool')}
                onKeyDown={event => {
                    if(event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        toggleMode('cool')
                    }
                }}
                style={modeLabelStyle(mode === 'cool', '#3c7cdc')}>
                COOL
            </div>

            <div className='txt-center' style={{
                margin: '0 auto', 
                fontWeight: 'bold', 
                fontSize: '20px'
            }}>
                °75f
            </div>

            <div
                className='txt-right'
                role='button'
                tabIndex={0}
                onClick={() => toggleMode('heat')}
                onKeyDown={event => {
                    if(event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        toggleMode('heat')
                    }
                }}
                style={modeLabelStyle(mode === 'heat', '#d56262')}>
                HEAT
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
                tabIndex={0}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onKeyDown={handleKeyDown}>

                <div style={{ ...fillStyle, width: `${percent}%` }}></div>
                <div style={{ ...handleStyle, left: `${percent}%` }}></div>

                <div style={tickContainerStyle}>

                    {ticks.map((tick, index) => {

                        const ratio = rangeMax === rangeMin
                            ? 0
                            : (tick - rangeMin) / (rangeMax - rangeMin)
                        const isFirst = index === 0 && (tick !== value - 1)
                        const isLast = index === ticks.length - 1 && (tick !== value + 1)
                        const isMiddle = index === Math.floor(ticks.length / 2) && (tick !== value - 1) && (tick !== value + 1)
                        const isCurrent = tick === value

                        const showLabel = isFirst || isMiddle || isLast || isCurrent

                        return <div
                            key={tick}
                            style={{ ...tickStyle, left: `${ratio * 100}%` }}
                            data-value={tick}>

                            {showLabel ? (
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

export default GenericThermostatSlider
