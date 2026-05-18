import React from 'react'

const { createElement } = React

const iconProps = ({ title, ...props }) => ({
    xmlns: 'http://www.w3.org/2000/svg',
    height: '24px',
    viewBox: '0 0 24 24',
    width: '24px',
    fill: 'currentColor',
    'aria-hidden': title ? undefined : true,
    role: title ? 'img' : undefined,
    ...props,
})

const renderIcon = (title, props, paths) => createElement(
    'svg',
    iconProps({ title, ...props }),
    title ? createElement('title', null, title) : null,
    ...paths
)

const emptyRect = createElement('rect', {
    key: 'empty-rect',
    fill: 'none',
    height: '24',
    width: '24',
})

const batteryBarPath = d => [
    createElement('g', { key: 'empty' }, emptyRect),
    createElement('g', { key: 'icon' }, createElement('path', { d })),
]

export const Battery1BarIcon = props => renderIcon(
    'Battery one bar',
    props,
    batteryBarPath('M17,5v16c0,0.55-0.45,1-1,1H8c-0.55,0-1-0.45-1-1V5c0-0.55,0.45-1,1-1h2V2h4v2h2C16.55,4,17,4.45,17,5z M15,6H9v12h6V6z')
)

export const Battery2BarIcon = props => renderIcon(
    'Battery two bars',
    props,
    batteryBarPath('M17,5v16c0,0.55-0.45,1-1,1H8c-0.55,0-1-0.45-1-1V5c0-0.55,0.45-1,1-1h2V2h4v2h2C16.55,4,17,4.45,17,5z M15,6H9v10h6V6z')
)

export const Battery3BarIcon = props => renderIcon(
    'Battery three bars',
    props,
    batteryBarPath('M17,5v16c0,0.55-0.45,1-1,1H8c-0.55,0-1-0.45-1-1V5c0-0.55,0.45-1,1-1h2V2h4v2h2C16.55,4,17,4.45,17,5z M15,6H9v8h6V6z')
)

export const Battery4BarIcon = props => renderIcon(
    'Battery four bars',
    props,
    batteryBarPath('M17,5v16c0,0.55-0.45,1-1,1H8c-0.55,0-1-0.45-1-1V5c0-0.55,0.45-1,1-1h2V2h4v2h2C16.55,4,17,4.45,17,5z M15,6H9v6h6V6z')
)

export const Battery5BarIcon = props => renderIcon(
    'Battery five bars',
    props,
    batteryBarPath('M17,5v16c0,0.55-0.45,1-1,1H8c-0.55,0-1-0.45-1-1V5c0-0.55,0.45-1,1-1h2V2h4v2h2C16.55,4,17,4.45,17,5z M15,6H9v4h6V6z')
)

export const Battery6BarIcon = props => renderIcon(
    'Battery six bars',
    props,
    batteryBarPath('M17,5v16c0,0.55-0.45,1-1,1H8c-0.55,0-1-0.45-1-1V5c0-0.55,0.45-1,1-1h2V2h4v2h2C16.55,4,17,4.45,17,5z M15,6H9v2h6V6z')
)

export const BatteryAlertIcon = props => renderIcon(
    'Battery alert',
    props,
    [
        createElement('path', { key: 'empty', d: 'M0 0h24v24H0V0z', fill: 'none' }),
        createElement('path', { key: 'icon', d: 'M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM13 18h-2v-2h2v2zm0-4h-2V9h2v5z' }),
    ]
)

export const BatteryFullIcon = props => renderIcon(
    'Battery full',
    props,
    [
        createElement('path', { key: 'empty', d: 'M0 0h24v24H0V0z', fill: 'none' }),
        createElement('path', { key: 'icon', d: 'M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z' }),
    ]
)
