import React, { Component } from 'react'
import firebase from 'firebase';
import { db } from '../../firebase_config'
import { toast } from 'react-toastify';
import NavBar from '../UI/Navbar';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'



class ChoosePassword extends Component {
    componentDidMount = () => {
        toast.configure()
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                this.props.history.push('/signin')
            }else{
                if(localStorage.getItem("uid")!==null){
                    toast("Account is ready")
                    this.props.history.push('/home')
                }
            }
        });
    }

    callAPI(data){
        axios.post("https://staffingportals.herokuapp.com/createUser", data)
        .then(response => console.log("save"));
    }

    constructor(props) {
        super(props);
        this.state = {
            password: "",
            cPassword: ""
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
        if (this.state.password.length < 1 || this.state.cPassword.length < 1) {
            alert("All fields are mendatory")
        } else if (this.state.password !== this.state.cPassword) {
            alert("Password mismatch")
        } else {
            var uid = firebase.auth().currentUser.uid
            localStorage.setItem("uid",uid)
            db.collection("users").doc(uid).update({password:this.state.password})
            const usersRef = db.collection('users').where("id", "==", uid)
            usersRef.get()
            .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                      let username = doc.data().fName+" "+doc.data().lName
                      console.log(username)

                    const data = {userType:doc.data().type,
                        email:doc.data().email,
                        profilePic:doc.data().profilePic,
                        uid:doc.data().id,
                        username:username}
                        this.callAPI(data)
                        });
            })
            .catch((error) => {
                // toast("Incorrect password")
                console.log("Error getting documents: ", error);
            });
            this.props.history.push('/home')
            toast("Password created sucsessfully")
        }

    }

    render() {
        return (
            <>
            <NavBar/>
            <form onSubmit={this.onSubmit}>
                <h3>Choose Password</h3>

                <div className="form-group">
                    <label>New Password</label>
                    <input type="password" className="form-control" name="password" placeholder="Choose Password" onChange={this.commonChange} />
                </div>

                <div className="form-group" style={{ margin: '10px 0px' }}>
                    <label>Confirm Password</label>
                    <input type="password" className="form-control" name="cPassword" placeholder="Confirm Password" onChange={this.commonChange} />
                </div>

                <div className="text-center">
                    <button type="submit" className="btn btn-primary  btn-block" style={{ margin: '10px' }}>Create Password</button>
                </div>
            </form>
            </>
        )
    }
}

export default ChoosePassword