import React from 'react';

import atlantis_QL from '../assets/atlantis_QL.svg'
import space_saving from '../assets/space_saving.svg'
import server_light from '../assets/servers_light.svg'
function About() {
  // const text = `Atlantis is a light-weight library that leverages Redis 
  //               key-value store to dynamically cache GraphQL queries as responses. \n
  //               Atlantis is able to dynamically store deeply-nested queries and maintain 
  //               the most recent and relevant data as mutations are made to the database. \n
  //               Queries that are more shallow and within the scope of previous queries 
  //               are pulled directly from the cache,  offering further flexibility and \n
  //               precision, without additional database requests or overriding previous key-values. \n`

  return (
    <>
    
    
    <div className="about-container">
   
        

           <div className="about-left">
               <h2>Atlantis is a light-weight library that solves the issue of storing and maintaining deeply-nested GraphQL queries</h2>
               <p>Ensuring the client always receives the most relevant data as mutations are made to the database. </p>
           
           </div>
           <div className="about-right">
               <h1>The Power of Atlantis</h1>
               <img src={atlantis_QL} />
           </div>
          
    </div>
    <div className="about-container">
   
        

    <div className="redis-left">
        
      <h1>Saving Time</h1>
          <img src="https://media.giphy.com/media/rok0zBiCcCMrMFvS9x/giphy.gif" width="300"/>
      </div>
      <div className="redis-right">
      <h2>Atlantis leverages Redis's 'in-memory' quick lookup time
              to rapidly serve up cached graphQL responses regardless of size or structure.</h2>
      <img src={server_light} className='server'/>
      <p>Redis integration along with Pub/Sub architecture also allows for
         scaling as your needs grow and you require more cache space or backup cache workers</p>
      </div>
      
    </div>
  <div className="about-container">
    
          

      <div className="server-left">
      <h2>New queries that bare resemblance to previous queries, are intelligently pulled from the existing
         cached nesting instead of creating a new key/value entry </h2>
        
      </div>
      <div className="server-right">
      <h1>Saving Space</h1>
          <img src={space_saving} />
      </div>
    
  </div>
      
    
            {/* s */}
            {/* <p> Queries that are more shallow and within the scope of previous queries 
                are pulled directly from the cache,  offering further flexibility and 
                precision, without additional database requests or overriding previous key-values. </p>
                <p> Atlantis that leverages Redis's 'in-memory' quick lookup time
              to dynamically cache GraphQL queries as responses.</p> */}
             
       
       
       
    </>
  );
}

export default About;