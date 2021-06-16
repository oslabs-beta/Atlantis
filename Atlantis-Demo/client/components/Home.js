import React from 'react';
import {Link} from 'react-router-dom';
import logo from './logo.svg';


class Home extends React.Component {

    state={
        home: true
      }
    
      handleClick = (e) => {
          this.setState({  
            home: !this.state.home
          })
            
          
       }
    
       
       render() {

      
       

    return(
    <div className="homePg">
    < div className="home">
        
        
        <h1> <Link to="/register"> Wallet </Link> </h1>
        <br/>
        <a href="https://imgur.com/XJHNnUP"><img src="https://i.imgur.com/XJHNnUP.png" title="" /></a>
        {/* <svg svg={logo} width="300px" height="250px" frameBorder="0"  /> */}
        <br/>
        <div onClick={this.handleClick}> { 
        this.state.home
        ? <h2>by CORAL </h2>
        : <h4> <Link  to="/register"> Click to register </Link> </h4>
        } </div>
       
        
    </div>
    </div>
        )
}};

export default Home;