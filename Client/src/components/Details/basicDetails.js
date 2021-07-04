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
        if(localStorage.getItem("uid")===null){
            this.props.history.goBack()
        }
    }
    callAPI(data){
        let devUrl = "http://localhost:3001/contact/saveBasicDetails"
        let prodUrl = "https://staffingportals.herokuapp.com/contact/saveBasicDetails"
        axios.post(prodUrl, data)
        .then(response => {
            if(response.data.status){
                toast("Details Saved")
                this.props.history.goBack()
                this.props.history.push('/home')
            }else{
                toast(response.data.msg)
            }
        })
    }


    constructor(props) {
        toast.configure()
        super(props);
        var obj = JSON.parse(props.picklistValues.resp)
        this.state = {
            qualification_picklist:obj.Contact.Qualification__c,
            experience_picklist:obj.Contact.Total_Experience__c,
            qualification:obj.Contact.Qualification__c[0],
            experience:obj.Contact.Total_Experience__c[0],
            empStatus:'false',
            collegeOrCompanyName:''
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
        if (this.state.collegeOrCompanyName.length < 1) {
            alert("All fields are mendatory")
        } else {
            const data = {
                uid:localStorage.getItem("uid"),
                experience:this.state.experience,
                qualification:this.state.qualification,
                empStatus:this.state.empStatus,
                collegeOrCompanyName:this.state.collegeOrCompanyName}
                this.callAPI(data)
        }

    }

    render() {
        return (
            <>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label htmlFor="experience">Experience</label>
                        <select className="form-select" aria-label="Default select example" name="experience" onChange={this.commonChange}>
                            {this.state.experience_picklist.map((option,index) => (
                                <option defaultValue={index===0?true:false} key={index} value={option}>
                                          {option}
                                 </option>
                             ))}
                        </select>
                       
                    </div>
                    <div className="form-group">
                        <label htmlFor="qualification">Highest Qualification</label>
                        <select className="form-select" aria-label="Default select example" name="qualification" onChange={this.commonChange}>
                            {this.state.qualification_picklist.map((option,index) => (
                                <option defaultValue={index===0?true:false} key={index} value={option}>
                                          {option}
                                 </option>
                             ))}
                        </select>
                       
                    </div>
                    <FormControl component="fieldset" className="my-3">
                            <FormLabel component="legend">Employed status</FormLabel>
                            <RadioGroup aria-label="type" name="empStatus"  value={this.state.empStatus} onChange={this.commonChange}>
                                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                <FormControlLabel value="false" control={<Radio />} label="No" />

                            </RadioGroup>
                        </FormControl>
                        <div className="form-group">
                        <label htmlFor="collgeOrCompanyName">{this.state.empStatus==='true'?'Company Name':'College Name'}</label>
                        <input type="text" className="form-control" name="collegeOrCompanyName" id="collgeOrCompanyName" placeholder={this.state.empStatus==='true'?'Company Name':'College Name'} onChange={this.commonChange}/>
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