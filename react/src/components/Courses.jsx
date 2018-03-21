import CourseCard from './CourseCard.jsx';
import './styles/ModelGrid.css';
import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import _ from 'lodash'
import { Row, Grid, Pagination } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'




class Courses extends Component{
  constructor(props){
    super(props);
    this.state = {
      courseList: [],
      page: 1,
      pageSize: 60,
      maxPage: 10
    };
    this.handlePageChange = this.handlePageChange.bind(this);
    this.prevPage = this.prevPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }

  handlePageChange(event){
    this.setState({page: Number(event.selected+1)})
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
      .then((info) => {this.setState({courseList: info, maxPage: Math.ceil(info.length / this.state.pageSize)})})

  }

  render(){
    var {courseList, page, pageSize, maxPage} = this.state
    var pageItems = []
    for (let i of _.range(1, maxPage + 1)){
      pageItems.push(
        <Pagination.Item key={i} id={i} onClick={this.handlePageChange} active={i === page}>{i}</Pagination.Item>
      );
    }
    var lastInd = page * pageSize
    var firstInd = lastInd - pageSize
    var courseArr = courseList.slice(firstInd,lastInd)
    var courseCards = courseArr.map((course) =>
      <div className="col-sm-4">
      <div className='card'>
        <CourseCard provider={course["provider"]} price={course["price"]} courseId={course["id"]} courseName={course["course"]} image={course["image"]}/>
      </div>
      </div>
    );

    return(
      <div className='box'>
        <Row className='cards'>
    	     {courseCards}
         </Row>
         <div className='pages' >
         <ReactPaginate previousLabel={"previous"}
                     nextLabel={"next"}
                     breakLabel={<a href="">...</a>}
                     breakClassName={"break-me"}
                     pageCount={this.state.maxPage}
                     marginPagesDisplayed={2}
                     pageRangeDisplayed={5}
                     onPageChange={this.handlePageChange}
                     containerClassName={"pagination"}
                     subContainerClassName={"pages pagination"}
                     activeClassName={"active"} />
          </div>
      </div>
    );
  }
}
export default Courses;
