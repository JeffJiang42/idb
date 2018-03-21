import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles/Card.css';
import CourseData from './CourseData.jsx'

class CourseCard extends Component{

	constructor(props){
	    super(props);
	    this.state = {
	    };
	  }


	render(){
		const { match } = this.props;
	 	return(
    		<div className="col-sm-3">
			  <div className="card"  align="center">
			    <img className="card-img-top" src={this.props.image}/>
			    <div className="card-block">
			      <h4 className="card-title">
			        <Link to={`/courses/${this.props.courseRoute}`}>{this.props.courseName}</Link>
			      </h4>
			      <p className="card-text">Provider: {this.props.provider}</p>
			      <p className="card-text">Tier: {this.props.tier}</p>
			    </div>
			  </div>
			</div>
	    );
	}
}
export default CourseCard;
