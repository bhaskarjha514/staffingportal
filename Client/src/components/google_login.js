import React, { Component, useState } from 'react';
import firebase from 'firebase'
import { db } from '../firebase_config'

class GoogleLogin extends Component {
    createUser = (user) => {
        var type = this.state.loginAs

        db.collection(type).add({
            id: user.uid,
            fName: user.displayName.split(' ')[0],
            lName: user.displayName.split(' ')[1],
            profilePic: user.photoURL,
            email: user.email
        })
        alert(`You're signed in As ${user.fName}`)
    }
    selectOnlyThis = (id) => {
        var myCheckbox = document.getElementsByName("myCheckbox");
        Array.prototype.forEach.call(myCheckbox, function (el) {
            el.checked = false;
        });
        id.checked = true;
    }
    constructor(props) {
        super(props);
        this.state = {
            isChecked: false,
            loginAs: "candidate"
        };
    }
    handleChange = (e) => {
        this.setState({ isChecked: !this.state.isChecked, loginAs: this.state.loginAs });
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
    onSubmit = () => {
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
                var uid = user.uid;
                var username = user.displayName
                var email = user.email
                var profilePic = user.photoURL
                var userType = this.state.loginAs

                this.createUser(user)

                console.log(user + "And it's type " + userType)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });


    }
    componentDidMount = () => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                var uid = user.uid;
                var username = user.displayName
                var email = user.email
                var profilePic = user.photoURL
                // var profilePic = user.
                // user already registerd
                alert(`login as ${username}`)
                // ...
            } else {
                console.log("User has signed out")
                // User is signed out
                // ...
            }
        });
    }
    render() {
        return (
            <div className="login-area card mx-auto mt-5">
                <div className="form-check">
                    {/* <input class="form-check-input" type="checkbox" value="" checked={!this.state.isChecked} id="flexCheckDefault" onClick={() => this.setState({ isChecked: !this.state.isChecked, loginAs: "companies" })}/> */}
                    <input className="form-check-input" type="checkbox" name="myCheckbox" value="1"  id="flexCheckDefault" onClick={this.selectOnlyThis(this)} />
                    <label className="form-check-label" htmlFor="flexCheckChecked">
                        Login as companies
                    </label>

                </div>
                <div className="form-check">
                    {/* <input class="form-check-input" type="checkbox" value="" checked={this.state.isChecked} id="flexCheckChecked" onClick={() => this.setState({ isChecked: !this.state.isChecked, loginAs: "candidate" })} /> */}
                    <input className="form-check-input" type="checkbox" value="1" name="myCheckbox" id="flexCheckChecked" onClick={this.selectOnlyThis(this)}  />
                    <label className="form-check-label" htmlFor="flexCheckChecked">
                        Login as candaidate
                    </label>
                </div>
                <div className="card-body p-5">
                    <h5 className="text-center mb-4">Sign in on Staffing and registering Portal</h5>
                    <button onClick={this.onSubmit} type="button" className="btn btn-primary text-white w-100">Sign in with Google</button>
                    <button onClick={this.facebookLogin} type="button" className="btn btn-primary text-white w-100">Sign in with Facebook</button>
                </div>

            </div>
        )
    }
}

export { GoogleLogin }