import React, { Component } from 'react';
import { Router, Route, Link } from 'react-router-dom';
import './styles/Card.css';

class CourseCard extends Component{

	constructor(props){
		super(props)
	}

	render(){
	 	return(
            <Link to={`/courses/${this.props.courseId}`}>
			  <div className="card" style={{ borderRadius: '5px', backgroundImage: `url("${this.props.image}")`}} align="center">
			    <div className="card-block">
			      <h4 className="card-title">
			        {this.props.courseName}
			      </h4>
			      <p className="card-text">Provider: {this.props.provider}</p>
			      <p className="card-text">Price: {this.props.price}</p>
						<p className="card-text">Relevant Jobs: {this.props.relJobs}</p>
			    </div>
			  </div>
              </Link>
	    );
	}
}
export default CourseCard;
