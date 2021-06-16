import React from 'react'
import { RadialGauge } from "react-canvas-gauges";

function Speedometer({ responseTime, setResponseTime }) {



    return (
        <div>
            
                <RadialGauge
                    units="Milliseconds"
                    title="Speed"
                    value={0 || responseTime}
                    minValue={0}
                    maxValue={100}
                    majorTicks={[
                    "1200",
                    "1100",
                    "1000",
                    "900",
                    "800",
                    "600",
                    "400",
                    "300",
                    "200",
                    "100"
                    ]}
                    minorTicks={2}
                    data-highlights='[
                    { "from": 50, "to": 100, "color": "rgb(111, 235, 111,.25)" },
                    { "from": 100, "to": 150, "color": "rgb(76, 219, 76,.25)" },
                    { "from": 150, "to": 200, "color": "rgb(181, 219, 76, .25)" },
                    { "from": 200, "to": 220, "color": "rgba(0,0,255,.25)" }
                    { "from": 0, "to": 100, "color": "rgba(248, 28, 28, .15)" }
                    ]'
                />
                <canvas data-type="radial-gauge"
                    data-highlights='[
                    { "from": 50, "to": 100, "color": "rgb(111, 235, 111,.25)" },
                    { "from": 100, "to": 150, "color": "rgb(76, 219, 76,.25)" },
                    { "from": 150, "to": 200, "color": "rgb(181, 219, 76, .25)" },
                    { "from": 200, "to": 220, "color": "rgba(0,0,255,.25)" }
                    { "from": 0, "to": 100, "color": "rgba(248, 28, 28, .15)" }
                    ]'
                >

            </canvas>
        </div>
    )
}

export default Speedometer
