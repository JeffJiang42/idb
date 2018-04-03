import './styles/ModelGrid.css';
import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import _ from 'lodash'
import { Row, Grid, Pagination } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import Select from "react-virtualized-select";
import CourseCard from './CourseCard.jsx';

var card_remove_border = {
    'borderStyle': 'none'
};

const options = [{label: 'filter option 1', value: 1}, {label:'filter option 2', value: 2},
{label:'filter option 3', value: 3}]

class Courses extends Component{
  constructor(props){
    super(props);
    this.state = {
      courseList: [],
      page: 1,
      pageSize: 32,
      maxPage: 10,
      selectedOption: [],
    };
    this.handlePageChange = this.handlePageChange.bind(this);
    this.filterChange = this.filterChange.bind(this)
  }

  filterChange(choice){
    this.setState({ selectedOption: choice });
    //console.log(`Selected: ${typeof(choice.split(',')[0])}`);
    var choiceArr = choice.split(',')
    choiceArr = choiceArr.map((a) => {return parseInt(a)})
    console.log(choiceArr)
    if (choiceArr.includes(1)){
      var info = this.state.courseList.filter((course)=>{return course.provider == "Khan Academy"})
      this.setState({courseList: info, maxPage: Math.ceil(info.length / this.state.pageSize)})
    }
  }

  handlePageChange(event){
    console.log(event.selected)
    this.setState({page: Number(event.selected+1)})
  }


  componentWillMount(){
    const rehydrate = JSON.parse(localStorage.getItem('coursesSavedState'))
    this.setState(rehydrate)
    const url = 'http://api.learning2earn.me/courses';

    fetch(url)
      .then((response) => {return response.json()})
      .then((courseJson) =>{
        return courseJson
      })
      .catch((error) => {console.log(error.message); return []})
      .then((info) => {this.setState({courseList: info, maxPage: Math.ceil(info.length / this.state.pageSize)})})

  }

  componentWillUnmount(){
    localStorage.setItem('coursesSavedState', JSON.stringify(this.state))
  }

  render(){
    console.log(this.state.page);
    var {courseList, page, pageSize, maxPage, selectedOption} = this.state
    var lastInd = page * pageSize
    var firstInd = lastInd - pageSize
    var courseArr = courseList.slice(firstInd,lastInd)
    var courseCards = courseArr.map((course, i) =>
      <div className="col-sm-3" key={i} >
      <div className='card' style={card_remove_border}>
        <CourseCard provider={course["provider"]} price={course["price"]} courseId={course["id"]} courseName={course["course"]} image={course["image"]} relJobs={course['job-ids'].length}/>
      </div>
      </div>
    );

    return(
      <div className='box'>
          <div className="col-sm=3">
            <Select closeOnSelect={false} multi  options={options} simpleValue value={selectedOption} onChange={this.filterChange} />
          </div>
        <Row className='cards'>
    	     {courseCards}
         </Row>
         <div className='pages' >
         <ReactPaginate previousLabel={"previous"}
                     initialPage={this.state.page-1}
                     nextLabel={"next"}
                     breakLabel={<a>...</a>}
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
