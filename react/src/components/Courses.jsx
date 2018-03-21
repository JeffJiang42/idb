import CourseCard from './CourseCard.jsx';
import './styles/ModelGrid.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import _ from 'lodash'
import { Grid, Pagination } from 'react-bootstrap'




class Courses extends Component{
  constructor(props){
    super(props);
    this.state = {
      courseList: [],
      page: 1,
      pageSize: 30,
      maxPage: 10
    };
    this.handlePageChange = this.handlePageChange.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }

  handlePageChange(event){
    this.setState({page: Number(event.target.id)})
  }

  prevPage(event){
    var currPage = this.state.page
    if (currPage == 1){
      return
    }
    this.setState({page:currPage-1})
  }

  nextPage(event){
    var currPage = this.state.page
    if (currPage == this.state.maxPage){
      return
    }
    this.setState({page:currPage+1})
  }

  componentDidMount(){
    const url = 'http://api.learning2earn.me/courses';

    fetch(url)
      .then((response) => {return response.json()})
      .then((courseJson) =>{
        return courseJson
      })
      .catch(() => {return []})
      .then((info) => {this.setState({courseList: info})})

  }

  render(){
    var {courseList, page, pageSize} = this.state
    var pageItems = []
    for (let i of _.range(1,11)){
      pageItems.push(
        <Pagination.Item key={i} id={i} onClick={this.handlePageChange} active={i === page}>{i}</Pagination.Item>
      );
    }
    var lastInd = page * pageSize
    var firstInd = lastInd - pageSize
    var courseArr = courseList.slice(firstInd,lastInd)
    var courseCards = courseArr.map((course) =>
      <p>
        <CourseCard provider={course["provider"]} price={course["price"]} courseId={course["id"]} courseName={course["course"]} image={course["image"]}/>
      </p>);

    return(
      <div className='box'>
      <div>
    	{courseCards}
      </div >
      <div className='pages'>
      <Pagination bsSize="large">
        <Pagination.Prev onClick={this.prevPage}/>
        {pageItems}
        <Pagination.Next onClick={this.nextPage}/>
      </Pagination>
      </div>
      </div>
    );
  }
}
export default Courses;
