import React from 'react';
import page_brk from '../assets/page_brk.svg'
import atlantis_QL from '../assets/atlantis_QL.svg'


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
               <h2>Atlantis is a light-weight library that solves the issue of storing and maintaining deeply-nested queries</h2>
               <p>Ensuring the client always receives the most relevant data as mutations are made to the database. </p>
           
           </div>
           <div className="about-right">
               <h1>The Power of Atlantis</h1>
               <img src={atlantis_QL} />
           </div>
          
    </div>
    <div className="about-container">
   
        

   <div className="redis-left">
     
       <img src="https://media.giphy.com/media/rok0zBiCcCMrMFvS9x/giphy.gif" width="300"/>
   </div>
   <div className="redis-right">
   <h2>Queries that are more shallow and within the scope of previous queries 
                are pulled directly from the cache,  offering further flexibility and 
                precision, without additional database requests or overriding previous key-values.</h2>
      
  
   </div>
  
</div>
    
            {/* s */}
            {/* <p> Queries that are more shallow and within the scope of previous queries 
                are pulled directly from the cache,  offering further flexibility and 
                precision, without additional database requests or overriding previous key-values. </p>
                <p> Atlantis that leverages Redis's 'in-memory' quick lookup time
              to dynamically cache GraphQL queries as responses.</p> */}
             
       
        <img src={page_brk} />
       
    </>
  );
}

export default About;