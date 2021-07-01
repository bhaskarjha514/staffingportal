import logo from './logo.svg';
import './App.css';


import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Login from "./components/Auth/login";
import Register from "./components/Auth/register";
import ChoosePassword from "./components/Auth/choosePassword";
import history from './components/history';
import Homepage from './components/Home/homepage';
import NavBar from './components/UI/Navbar';
import { useState } from 'react';

function App() {  
  return (
    <Router history={history}>
       <div className="App">
      
      <div className="outer">
        <div className="inner">
          <Switch>
            <Route exact path='/' component={Login} />
            <Route path="/signin" component={Login} />
            <Route path="/signup" component={Register} />
            <Route path="/choosepassword" component={ChoosePassword} />
            <Route path="/home" component={Homepage} />
          </Switch>
        </div>
      </div>
    </div>
    </Router>
  );
}

export default App;
