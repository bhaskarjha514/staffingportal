import React, { Component } from 'react'
import { Button, Grid, Paper, Avatar } from '@material-ui/core';


import Radio from '@material-ui/core/Radio';

import { FacebookLoginButton } from "react-social-login-buttons";
import { GoogleLoginButton } from "react-social-login-buttons";
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { db } from '../firebase_config'
import firebase from 'firebase'

class Signin extends Component{
  
    createUser = (user) => {
        db.collection(this.state.pType).add({
            id: user.uid,
            fName: user.displayName.split(' ')[0],
            lName: user.displayName.split(' ')[1],
            profilePic: user.photoURL,
            email: user.email
        })
        alert(`You're signed in As ${user.displayName}`)
    }

    facebookLogin = () => {
        var provider = new firebase.auth.FacebookAuthProvider();
        firebase
            .auth()
            .signInWithPopup(provider)
            .then((result) => {
                /** @type {firebase.auth.OAuthCredential} */
                var credential = result.credential;

                // The signed-in user info.
                var user = result.user;

                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                var accessToken = credential.accessToken;
                this.createUser(user)
                // ...
            })
            .catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                alert(`Error to create a account with ${email}`)
                // ...
            });
    }
    googleSignin = () => {
        var provider = new firebase.auth.GoogleAuthProvider();
        // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
        // firebase.auth().languageCode = 'it';
        firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
                /** @type {firebase.auth.OAuthCredential} */
                var credential = result.credential;

                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                this.createUser(user)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                console.log("Error to create account "+ error)
                // ...
            });
    }

    constructor(props) {
        super(props);
        this.state = {
            pType: "candidate"
        };
    }

    handleChange = (event) => {
        this.setState({pType:event.target.value}) 
    };
    paperStyle = { padding: '30px 20px',margin: "80px auto",alignItems:"center" }
    avatarStyle = { margin: "40px", width: 70, height: 70 ,backgroundColor:'#0039cb'}
    render(){
    return (
        <Grid>
            <Paper elevation={20} style={this.paperStyle}>
                <h2>Create Account</h2>
                <Grid align='center'>
                    <Avatar style={this.avatarStyle}></Avatar>

                    <FormControl component="fieldset">
                        <FormLabel component="legend">Choose Profile</FormLabel>
                        <RadioGroup aria-label="type" name="type1" value={this.state.pType} onChange={this.handleChange} >
                            <FormControlLabel value="companies"  control={<Radio/>} label="Companies" />
                            <FormControlLabel value="candidate"  control={<Radio />} label="Candidate" />

                        </RadioGroup>
                    </FormControl>
                    <hr />
                    <GoogleLoginButton onClick={this.googleSignin} >
                       
                    </GoogleLoginButton>
                    <FacebookLoginButton onClick={this.facebookLogin} style={{margin:'20px auto'}}>
                        
                    </FacebookLoginButton>
                </Grid>
            </Paper>
        </Grid>
    )
    }
}

export default Signin;
