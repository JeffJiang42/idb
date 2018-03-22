import React, { Component } from 'react';
import { Router, Route, Link } from 'react-router-dom';
import './styles/Card.css';

class SubjectCard extends Component{

	constructor(props){
		super(props)
	}

	render(){
	 	return(
            <Link to={`/courses/${this.props.subId}`}>
			  <div className="card" style={{ borderRadius: '5px', backgroundImage: `url("${this.props.image}")`}} align="center">
			    <div className="card-block">
			      <h4 className="card-title">
			        {this.props.subName}
			      </h4>
			      <p className="card-text">Provider: {this.props.provider}</p>
			      <p className="card-text"># of Courses: {this.props.totalCourses}</p>
			    </div>
			  </div>
              </Link>
	    );
	}
}
export default SubjectCard;
