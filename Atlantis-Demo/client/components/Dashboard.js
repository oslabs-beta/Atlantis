import React, { useState } from "react";
import Speedometer from "./Speedometer.js"
import persisted from "../assets/persisted.svg"
import fast from "../assets/fast.svg"
import QueryState from "./QueryState.js"
import Dial from './Dial.js'
// input field that lets us query the route cache test.



let start = 0;
let end = 0;
let dif = 0;
/////--------------------------- Custom state hook ---------------------------------/////

const useInput = (init) => {
  const [value, setValue] = useState(init);
  const onChange = (e) => {
       //setValue(state => ({ ...state, [type]: value }))
     setValue(e.target.value);
  };
  // return the value with the onChange function instead of setValue function
  return [value, onChange];
};
/////---------------------------Component starts here---------------------------------/////
function Dashboard() {
  // const [query, setQuery] = useState(() => {});
  const [queryInput, setQueryInput] = useInput();
  const [responseTime, setResponseTime] = useState(0);
  
let value;

  function setPercent (val) {
    if(value === 1) {
      if(responseTime > 30){
        console.log(value, 'value is here');
        return value = 99.5
      }
    }
    value++;
    return 0
  }
  
  function sendQuery(queryInput) {
      console.log('received this', responseTime)
      // start a timer
      start = performance.now()
      fetch(`/cachetest/${queryInput}`)
        .then((data) => data.json())
        .then((response) => {
          end = performance.now()
          dif = (end-start)
          console.log(dif)
          console.log('got this back after a fetch', response)
        })
        .then(() => setResponseTime(dif))
        .catch((e) => console.log(e));
  }

  function clearCache() {
      fetch('/clearcache/');
      
  }



  return (
    <>
      <h2>Demo & Metrics</h2>
    <div className="queryField">
      <div id="field">
      <h4>Make a Request to Cache your speed Gains</h4>
      <div id="window">
      <QueryState queryInput={queryInput} setQueryInput={setQueryInput}/>
      </div>
      <p>Atlantis Query</p>


       {/* ============___________Query Buttons___________============*/}
      <div className="buttonDash">
        <input
            className="input"
            id="queryOutput"
            type="queryOutput"
            value={responseTime || 'Response Time'}
        ></input>
        <div>
          <button 
            className="submitButton"
            id='runquery'
            onClick={() => {sendQuery(queryInput) }} > Run Query </button>
          <button className="submitButton" id='clearcache' onClick={()=> {clearCache(); setResponseTime(0)} }>Clear Cache </button>
          <button className="submitButton" id='rest'> Reset </button>
        </div>
      </div>

     {/* ============___________Metrics Dash___________============*/}
      </div>
      <div id="speed">
        <div id="meter">
          <Speedometer
            responseTime={responseTime}
          />
          {/* <AccelDial id="dial3" value={this.state.agx} title="Acceleration X" /> */}


        </div>
        <div className="metricDash">
              <div id="metric">
              <h2> 0-100% </h2>
              <img className="metric-logo" src={persisted} alt="persist"/>
              <h5>200x speed </h5>
            </div>
            <div id="metric">
              <h2> 0-100% </h2>
              <img className="metric-logo" src={fast} alt="persist"/>
              <h5>reduced server load  </h5>
            </div>
            <div id="metric">
              <h2>0-100%  </h2>
              <Dial value={value} responseTime={responseTime} setPercent={setPercent} />
              
            </div>
        </div>
      </div>
    </div>

    </>
  );
}

export default Dashboard;


