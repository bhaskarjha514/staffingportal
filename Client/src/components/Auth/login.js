import React, { Component } from 'react'
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import firebase from 'firebase';
import { db } from '../../firebase_config'
import NavBar from '../UI/Navbar';
import axios from 'axios';


class Login extends Component {
    componentDidMount = () => {
        if(localStorage.getItem("uid")!==null){
            toast("Account is ready")
            this.props.history.push('/home')
        }
    }
    constructor(props) {
        toast.configure()
        super(props);
        this.state = {
            email: "",
            password: "",
            hasFilledBasicActivity:false
        };
        this.commonChange = this.commonChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    commonChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
  
    onSubmit(event) {
        event.preventDefault();
        if (this.state.email.length < 1 || this.state.password.length < 1) {
            alert("All fields are mendatory")
        } else {
            const usersRef = db.collection('users').where("email", "==", this.state.email)

            usersRef.get()
                .then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        toast("Account doesn't exist")
                        this.props.history.push('/signup')
                    } else {
                        querySnapshot.forEach((doc) => {
                            if (doc.data().password === this.state.password) {
                                localStorage.setItem("uid",doc.data().id)
                                toast("Successfully login!")
                                this.props.history.push('/home')
                            } else {
                                toast("Incorrect password")
                            }
                        });
                    }
                })
                .catch((error) => {
                    toast("Incorrect password")
                    console.log("Error getting documents: ", error);
                });
        }

    }

    render() {
        return (
            <>
                 <NavBar/>
            <form onSubmit={this.onSubmit}>
                <h3>Signin</h3>

                <div className="form-group">
                    <label>Email</label>
                    <input type="email" className="form-control" name="email" placeholder="Enter email" onChange={this.commonChange} />
                </div>

                <div className="form-group" style={{ margin: '10px 0px' }}>
                    <label>Password</label>
                    <input type="password" className="form-control" name="password" placeholder="Enter Password" onChange={this.commonChange} />
                </div>

                <div className="text-center">
                    <button type="submit" className="btn btn-primary  btn-block" style={{ margin: '10px' }}>Signin</button>
                </div>
            </form>
            </>
        );
    }
}

export default Login;
