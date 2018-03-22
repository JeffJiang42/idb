import React, { Component } from 'react';
import { Router, Route, Link } from 'react-router-dom';
import './styles/Card.css';

class CourseCard extends Component{

	render(){
		const { match } = this.props;
	 	return(
			  <div className="card"  align="center">
			    <img className="card-img-top" src={this.props.image}/>
			    <div className="card-block">
			      <h4 className="card-title">
			        <Link to={`/courses/${this.props.courseId}`}>{this.props.courseName}</Link>
			      </h4>
			      <p className="card-text">Provider: {this.props.provider}</p>
			      <p className="card-text">Price: {this.props.price}</p>
						<p className="card-text">Relevant Jobs: {this.props.relJobs}</p>
			    </div>
			  </div>
	    );
	}
}
export default CourseCard;
