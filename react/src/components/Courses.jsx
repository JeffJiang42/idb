import CourseCard from './CourseCard.jsx';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import _ from 'lodash'




class Courses extends Component{
  constructor(props){
    super(props);
    this.state = {
      courseList: [],
      page: 1,
      pageSize: 30
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(event){
    this.setState({page: Number(event.target.id)})
  }

  componentDidMount(){
    const url = 'http://api.learning2earn.me/courses';

    fetch(url)
      .then((response) => {return response.json()})
      .catch((error) => { this.setState({courseList: error.message})})
      .then((courseJson) =>{
        return courseJson
      })
      .catch(() => {return []})
      .then((info) => {this.setState({courseList: info})})

  }

  render(){
    var {courseList, page, pageSize} = this.state
    var courseArr = courseList.slice(0,this.state.pageSize)
    var courseCards = courseArr.map((course) =>
      <p>
        <CourseCard provider={course["provider"]} price={course["price"]} courseId={course["id"]} courseName={course["course"]} image={course["image"]}/>
      </p>);

    return(
      <div>
    	{courseCards}
      </div>
    );
  }
}
export default Courses;
