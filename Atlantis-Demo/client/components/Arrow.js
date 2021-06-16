import React from 'react'

function Arrow(props) {
    return (
        <div id="aniArrow">
        <button className="arrowButton" onClick={props.onClick}>
            <div className="arrow arrowSliding delay1"></div>
            <div className="arrow arrowSliding delay2"></div>
            <div className="arrow arrowSliding delay3"></div>
        </button>
      </div>
    )
}

export default Arrow
