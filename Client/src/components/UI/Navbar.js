import React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";


export default function NavBar(props) {
    return (
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/signin"}>StaffingPortal</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
            {localStorage.getItem("uid")==null?
            <>
              <li className="nav-item">
                <Link className="nav-link" to={"/signin"}>Sign in</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/signup"}>Sign up</Link>
              </li> </>:
              <>
              <li className="nav-item">
                <Link className="nav-link" to={"/basic_detail"}>Basic Details</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/experience_detail"}>Add Experience</Link>
              </li>
              
              <li className="nav-item">
                <Link className="nav-link" to={"/addResume"}>Upload Resume</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link">About us</Link>
              </li>
              </>
            }
            </ul>
          </div>
        </div>
      </nav>
    )
}

NavBar.defaultProps = {
    searchBar: true
}

NavBar.prototype = {
    searchBar: PropTypes.bool
}
