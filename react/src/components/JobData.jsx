import React, { Component } from 'react';
import { Link } from 'react-router-dom';



class JobData extends Component{
  render(){
    return(
	<div className="container h-100">
	  	<div className="row h-100 justify-content-center align-items-center">
			<div className="card h-100" align = "center">
				<img className="card-img-top" src="https://i.ytimg.com/vi/cDu-2h8ZDhI/maxresdefault.jpg" />
				<div className="card-body">
				<h4 className="card-title">hello there 1</h4>
				<p className="card-text"><strong>Provider</strong>: insert provider</p>
				<p className="card-text"><strong>Link</strong>: <a href="link to whatever">link</a></p>
				<p className="card-text"><strong>Description</strong>: a description</p>
				<p className="card-text"><strong>related subjects</strong>: subjects</p>
				<p className="card-text"><strong>related courses</strong>: courses</p>
			  </div>
			</div>
		</div>
	</div>
    );
  }
}

export default JobData;
