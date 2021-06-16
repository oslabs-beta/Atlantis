import React from 'react';
import {NavLink} from 'react-router-dom'
//import logo from './Wallet_Logo.svg';

const NavBar = () => {
  return(
   
    <nav >
        {/* <logo /> */}
        <NavLink className="navLink" to="/">Home</NavLink>
        
        <NavLink className="navLink" to="/login">Login</NavLink>
     
        <NavLink className="navLink" to="/register">Register</NavLink>
     
        <NavLink className="navLink" to="/wallet">Wallet</NavLink>
        
        {/* <NavLink className="navLink" to="/categories">Categories</NavLink> */}
      
        <NavLink className="navLink" to="/about">About</NavLink>

    </nav>
 

  )
};

export default NavBar;