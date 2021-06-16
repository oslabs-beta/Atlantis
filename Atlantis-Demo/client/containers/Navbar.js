import React from 'react';
import Logo from '../assets/Asset_3.svg';



const Navbar = () => {
    return (
      <header>
        <div id='logo-main-container'>

          <img id='logo-main' src={Logo} width="50"></img>
        </div>
  
        <ul className='nav-links'>
          <li>
            <a href="https://www.npmjs.com/package/atlantis-cache" target='_blank'>MEDIUM</a>
          </li>
          <li>
            <a href="https://www.npmjs.com/package/atlantis-cache" target='_blank'>NPM PACKAGE</a>
          </li>
          <li>
            <a href='#field'>DEMO</a>
          </li>
          <li>
            <a href='#team'>TEAM</a>
          </li>
          <li>
            <a href='https://github.com/oslabs-beta/Atlantis' target='_blank'>
              GITHUB
            </a>
          </li>
        </ul>
      </header>
    );
  };

  export default Navbar;
