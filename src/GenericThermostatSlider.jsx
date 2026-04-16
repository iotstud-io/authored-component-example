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

    const rootStyle = {
        boxShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        background:
            `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box,
            linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.background.shadow}) border-box`,
    }

    const handleStyle = {
        cursor: dragging ? 'grabbing' : 'grab',
    }

    const modeLabelStyle = (selected, accent) => ({
        fontSize: selected ? '20px' : '18px',
        fontWeight: selected ? 'bold' : 'normal',
        color: selected ? accent : theme.palette.text.secondary,
    })

    return <div className='generic-thermostat-slider' style={rootStyle}>

        <div className='generic-thermostat-slider__title txt-center'>
            {title}
        </div>

        <div className='flx align-center'>

            <div
                className='generic-thermostat-slider__mode txt-left'
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

            <div className='generic-thermostat-slider__value txt-center'>
                75°f
            </div>

            <div
                className='generic-thermostat-slider__mode txt-right'
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

        <div className='generic-thermostat-slider__track-wrap'>

            <div
                ref={trackRef}
                className='generic-thermostat-slider__track'
                style={{ cursor: 'pointer' }}
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

                <div className='generic-thermostat-slider__fill' style={{ width: `${percent}%` }}></div>
                <div className='generic-thermostat-slider__handle' style={{ ...handleStyle, left: `${percent}%` }}></div>

                <div className='generic-thermostat-slider__ticks'>

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
                            className='generic-thermostat-slider__tick'
                            style={{ left: `${ratio * 100}%` }}
                            data-value={tick}>

                            {showLabel ? (
                                <div
                                    className='generic-thermostat-slider__tick-label'
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

export default GenericThermostatSlider
