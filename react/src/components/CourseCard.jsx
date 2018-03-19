import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles/Card.css';



class CourseCard extends Component{

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
			        <a href={this.props.courseRoute}> {this.props.courseName}</a>
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
