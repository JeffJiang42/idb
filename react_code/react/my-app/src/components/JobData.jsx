import React, { Component } from 'react';
import { Link } from 'react-router-dom';



class JobData extends Component{
  render(){
    return(
	<div class="container h-100">
	  	<div class="row h-100 justify-content-center align-items-center">
			<div class="card h-100" align = "center" style="width:600px">
				<img class="card-img-top" src="https://i.ytimg.com/vi/cDu-2h8ZDhI/maxresdefault.jpg" />
				<div class="card-body">
				<h4 class="card-title">hello there 1</h4>
				<p class="card-text"><strong>Provider</strong>: insert provider</p>
				<p class="card-text"><strong>yep</strong>: <a href="link to whatever">link</a></p>
			  </div>
			</div>
		</div>
	</div>
    );
  }
}

export default JobData;





