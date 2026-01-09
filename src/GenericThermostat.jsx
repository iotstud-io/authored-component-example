
import { useEffect, useRef, useState } from 'react'

const roundUpIfNeeded = value => {

    const n = Number(value)

    if(!Number.isFinite(n)) return value

    if(Number.isInteger(n)) return n

    return Math.ceil(n)
}

const c_to_f = c => (c * 9 / 5) + 32
const f_to_c = f => (f - 32) * 5 / 9
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const gradientColors = [
    '#0ea5e9',
    '#7dd3fc',
    '#22c55e',
    '#facc15',
    '#fb923c',
    '#ef4444',
]

const gradientStops = [0, 0.22, 0.45, 0.65, 0.82, 1]

const makeGradientStops = (startDeg, endDeg) => {

    const span = Math.max(1, endDeg - startDeg)

    return gradientColors.map((color, idx) => {
        const stop = startDeg + span * gradientStops[idx]
        return `${color} ${stop}deg`
    })
}

const getTemperature = ({ temp_celcius, temp_fahrenheit, format }) => {

    if(format === 'c') {
        if(temp_celcius !== null) return temp_celcius
        if(temp_fahrenheit !== null) return f_to_c(temp_fahrenheit)
    }

    if(format === 'f') {
        if(temp_fahrenheit !== null) return temp_fahrenheit
        if(temp_celcius !== null) return c_to_f(temp_celcius)
    }

    return null
}

const getDefaultThresholds = ({ format, range, currentTemp, minGap }) => {

    const spread = format === 'c' ? 2 : 4
    const mid = Number.isFinite(Number(currentTemp)) ? currentTemp : (range.min + range.max) / 2
    let low = clamp(Math.round(mid - spread), range.min, range.max - minGap)
    let high = clamp(Math.round(mid + spread), range.min + minGap, range.max)

    if(high <= low) {
        high = clamp(low + minGap, range.min + minGap, range.max)
        low = clamp(high - minGap, range.min, range.max - minGap)
    }

    return { low, high }
}

const GenericThermostat = ({
    title='Thermostat',
    theme,
    temp_celcius=null,
    temp_fahrenheit=null,
    settings={},
}) => {

    const format = settings?.temperature_format === 'c' ? 'c' : 'f'
    const range = format === 'c' ? { min: 10, max: 32 } : { min: 50, max: 90 }
    const minGap = 1
    const currentTemp = getTemperature({ temp_celcius, temp_fahrenheit, format })

    const [thresholds, setThresholds] = useState(() =>
        getDefaultThresholds({ format, range, currentTemp, minGap })
    )
    const [dragging, setDragging] = useState(null)
    const sliderRef = useRef(null)
    const prevFormatRef = useRef(format)

    useEffect(() => {
        if(prevFormatRef.current === format) return

        const convert = prevFormatRef.current === 'f' ? f_to_c : c_to_f

        setThresholds(prev => {
            let low = clamp(Math.round(convert(prev.low)), range.min, range.max - minGap)
            let high = clamp(Math.round(convert(prev.high)), range.min + minGap, range.max)

            if(high <= low) {
                high = clamp(low + minGap, range.min + minGap, range.max)
                low = clamp(high - minGap, range.min, range.max - minGap)
            }

            return { low, high }
        })

        prevFormatRef.current = format
    }, [format, range.max, range.min, minGap])

    const sliderSize = 220
    const baseThickness = 8
    const activeThickness = 16
    const gapThickness = 2
    const handleSize = 14
    const centerSize = sliderSize - 2 * (activeThickness + 6)
    const center = sliderSize / 2
    const handleRadius = center - activeThickness / 2
    const startAngle = 180
    const arcSpan = 180

    const lowRatio = (thresholds.low - range.min) / (range.max - range.min)
    const highRatio = (thresholds.high - range.min) / (range.max - range.min)
    const lowDeg = lowRatio * arcSpan
    const highDeg = highRatio * arcSpan

    const baseGradient = `conic-gradient(from ${startAngle}deg, ${makeGradientStops(0, 360).join(', ')})`
    const activeGradient = `conic-gradient(from ${startAngle}deg,
        transparent 0deg ${lowDeg}deg,
        ${makeGradientStops(lowDeg, highDeg).join(', ')},
        transparent ${highDeg}deg 360deg
    )`
    const gapGradient = `conic-gradient(from ${startAngle}deg,
        transparent 0deg ${lowDeg}deg,
        ${theme.palette.text.secondary} ${lowDeg}deg ${highDeg}deg,
        transparent ${highDeg}deg 360deg
    )`

    const ringMask = thickness =>
        `radial-gradient(closest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`

    const temp_slider = {
        position: 'relative',
        width: `${sliderSize}px`,
        height: `${sliderSize}px`,
        borderRadius: '50%',
        backgroundColor: theme.palette.background.paper,
        touchAction: 'none',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }

    const containerStyle = {
        width: 'fit-content',
        border: '1px solid transparent',
        borderRadius: '12px',
        padding: '14px 16px 12px 16px',
        boxShadow: `2px 2px 2px ${theme.palette.background.shadow}`,
        background:
            `linear-gradient(${theme.palette.background.default}, ${theme.palette.background.default}) padding-box,
            linear-gradient(135deg, ${theme.palette.background.paper}, #000000) border-box`,
    }

    const titleStyle = {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: theme.palette.text.primary,
        textAlign: 'center',
    }

    const baseRingStyle = {
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: baseGradient,
        WebkitMaskImage: ringMask(baseThickness),
        maskImage: ringMask(baseThickness),
    }

    const activeRingStyle = {
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: activeGradient,
        WebkitMaskImage: ringMask(activeThickness),
        maskImage: ringMask(activeThickness),
    }

    const gapRingStyle = {
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: gapGradient,
        WebkitMaskImage: ringMask(gapThickness),
        maskImage: ringMask(gapThickness),
        opacity: 0.6,
    }

    const centerStyle = {
        position: 'absolute',
        width: `${centerSize}px`,
        height: `${centerSize}px`,
        borderRadius: '50%',
        backgroundColor: theme.palette.background.default,
        boxShadow: `inset 0 0 12px ${theme.palette.background.shadow}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        zIndex: 2,
    }

    const tempTextStyle = {
        fontSize: '42px',
        fontWeight: 'bold',
        lineHeight: '40px',
        color: theme.palette.text.primary,
    }

    const tempLabelStyle = {
        marginTop: '4px',
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: theme.palette.text.secondary,
    }

    const rangeRowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '10px',
        fontSize: '13px',
        color: theme.palette.text.secondary,
    }

    const lowColor = '#38bdf8'
    const highColor = '#f97316'

    const handleStyle = (value, color) => {
        const angle = (90 - ((value - range.min) / (range.max - range.min)) * arcSpan) * (Math.PI / 180)
        const x = center + handleRadius * Math.cos(angle)
        const y = center + handleRadius * Math.sin(angle)

        return {
            position: 'absolute',
            width: `${handleSize}px`,
            height: `${handleSize}px`,
            borderRadius: '50%',
            left: `${x}px`,
            top: `${y}px`,
            transform: 'translate(-50%, -50%)',
            background: theme.palette.background.paper,
            border: `2px solid ${color}`,
            boxShadow: `0 0 0 4px ${theme.palette.background.default}`,
            cursor: 'grab',
            zIndex: 3,
        }
    }

    const displayTemp = currentTemp !== null ? `${roundUpIfNeeded(currentTemp)}°${format}` : '--'

    const getValueFromPointer = (clientX, clientY) => {
        const rect = sliderRef.current.getBoundingClientRect()
        const dx = clientX - rect.left - rect.width / 2
        const dy = clientY - rect.top - rect.height / 2
        const rawDeg = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360
        const angleFromStart = (90 - rawDeg + 360) % 360
        const clampedAngle = clamp(angleFromStart, 0, arcSpan)
        const ratio = clampedAngle / arcSpan
        const value = range.min + ratio * (range.max - range.min)
        return Math.round(value)
    }

    const setLowValue = value => {
        setThresholds(prev => ({
            low: clamp(value, range.min, prev.high - minGap),
            high: prev.high,
        }))
    }

    const setHighValue = value => {
        setThresholds(prev => ({
            low: prev.low,
            high: clamp(value, prev.low + minGap, range.max),
        }))
    }

    const handlePointerMove = event => {
        if(!dragging || !sliderRef.current) return
        const value = getValueFromPointer(event.clientX, event.clientY)
        if(dragging === 'low') setLowValue(value)
        if(dragging === 'high') setHighValue(value)
    }

    const handlePointerUp = event => {
        if(!dragging) return
        setDragging(null)
        event.currentTarget.releasePointerCapture?.(event.pointerId)
    }

    const handleRingPointerDown = event => {
        if(!sliderRef.current) return
        const value = getValueFromPointer(event.clientX, event.clientY)
        const lowDistance = Math.abs(value - thresholds.low)
        const highDistance = Math.abs(value - thresholds.high)
        const nextDrag = lowDistance <= highDistance ? 'low' : 'high'

        setDragging(nextDrag)
        if(nextDrag === 'low') setLowValue(value)
        if(nextDrag === 'high') setHighValue(value)
        event.currentTarget.setPointerCapture(event.pointerId)
    }

    const handleHandlePointerDown = type => event => {
        event.stopPropagation()
        setDragging(type)
        event.currentTarget.setPointerCapture(event.pointerId)
    }

    return <div style={containerStyle}>

        <div style={titleStyle}>{title}</div>

        <div
            ref={sliderRef}
            style={temp_slider}
            onPointerDown={handleRingPointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            <div style={baseRingStyle}></div>
            <div style={activeRingStyle}></div>
            <div style={gapRingStyle}></div>

            <div style={centerStyle}>
                <div style={tempTextStyle}>{displayTemp}</div>
                <div style={tempLabelStyle}>Current</div>
            </div>

            <div
                style={handleStyle(thresholds.low, lowColor)}
                onPointerDown={handleHandlePointerDown('low')}
            ></div>
            <div
                style={handleStyle(thresholds.high, highColor)}
                onPointerDown={handleHandlePointerDown('high')}
            ></div>
        </div>

        <div style={rangeRowStyle}>
            <div style={{ color: lowColor }}>
                Low {thresholds.low}°{format}
            </div>
            <div style={{ color: highColor }}>
                High {thresholds.high}°{format}
            </div>
        </div>
    </div>
}

export default GenericThermostat
