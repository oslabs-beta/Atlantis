import React, { useState } from "react";
import { arc } from "d3-shape";
import { scaleLinear } from "d3-scale";
import { format } from "d3-format";
import { timeMillisecond } from "d3";


const Dial = ({
  value,
  min = 0,
  max = 100,
  label,
  units = timeMillisecond,
  responseTime,
  setPercent
}) => {
  console.log(value, 'here is respone time');
  // const [ coords, setCoords ] = useState(0);

  // set state to invoke getCoords

  //  || state to boolen, triggered or not triggered, if 
  //if runtime > 30s, not cached yet, else, it has been cached and can set to true
  // if state false, then ! getcoords on arc
  // once setPercent invoked and changed to 99.5
  // it will invoke State since conditional will be true
  // and true invokes getCoordsOnArc

  
  
  // console.log(newVal, 'newVal is here 1'); // undef
  // const newVal = setPercent(value)  //99.5 

  // let triggered;

  // console.log(triggered,' here is triggered 1'); 
  // if (newVal === 99.5) {

  //   if (triggered) {
  //     console.log('entered coords');
      
  //   }

  //   console.log('here is market');
  //   triggered = true;
  // }
  // console.log(triggered,' here is triggered'); 

  // console.log(newVal, 'newVal is here 2'); // 0, 99.5
  const backgroundArc = arc()
    .innerRadius(0.65)
    .outerRadius(1)
    .startAngle(-Math.PI / 2)
    .endAngle(Math.PI / 2)
    .cornerRadius(1)();

  const percentScale = scaleLinear().domain([min, max]).range([0, 1]);
  const percent = percentScale(value);

  const angleScale = scaleLinear()
    .domain([0, 1])
    .range([-Math.PI / 2, Math.PI / 2])
    .clamp(true);

  const angle = angleScale(percent);

  const filledArc = arc()
    .innerRadius(0.65)
    .outerRadius(1)
    .startAngle(-Math.PI / 2)
    .endAngle(angle)
    .cornerRadius(1)();

  const colorScale = scaleLinear()
    .domain([0, 1, 2, 3])
    .range(["#9B554E", "#67EFE5", "#A6FFF8", "#A6FFF8"]);

  const gradientSteps = colorScale.ticks(10).map((value) => colorScale(value));

  const markerLocation = getCoordsOnArc(angle, 1 - (1 - 0.65) / 2);
 

  return (
    <div
      style={{
        textAlign: "center"
      }}
    >
      <svg
        style={{ overflow: "visible" }}
        width="9em"
        viewBox={[-1, -1, 2, 1].join(" ")}
      >
        <defs>
          <linearGradient
            id="Gauge__gradient"
            gradientUnits="userSpaceOnUse"
            x1="-1"
            x2="1"
            y2="0"
          >
            {gradientSteps.map((color, index) => (
              <stop
                key={color}
                stopColor={color}
                offset={`${index / (gradientSteps.length - 1)}`}
              />
            ))}
          </linearGradient>
        </defs>
        <path d={backgroundArc} fill="#dbdbe7" />
        <path d={filledArc} fill="url(#Gauge__gradient)" />
        <circle
          cx={markerLocation[0]}
          cy={markerLocation[1]}
          r="0.2"
          stroke="#2c3e50"
          strokeWidth="0.01"
          fill={colorScale(percent)}
        />
        <path
          d="M0.136364 0.0290102C0.158279 -0.0096701 0.219156 -0.00967009 0.241071 0.0290102C0.297078 0.120023 0.375 0.263367 0.375 0.324801C0.375 0.422639 0.292208 0.5 0.1875 0.5C0.0852272 0.5 -1.8346e-08 0.422639 -9.79274e-09 0.324801C0.00243506 0.263367 0.0803571 0.120023 0.136364 0.0290102ZM0.1875 0.381684C0.221591 0.381684 0.248377 0.356655 0.248377 0.324801C0.248377 0.292947 0.221591 0.267918 0.1875 0.267918C0.153409 0.267918 0.126623 0.292947 0.126623 0.324801C0.126623 0.356655 0.155844 0.381684 0.1875 0.381684Z"
          transform={`rotate(${
            angle * (180 / Math.PI)
          }) translate(-0.2, -0.33)`}
          fill="#6a6a85"
        />
      </svg>

      <div
        style={{
          marginTop: "0.4em",
          fontSize: "2em",
          lineHeight: "1em",
          fontWeight: "900",
          fontFeatureSettings: "'zero', 'tnum' 1"
        }}
      >
        {format(",")(value)}
      </div>

      {!!label && (
        <div
          style={{
            color: "#8b8ba7",
            marginTop: "0.6em",
            fontSize: "1.3em",
            lineHeight: "1.3em",
            fontWeight: "700"
          }}
        >
          {label}
        </div>
      )}

      {!!units && (
        <div
          style={{
            color: "#8b8ba7",
            lineHeight: "1.3em",
            fontWeight: "300"
          }}
        >
          {units}
        </div>
      )}
    </div>
  );
};


const getCoordsOnArc = (angle, offset = 10) => [
  Math.cos(angle - Math.PI / 2) * offset,
  Math.sin(angle - Math.PI / 2) * offset
];


export default Dial;
