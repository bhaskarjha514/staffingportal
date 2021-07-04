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
            this.props.history.push('signup')
        }
    }
    callAPI(data){
        let devUrl = "http://localhost:3001/contact/createExperience"
        let prodUrl = "https://staffingportals.herokuapp.com/contact/createExperience"
        axios.post(prodUrl, data)
        .then(response => {
            if(response.data.status){
                toast("Experience Added")
                // this.props.history.goBack()
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
            role_picklist:obj.Candidate_Experience__c.Role__c,
            role:obj.Candidate_Experience__c.Role__c[0],
            startDate:'',
            endDate:'',
            companyName:'',
            responsibility:''
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
        if (this.state.startDate.length < 4 ||this.state.endDate.length<4 || this.state.companyName<1 ||this.state.responsibility<1) {
            alert("All fields are mendatory")
        } else {
            const data = {
                uid:localStorage.getItem("uid"),
                role:this.state.role,
                startDate:this.state.startDate,
                endDate:this.state.endDate,
                companyName:this.state.companyName,
                responsibility:this.state.responsibility}
                this.callAPI(data)
        }

    }

    render() {
        return (
            <>
              <NavBar/>
                <form onSubmit={this.onSubmit}>
                <div className="row">
                <div className="form-group col">
                        <label htmlFor="startDate">Start Date</label>
                        <input type="text" className="form-control" name="startDate" id="startDate" placeholder="mm/dd/yyyy" onChange={this.commonChange}/>
                    </div>

                    <div className="form-group col">
                        <label htmlFor="endDate">End Date</label>
                        <input type="text" className="form-control" name="endDate" id="endDate" placeholder="mm/dd/yyyy" onChange={this.commonChange}/>
                    </div>
                </div>
                
                <div className="form-group">
                        <label htmlFor="companyName">Company Name</label>
                        <input type="text" className="form-control" name="companyName" id="companyName" placeholder="Company Name" onChange={this.commonChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="qualification">Role</label>
                        <select className="form-select" aria-label="Default select example" name="role" onChange={this.commonChange}>
                            {this.state.role_picklist.map((option,index) => (
                                <option defaultValue={index===0?true:false} key={index} value={option}>
                                          {option}
                                 </option>
                             ))}
                        </select>
                       
                    </div>
                    <div className="form-group">
                        <label htmlFor="responsibility">Responsibility</label>
                        <input type="text" className="form-control" name="responsibility" id="responsibility" placeholder="Responsiblity" onChange={this.commonChange}/>
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