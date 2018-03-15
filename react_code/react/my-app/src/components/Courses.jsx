import CourseCard from './CourseCard.jsx';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';




class Courses extends Component{
  render(){
    return(
    	<p>
    	<CourseCard provider={"insert provider"} tier={"insert tier"} course={"janitor101"} image={"insert image"}/>
    	</p>
    );
  }
}
export default Courses;