import React,{Component} from 'react'
import firebase from 'firebase';
import NavBar from './../UI/Navbar';

class Homepage extends Component{
    componentDidMount = () => {
        if(localStorage.getItem("uid")===null){
            this.props.history.push('/signup')
        }
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