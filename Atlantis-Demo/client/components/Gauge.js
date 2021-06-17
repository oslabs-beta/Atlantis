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
  let percent = responseTime / 700;
  const maxGuage = (resT) => {
    if (resT > 650) {
      return (resT = 650);
    }
  };
  return (
    <div style={styles.dial}>
      <GaugeChart
        nrOfLevels={30}
        colors={['#00cccc', '#00ffff', '#ff0000']}
        arcWidth={0.5}
        percent={percent}
        textColor={'#000000'}
        formatTextValue={(responseTime) => responseTime + ' mil'}
      />
    </div>
  );
};

export default Gauge;
