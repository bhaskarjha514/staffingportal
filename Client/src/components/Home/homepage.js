import React,{Component} from 'react'
import firebase from 'firebase';
import NavBar from './../UI/Navbar';
import axios from 'axios';

class Homepage extends Component{
    componentDidMount = () => {
        if(localStorage.getItem("uid")===null){
            this.props.history.push('/signup')
        }else{
            this.callAPI()
        }
    }
    callAPI(){
        let devUrl = "http://localhost:3001/contact/hasFilledBasicDetails"
        let prodUrl = "https://staffingportals.herokuapp.com/contact/hasFilledBasicDetails"
        const body={uid:localStorage.getItem('uid')}
        
        axios.post(prodUrl, body)
        .then(response =>{
            console.log(response.data)
            if(!response.data.status){
                this.props.history.replace('/basic_detail')
            }
        });
    }
    render(){
        return(
            <>
            <NavBar/>
            <div>
                Welcome to Recuriment portal
            </div>
            </>
        )
    }
}

export default Homepage