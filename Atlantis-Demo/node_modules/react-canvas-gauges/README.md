# react-canvas-gauges
[![Travis branch](https://img.shields.io/travis/1995parham/react-canvas-gauges/master.svg?style=flat-square)](https://travis-ci.org/1995parham/react-canvas-gauges)
[![GitHub stars](https://img.shields.io/github/stars/1995parham/react-canvas-gauges.svg?style=flat-square)](https://github.com/1995parham/react-canvas-gauges/stargazers)
[![npm version](https://img.shields.io/npm/v/react-canvas-gauges.svg?style=flat-square)](https://www.npmjs.com/package/react-canvas-gauges)
[![npm license](https://img.shields.io/npm/l/react-canvas-gauges.svg?style=flat-square)]()
[![npm](https://img.shields.io/npm/dw/react-canvas-gauges.svg?style=flat-square)]()
[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Introduction
Canvas gauges component is based on [canvas-gauges](https://canvas-gauges.com/) for React.
## Installation
```
npm install react-canvas-gauges --save
```
## Example
```jsx
<RadialGauge
   units='°C'
   title='Temperature'
   value={this.state.temperature}
   minValue={0}
   maxValue={50}
   majorTicks={['0', '5', '15', '20', '25', '30', '35', '40', '45', '50']}
   minorTicks={2}
></RadialGauge>
```
