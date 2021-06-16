import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
//import NavBar from './components/NavBar'
import {BrowserRouter} from 'react-router-dom'
import styles from './scss/application.scss';
ReactDOM.render(
 
  <BrowserRouter>
     
      <App />
  </BrowserRouter>,
   document.getElementById('root'));



