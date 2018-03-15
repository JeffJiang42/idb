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
    		<div class="col-sm-3">
			  <div class="card"  align="center">
			    <img class="card-img-top" src={this.props.image}/>
			    <div class="card-block">
			      <h4 class="card-title">
			        <a href={this.props.course}> {this.props.course}</a>
			      </h4>
			      <p class="card-text">Provider: {this.props.provider}</p>
			      <p class="card-text">Tier: {this.props.tier}</p>
			    </div>
			  </div>
			</div>
	    );
	}
}
export default CourseCard;






