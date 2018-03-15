import SubjectCard from './SubjectCard.jsx';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';



class Subjects extends Component{
  render(){
    return(
    	<p>
    	<SubjectCard provider={"insert provider"} totalCourses={"insert number of courses"} subject={"Janitorology: the study of janitors"} image={"insert image"}/>

    	</p>
    );
  }
}

export default Subjects;


