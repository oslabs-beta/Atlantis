import React, { useState } from 'react';
import Speedometer from './Speedometer.js';
import page_brk from '../assets/page_brk.svg';
import persisted from '../assets/persisted.svg';
import fast from '../assets/fast.svg';
import QueryState from './QueryState.js';
import Dial from './Dial.js';
import Gauge from './Gauge.js';
import { CreateQueryStr } from '../helpers/HelperFunctions.js';
// input field that lets us query the route cache test.

let start = 0;
let end = 0;
let dif = 0;
/////--------------------------- Custom state hook ---------------------------------/////

// const useInput = (init) => {
//   const [value, setValue] = useState(init);
//   const onChange = (e) => {
//     //setValue(state => ({ ...state, [type]: value }))
//     setValue(e.target.value);
//   };
//   // return the value with the onChange function instead of setValue function
//   return [value, onChange];
// };
/////---------------------------Component starts here---------------------------------/////
function Dashboard() {
  // const [query, setQuery] = useState(() => {});
  const [queryInput, setQueryInput] = useState({ companies: ['company_id'] });
  const [responseTime, setResponseTime] = useState(0);

  let value;

  function setPercent(value) {
    if (responseTime > 30) {
      return (value = 99.5);
    } else {
      return 0;
    }
  }

  function isCached() {
    if (responseTime > 30) {
      return false;
    } else {
      return true;
    }
  }

  function sendQuery(queryInput) {
    let parsedResult = CreateQueryStr(queryInput);
    console.log('query input is', parsedResult);
    // console.log('type', typeof parsedResult);
    const body = {
      query: parsedResult,
    };
    // console.log('hard coded query is: ', body);
    fetch(`/cachetest/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((res) => {
        // console.log('res is ', res);
        setResponseTime(res.time);
      })
      .catch((e) => console.log(e));
  }

  function clearCache() {
    fetch('/clearcache/');
  }

  return (
    <>
      <img src={page_brk} />
      <h1>Atlantis Metrics</h1>
      <div className="queryField">
        <div id="field">
          <h3>Make a Request to Cache your speed Gains</h3>
          <h5>
            Clear Cache before beginning! Let's go! <br /> Make an initial query
            to see the time to fetch from database
            <br />
            Then make a query again to the the speed of Atlantis Caching
          </h5>

          <div id="window">
            <QueryState queryInput={queryInput} setQueryInput={setQueryInput} />
          </div>

          {/* ============___________Query Buttons___________============*/}
          <div className="buttonDash">
            {/* <input
              className="input"
              id="queryOutput"
              type="queryOutput"
              value={responseTime || 'Response Time'}
            ></input> */}
            <div>
              <button
                className="submitButton"
                id="runquery"
                onClick={() => {
                  sendQuery(queryInput);
                }}
              >
                {' '}
                Run Query{' '}
              </button>
              <button
                className="submitButton"
                id="clearcache"
                onClick={() => {
                  clearCache();
                  setResponseTime(0);
                }}
              >
                Clear Cache{' '}
              </button>
              {/* <button className="submitButton" id="rest">
                {' '}
                Reset{' '}
              </button> */}
            </div>
          </div>

          {/* ============___________Metrics Dash___________============*/}
        </div>
        <div id="speed">
          <div id="meter">
            {/* <Speedometer responseTime={responseTime} /> */}
            <Gauge responseTime={responseTime} />
            {/* <AccelDial id="dial3" value={this.state.agx} title="Acceleration X" /> */}
          </div>
          <div className="metricDash">
            <div id="metric">
              <img className="metric-logo" src={persisted} alt="persist" />
              <h5>200x faster </h5>
            </div>
            <div id="metric">
              <img className="metric-logo" src={fast} alt="persist" />
              <h5>reduced server load </h5>
            </div>
            <div id="metric">
              <Dial
                value={value}
                responseTime={responseTime}
                setPercent={setPercent}
                isCached={isCached}
                className="dial"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
