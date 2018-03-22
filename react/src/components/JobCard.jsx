import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles/Card.css';



class JobCard extends Component{

	constructor(props){
	    super(props);
	    this.state = {
	    };
	  }

	render(){
	 	return(
			  <div className="card"  align="center">
			    <Link to={`/jobs/${this.props.jobId}`}><img className="card-img-top" src={this.props.image}/></Link>
			    <div className="card-block">
			      <h4 className="card-title">
			        <Link to={`/jobs/${this.props.jobId}`}>{this.props.name}</Link>
			      </h4>
			      <p className="card-text">Provider: {this.props.provider}</p>
			      <p className="card-text">Company: {this.props.company}</p>
						<p className="card-text">Related Courses: {this.props.numCourses}</p>
			    </div>
			  </div>
	    );
	}
}
export default JobCard;
