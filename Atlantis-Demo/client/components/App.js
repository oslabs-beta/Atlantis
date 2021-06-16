import React from 'react';
import { Switch, Route} from 'react-router-dom'

import Home from './Home'
import Form from './Form'
import NavBar from './NavBar'
import About from './About'
import AllCategories from './AllCategories'
// import Wallet from '../WalletComponents/Wallet'


////import logo from './logo.svg';

import  {themes} from "../WalletComponents/Themes";



import {withRouter} from 'react-router-dom'
//import Category from '../WalletComponents/Category';



  class App extends React.Component {
   


 
    //----------------RENDERING COMPONENTS-----------------//

    renderForm = (routerProps) => {
      if(routerProps.location.pathname === "/login"){
        return <Form
          formName="Login"
          user={this.state.user}
          handleSubmit={this.handleLoginSubmit}
          handleLoginGithub={this.handleLoginGithub}
         
        />
      } else if (routerProps.location.pathname === "/register") {
        return <Form
        formName="Register To Begin"
        
        handleSubmit={this.handleRegisterSubmit}
        handleLoginGithub={this.handleLoginGithub}
        />
      }
    }

    renderWallet = (routerProps) => {
     // if(this.state.token){
        return <Wallet
        // user={this.state.user}
        // token={this.state.token}
        // clearUser={this.clearUser}

        // WalletID={this.state.user.wallet[0].id}
        categories={this.state.categories}
        addCategory={this.addCategory}
        updateCategory={this.updateCategory}
        deleteCategory={this.deleteUserCategory}

        //  themeNames={this.state.themeNames}
        
        // updateTheme={this.updateTheme}

        />
         
      // } 
      //else {
      //   this.props.history.push("/login")
      // }
    }

    renderAbout = (routerProps) => {
      return <About />
    }

    renderCategories = (routerProps) => {
      return <AllCategories 
     
      categories={this.state.categories} 
      />
    }

    
    

    
    render() {
      // const themeNames = [
      //   {name: light, id: 1},
      //   {name: nightmode, id: 2}
      //  ]
      // const mode = this.state.themes
      // const style = themes[mode]
    console.log(this.state.user)
      return (
      
        // <ThemeProvider theme={{themes: style}} > 
        //   <GlobalStyle/>
            <div >
              
              <style>
              @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap')
              </style>
              <NavBar/>  
              <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/login" render={this.renderForm}/>
                <Route path="/register" render={this.renderForm}/>
                <Route path="/wallet" render={this.renderWallet} />
                {/* <Route path="/categories" render={this.renderCategories} /> */}
                <Route path="/about" render={this.renderAbout} />
                {/* <Route path="/about" render={this.renderErrorPage} /> */}
              </Switch>
              
            </div>
        // </ThemeProvider>
     
    )
  }

}

let RouterComponent = withRouter(App)
export default RouterComponent
