const tempColor = (t, u, th) => (
    f => {
        const colors = [
            th.palette.tertiary.dark,
            th.palette.tertiary.main,
            th.palette.info.main,
            th.palette.info.light,
            th.palette.success.light,
            th.palette.success.main,
            th.palette.warning.light,
            th.palette.error.light,
            th.palette.error.main
        ]

        if(f <= 0) return colors[0]
        if(f <= 16) return colors[1]
        if(f <= 32) return colors[2]
        if(f <= 55) return colors[3]
        if(f <= 65) return colors[4]
        if(f <= 79) return colors[5]
        if(f <= 89) return colors[6]
        if(f <= 99) return colors[7]
        if(f >= 100) return colors[8]
    }
)(u === 'f' ? t : (t * 9 / 5 + 32))

const roundUpIfNeeded = value => {

    const n = Number(value)

    if(!Number.isFinite(n)) return value

    if(Number.isInteger(n)) return n

    return Math.ceil(n)
}

const c_to_f = c => (c * 9 / 5) + 32
const f_to_c = f => (f - 32) * 5 / 9

export { c_to_f, f_to_c, roundUpIfNeeded, tempColor }