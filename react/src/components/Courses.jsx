import './styles/ModelGrid.css';
import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import _ from 'lodash'
import { Row, Grid, Pagination, Button, Collapse } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import Select from "react-virtualized-select";
import CourseCard from './CourseCard.jsx';

var card_remove_border = {
    'borderStyle': 'none'
};

const providers = ["Khan Academy", "Udemy"]
const priceRanges = ["0..0","0..50", "50..100","100..150","150..200",'200..']
const relJobRanges = ["10..", "20..", "30..", "40..", "50.."]

class Courses extends Component{
  constructor(props){
    super(props);
    this.state = {
      courseList: [],
      page: 1,
      pageSize: 32,
      maxPage: 10,
      providerOption: '',
      priceOption: '',
      relJobOption:'',
      filterOpen: false
    };
    this.handlePageChange = this.handlePageChange.bind(this);
    this.providerChange = this.providerChange.bind(this)
    this.priceChange = this.priceChange.bind(this)
    this.jobChange = this.jobChange.bind(this)
  }

  providerChange(choice){
    this.setState({ providerOption: choice });
    var choiceArr = choice.split(',')
    choiceArr = choiceArr.map((a) => {return parseInt(a)})
    var priceFilter = this.state.priceOption
    var jobFilter = this.state.relJobOption
    console.log(choice)
    if (choiceArr.includes(NaN) || choice == '' || choice == null){
      var url = 'http://127.0.0.1:5000/courses'
      if (priceFilter != ''){
        url += '?price=' + priceRanges[parseInt(priceFilter)-1]
      }
      if (jobFilter != ''){
        console.log("nonempty jobFilter")
        if(priceFilter != ''){
          url += '&num-relevant-jobs=' + relJobRanges[parseInt(jobFilter)-1]
        }
        else{
          url += '?num-relevant-jobs=' + relJobRanges[parseInt(jobFilter)-1]
        }
      }
      console.log("url = " + url)
      fetch(url)
        .then((response) => {return response.json()})
        .then((courseJson) =>{
          return courseJson
        })
        .catch((error) => {console.log(error.message); return []})
        .then((info) => {this.setState({courseList: info, page: 1, maxPage: Math.ceil(info.length / this.state.pageSize)})})
    }
    else {
      this.setState({courseList:[]})
      for (let i of choiceArr){
        var provider = providers[i-1];
        var url = 'http://127.0.0.1:5000/courses?provider=' + encodeURI(provider)
        if (priceFilter != ''){
          url += '&price=' + priceRanges[parseInt(priceFilter)-1]
        }
        if (jobFilter != ''){
          url += '&num-relevant-jobs=' + relJobRanges[parseInt(jobFilter)-1]
        }
        console.log(url)
        fetch(url)
          .then((response) => {return response.json()})
          .then((courseJson) => {
            var filtered = courseJson;
            if (filtered.length > 0){
              this.setState({courseList: this.state.courseList.concat(filtered), page: 1, maxPage: Math.ceil(this.state.courseList.concat(filtered).length / this.state.pageSize)})
            }
          })
      }
    }
  }

  priceChange(choice){
    if(choice == null){
      choice = ''
    }
    this.state.priceOption = choice
    this.providerChange(this.state.providerOption);
  }

  jobChange(choice){
    if(choice == null){
      choice = ''
    }
    this.state.relJobOption = choice
    this.providerChange(this.state.providerOption);
    //console.log(choice)
  }

  handlePageChange(event){
    //console.log(event.selected)
    this.setState({page: Number(event.selected+1)})
  }


  componentWillMount(){
    const rehydrate = JSON.parse(localStorage.getItem('coursesSavedState'))
    this.setState(rehydrate)
    this.setState({providerOption:'', priceOption:'', relJobOption:''})
    const url = 'http://127.0.0.1:5000/courses';

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
    const providerOptions = [{label: 'Khan Academy', value: 1}, {label:'Udemy', value: 2}]
    const priceOptions=[{label:"Free", value: 1},{label:"less than $50", value:2},{label:"between $50 and $100", value:3},
    {label:"between $100 and $150", value:4},{label:"between $150 and $200", value:5}, {label:"greater than $200", value:6}]
    const relJobOptions=[{label:"More than 10", value:1},{label:"More than 20", value:2},{label:"More than 30", value:3},
    {label:"More than 40", value:4},{label:"More than 50", value:5}]
    //console.log(this.state.page);
    var {courseList, page, pageSize, maxPage, providerOption} = this.state
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
            <div className='Filters'>
              <h1 onClick={() => this.setState({ filterOpen: !this.state.filterOpen })}>Filters</h1>
              <Collapse in={this.state.filterOpen}>
                <div style={{width:"100%"}}>
                  <Select multi  options={providerOptions} simpleValue value={providerOption} placeholder="Provider" onChange={this.providerChange} />
                  <Select options={priceOptions} simpleValue value={this.state.priceOption} placeholder="Price" onChange={this.priceChange}/>
                  <Select options={relJobOptions} simpleValue value={this.state.relJobOption} placeholder="Number of Relevant Jobs" onChange={this.jobChange}/>
                </div>
              </Collapse>
            </div>
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
