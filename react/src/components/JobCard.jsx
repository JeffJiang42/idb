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
    		<div class="col-sm-3">
			  <div class="card"  align="center">
			    <img class="card-img-top" src={this.props.image}/>
			    <div class="card-block">
			      <h4 class="card-title">
			        <a href={this.props.positionRoute}> {this.props.positionName}</a>
			      </h4>
			      <p class="card-text">Provider: {this.props.provider}</p>
			      <p class="card-text">Company: {this.props.company}</p>
			    </div>
			  </div>
			</div>
	    );
	}
}
export default JobCard;
