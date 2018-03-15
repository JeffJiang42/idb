import JobCard from './JobCard.jsx';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';




class Jobs extends Component{
  render(){
    return(
    	<p>
    	<JobCard provider={"insert provider"} company={"insert company"} position={"janitor"} image={"insert image"}/>
    	</p>
    );
  }
}
export default Jobs;















