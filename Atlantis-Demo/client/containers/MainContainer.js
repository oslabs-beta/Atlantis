import React, { useState } from "react";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import TeamContainer from './TeamContainer';
import About from './About';
import Tree from '../components/Tree';
import Arrow from '../components/Arrow';




function MainContainer() {

  // const [query, setQuery] = useState(() => {});
  // const [queryInput, setQueryInput] = useState(() => '');
  const ExpandTree = () => {
    const [displayTree, setDisplayTree] = useState(true)
    const onClick = () => setDisplayTree(!displayTree)

    return (
      <div>
        <Arrow type="submit" value="Arrow" onClick={onClick} />
        { displayTree ? null :  <Tree /> }
      </div>
    )
 
  }

// else as button for now, arrow later
  return (
    <div className="columnCenterContainer">
     
       
        <About />
        
        <ExpandTree />
        <Dashboard className="queryField"/>
        <TeamContainer />
      </div>
   
  );
}

export default MainContainer;