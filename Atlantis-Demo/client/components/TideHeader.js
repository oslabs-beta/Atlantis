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
               <h3>Making the world a better place <br/>with 
                200x speed gains on your GraphQL 
                requests</h3>
           </div>
      </div>
    </div>
  );
}

export default TideHeader;