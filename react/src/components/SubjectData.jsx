import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class SubjectData extends Component{
  render(){
    return(
	<div className="container h-100">
	  	<div className="row h-100 justify-content-center align-items-center">
			<div className="card h-100" align = "center">
				<img className="card-img-top" src="https://i.ytimg.com/vi/cDu-2h8ZDhI/maxresdefault.jpg" />
				<div className="card-body">
				<h4 className="card-title">title</h4>
				<p className="card-text"><strong>Provider</strong>: insert provider</p>
				<p className="card-text"><strong>yep</strong>: <a href="link to course">link</a></p>
				<p className="card-text"><strong>Description</strong>: insert description</p>
				<p className="card-text"><strong># of Courses</strong>: some number</p>
				<p className="card-text"><strong>related courses</strong>: coursesr</p>
				<p className="card-text"><strong>related jobs</strong>: jobs</p>

			  </div>
			</div>
		</div>
	</div>
    );
  }
}

export default SubjectData;
