import React, { Component } from 'react';
import { Router, Route, Link } from 'react-router-dom';
import './styles/Card.css';

class JobCard extends Component{

	constructor(props){
		super(props)
	}

	render(){
	 	return(
            <Link to={`/jobs/${this.props.jobId}`}>
			  <div className="card" style={{ borderRadius: '5px', backgroundImage: `url("${this.props.image}")`}} align="center">
			    <div className="card-block">
			      <h4 className="card-title">
			        {this.props.name}
			      </h4>
			      <p className="card-text">Provider: {this.props.provider}</p>
			      <p className="card-text">Company: {this.props.company}</p>
				  <p className="card-text">Related Courses: {this.props.numCourses}</p>
			    </div>
			  </div>
              </Link>
	    );
	}
}
export default JobCard;