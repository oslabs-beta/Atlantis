import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './containers/Navbar';
import App from './App';

import {BrowserRouter} from 'react-router-dom'
// import styles from './scss/application.scss';

ReactDOM.render(
  <BrowserRouter>
      <Navbar/>
      <App />
  </BrowserRouter>,document.getElementById('root'));

