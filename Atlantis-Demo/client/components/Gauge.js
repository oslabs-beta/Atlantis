import React from 'react';
import GaugeChart from 'react-gauge-chart';

const styles = {
  dial: {
    display: 'inline-block',
    width: `95%`,
    height: `auto`,
    color: '#000',
    border: '0.5px solid #fff',
    padding: '2px',
  },
  title: {
    fontSize: '1em',
    color: '#000',
  },
};

const Gauge = ({ responseTime }) => {
  // console.log('res time1 is :', responseTime);
  const maxGuage = (resT) => {
    if (resT > 650) {
      return (resT = 650);
    }
    return resT;
  };
  responseTime = maxGuage(responseTime);
  // console.log('res time is :', responseTime);
  let resCopy = responseTime.toFixed(2);
  // console.log('rescopy', resCopy);
  let percent = responseTime / 700;
  // console.log('percent is', percent);
  return (
    <div style={styles.dial}>
      <GaugeChart
        nrOfLevels={30}
        colors={['#00cccc', '#00ffff', '#ff0000']}
        arcWidth={0.5}
        percent={percent}
        textColor={'#000000'}
        formatTextValue={(percent) => resCopy + ' ms'}
      />
    </div>
  );
};

export default Gauge;
