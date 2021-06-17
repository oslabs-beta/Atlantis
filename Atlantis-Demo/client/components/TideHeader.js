import React from 'react';
import banner from '../assets/frequency_banner.svg';

function TideHeader() {
  return (
    <div className="tideHeader">
      {/* <img src={banner} alt="banner"/> */}
      <div className="headerMain">
        <div className="left">
          <h1>ATLANTIS</h1>
          <h3>Lightweight Server Side caching solution</h3>
        </div>
        <div className="right">
          <a
            className="npm-button"
            href="https://www.npmjs.com/package/atlantis-cache"
          >
            DOWNLOAD <br /> NPM PACKAGE
          </a>
        </div>
      </div>
    </div>
  );
}

export default TideHeader;
