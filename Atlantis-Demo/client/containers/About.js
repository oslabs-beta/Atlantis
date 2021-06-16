import React from 'react';
import page_brk from '../assets/page_brk.svg'



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
        <h2>Atlantis - The App</h2>
        <img src={page_brk} />
    <div className="about">
     
            <p>Atlantis is a light-weight library that leverages Redis <br/>
                key-value store to dynamically cache GraphQL queries as responses. <br/>
                Atlantis is able to dynamically store deeply-nested queries and maintain 
                the most recent and relevant data as mutations are made to the database.<br/>
                Queries that are more shallow and within the scope of previous queries 
                are pulled directly from the cache,  offering further flexibility and <br/>
                precision, without additional database requests or overriding previous key-values. </p>
  
    </div>
    </>
  );
}

export default About;