import logo from './logo.svg';
import './App.css';
import { BoxLoading } from 'react-loadingg';


import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Login from "./components/Auth/login";
import Register from "./components/Auth/register";
import ChoosePassword from "./components/Auth/choosePassword";
import history from './components/history';
import Homepage from './components/Home/homepage';
import NavBar from './components/UI/Navbar';
import { useState ,useEffect } from 'react';
import BasicDetails from './components/Details/basicDetails';
import ExperienceDetails from './components/Details/detail_form2';
import Resume from './components/Details/resume'
import axios from 'axios';

function App() {  
  const greeting = 'Hiii Bhaskar';
  const [response, setresponse] = useState(null)
  
  useEffect(() => {
    callAPI()
  });
  
  const callAPI =()=>{
    let devUrl = "http://localhost:3001/contact/getPicklistValues"
    let prodUrl = "https://staffingportals.herokuapp.com/contact/getPicklistValues"
    if(!response){
      axios.get(devUrl)
      .then(result => {
        const resp = result.data.res
        
        setresponse({resp})
        console.log("FromNode1 "+resp)
      });
    }
  }

  if(!response){
    return <BoxLoading />
  }
  
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
            <Route path="/addResume" component={Resume} />
            {/* <Route path="/basic_detail" component={BasicDetails} /> */}
            <Route path='/basic_detail' render={() => <BasicDetails picklistValues={response} history={history}/>} />
            <Route path='/experience_detail' render={() => <ExperienceDetails picklistValues={response} history={history}/>} />
          </Switch>
        </div>
      </div>
    </div>
    </Router>
  );
}

export default App;
