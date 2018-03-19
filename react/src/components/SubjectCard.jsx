import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles/Card.css';



class SubjectCard extends Component{

	constructor(props){
	    super(props);
	    this.state = {
	    };
	  }


	render(){
	 	return(
    		<div className="col-sm-3">
			  <div className="card"  align="center">
			    <img className="card-img-top" src={this.props.image}/>
			    <div className="card-block">
			      <h4 className="card-title">
			        <a href={this.props.subjectRoute}> {this.props.subjectName}</a>
			      </h4>
			      <p className="card-text">Provider: {this.props.provider}</p>
			      <p className="card-text"># of Courses: {this.props.totalCourses}</p>
			    </div>
			  </div>
			</div>
	    );
	}
}
export default SubjectCard;
