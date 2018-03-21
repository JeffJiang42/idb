import CourseCard from './CourseCard.jsx';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import _ from 'lodash'
import CourseData from './CourseData.jsx'




class Courses extends Component{
  constructor(props){
    super(props);
    this.state = {
      courseList: []
    };
  }

  componentDidMount(){
    var data = [];
    for (let i of _.range(10)){
      var course = {"provider":"provider" + i, "tier": "tier " + i,"courseName":"name " + i, "image":"https://i.imgur.com/g16hr23.png"};
      data.push(course);
    }
    for (let course of data){
      course['courseRoute'] = encodeURIComponent(course["courseName"]);
    }
    this.setState({courseList: data});
  }

  render(){
    var courseCards = this.state.courseList.map((course) =>
      <p>
        <CourseCard provider={course["provider"]} tier={course["tier"]} courseRoute={course["courseRoute"]} courseName={course["courseName"]} image={course["image"]}/>
      </p>);
    return(
      <div>
    	{courseCards}
      </div>
    );
  }
}
export default Courses;
