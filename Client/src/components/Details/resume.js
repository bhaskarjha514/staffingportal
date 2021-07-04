import React, { Component } from 'react'
import firebase from 'firebase';
import { db } from '../../firebase_config'
import { toast } from 'react-toastify';
import NavBar from '../UI/Navbar';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import history from '../history';



class BasicDetails extends Component {
    componentDidMount = () => {
        if (localStorage.getItem("uid") === null) {
            this.props.history.push('/signup')
        }
    }
    callAPI() {
        let devUrl = "http://localhost:3001/contact/saveDocuments"
        let prodUrl = "https://staffingportals.herokuapp.com/contact/saveDocuments"
        let data={uid:localStorage.getItem("uid"),resumeUrl:this.state.resumeUrl,cvUrl:this.state.cvUrl}
        axios.post(prodUrl, data)
            .then(response => {
                if (response.data.status) {
                    toast("Resume Uploaded")
                    this.props.history.push('/home')
                } else {
                    toast(response.data.msg)
                }
            })
    }


    constructor(props) {
        toast.configure()
        super(props);

        this.state = {
            resumeUrl: '',
            cvUrl: ''
        };
        this.onResumeSelected = this.onResumeSelected.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
  
    onResumeSelected(e) {
        const file = e.target.files[0]
        const storageRef = firebase.storage().ref()
        const fileRef = storageRef.child(localStorage.getItem("uid")).child(e.target.name+file.name)
        var uploadTask = fileRef.put(file);

        uploadTask.on('state_changed',
            (snapshot) => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                    default :
                        console.log('Def')    
                }
            },
            (error) => {
                // Handle unsuccessful uploads
            },
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    this.setState({
                        [e.target.name]: downloadURL
                    });
                    console.log('File available at', downloadURL);
                });
            }
        );
    }
    onSubmit(event) {
        event.preventDefault();
        if (this.state.resumeUrl.length < 4 || this.state.cvUrl.length < 4) {
            alert("Wait file are uploading")
        } else {
            db.collection("users").doc(localStorage.getItem("uid")).update({ resumeUrl: this.state.resumeUrl })
            db.collection("users").doc(localStorage.getItem("uid")).update({ cvUrl: this.state.cvUrl })
            this.callAPI()
        }

    }

    render() {
        return (
            <>
                <NavBar />
                <form onSubmit={this.onSubmit}>

                    <div className="form-group ">
                        <label htmlFor="startDate">Upload Resume</label>
                        <input type="file" className="form-control" name="resumeUrl" id="resumeUrl" placeholder="Select Resume" onChange={this.onResumeSelected} />
                    </div>

                    <div className="form-group ">
                        <label htmlFor="startDate">Upload CV</label>
                        <input type="file" className="form-control" name="cvUrl" id="cvUrl" placeholder="Select CV" onChange={this.onResumeSelected} />
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary  btn-block" style={{ margin: '10px' }}>Submit</button>
                    </div>

                </form>
            </>
        )
    }
}

export default BasicDetails