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

const providersList = ["Khan Academy", "Udemy"]
const priceRanges = ["0..0","0..50", "50..100","100..150","150..200",'200..']
const relJobRanges = ["10..", "20..", "30..", "40..", "50.."]
const sortQueries = ["course", "course&desc=TRUE", "provider", "provider&desc=TRUE", "price", "price&desc=TRUE", "num-relevant-jobs", "num-relevant-jobs&desc=TRUE"]

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
      filterOpen: false,
      sortOpen: false,
      url:'http://api.learning2earn.me/courses',
      sortOption: '',
      queries:{}
    };
    this.handlePageChange = this.handlePageChange.bind(this);
    this.providerChange = this.providerChange.bind(this)
    this.priceChange = this.priceChange.bind(this)
    this.jobChange = this.jobChange.bind(this)
    this.sortChange = this.sortChange.bind(this)
    this.makeQuery = this.makeQuery.bind(this)
    this.saveState = this.saveState.bind(this)
  }

  providerChange(choice){
    this.setState({providerOption: choice})
    var choiceArr = choice.split(',')
    choiceArr = choiceArr.map((a) => {return encodeURI(providersList[parseInt(a)-1])})
    //console.log(choiceArr)
    var str = ''
    if (!(choiceArr.includes(NaN) || choice == '' || choice == null)){
        for (let c in choiceArr){
          str += 'provider=' + choiceArr[c]
          if (c < choiceArr.length -1){
            str += '&'
          }
        }
    }
    var temp = this.state.queries
    temp.providers = str
    this.setState({queries: temp}, this.makeQuery())
  }

  jobChange(choice){
    this.setState({relJobOption: choice})
    var str = ''
    if (choice != null){
      str = 'num-relevant-jobs=' + relJobRanges[choice - 1]
    }
    var temp = this.state.queries
    temp.jobs = str
    this.setState({queries: temp}, this.makeQuery())
  }

  priceChange(choice){
    this.setState({priceOption: choice})
    var str = ''
    if (choice != null){
      str = 'price=' + priceRanges[choice - 1]
    }
    var temp = this.state.queries
    temp.price = str
    this.setState({queries: temp}, this.makeQuery())
  }


  sortChange(choice){
    this.setState({sortOption: choice})
    //console.log(this.state.queries)
    var str = ''
    if(choice != null){
      str = 'sort_by=' + sortQueries[choice - 1]
    }
    var temp = this.state.queries
    temp.sort = str
    this.setState({queries: temp}, this.makeQuery())
  }

  makeQuery(){
    var url = 'http://api.learning2earn.me/courses'
    var first = true
    var queries = this.state.queries
    console.log(queries)
    for (let key in queries){
      if (first){
        url += '?' + queries[key]
        first = false
      }
      else{
        url += '&' + queries[key]
      }
    }
    console.log(url)
    fetch(url)
      .then((response) => {return response.json()})
      .then((json) => {
        var sorted = json
        this.setState({courseList: sorted, page: this.state.page, maxPage: Math.ceil(sorted.length / this.state.pageSize)}, this.saveState())
      })
  }


  handlePageChange(event){
    //console.log(event.selected)
    this.setState({page: Number(event.selected+1)})
  }


  componentWillMount(){
    const rehydrate = JSON.parse(localStorage.getItem('coursesSavedState'))
    console.log(rehydrate)
    //this.setState(rehydrate, () => {var temp = this.state; console.log(temp)})
    this.state = rehydrate
    this.makeQuery()
  }

  componentWillUnmount(){
    this.saveState()
  }

  saveState(){
    console.log('Goodbye!')
    var toSave = this.state
    toSave.courseList = []
    console.log(JSON.stringify(toSave))
    localStorage.setItem('coursesSavedState', JSON.stringify(toSave))
  }

  render(){
    const providerOptions = [{label: 'Khan Academy', value: 1}, {label:'Udemy', value: 2}]
    const priceOptions=[{label:"Free", value: 1},{label:"less than $50", value:2},{label:"between $50 and $100", value:3},
    {label:"between $100 and $150", value:4},{label:"between $150 and $200", value:5}, {label:"greater than $200", value:6}]
    const relJobOptions=[{label:"More than 10", value:1},{label:"More than 20", value:2},{label:"More than 30", value:3},
    {label:"More than 40", value:4},{label:"More than 50", value:5}]
    const sortOptions=[{label: "Name (Alphabetical)", value: 1}, {label: "Name (Descending alphabetical)", value: 2},{label: "Provider (Alphabetical)", value: 3},
    {label:"Provider (Descending alphabetical)", value: 4}, {label: "Price", value: 5}, {label: "Price (Descending)", value: 6},
    {label: "Relevant jobs", value: 7}, {label:"Relevant jobs (Descending)", value: 8}]
    console.log(this.state.page);
    var {courseList, page, pageSize, maxPage, providerOption} = this.state
    var lastInd = page * pageSize
    var firstInd = lastInd - pageSize
    var courseArr = courseList.slice(firstInd,lastInd)

    for (let course of courseArr){
      if (course["price"] === 0){
        course["price"] = "Free"
      }
    }

    var courseCards = courseArr.map((course, i) =>
      <div className="col-sm-3" key={i} >
      <div className='card' style={card_remove_border}>
        <CourseCard provider={course["provider"]} price={course["price"]} courseId={course["id"]} courseName={course["course"]} image={course["image"]} relJobs={course['job-ids'].length}/>
      </div>
      </div>
    );

    return(
      <div className='box'>
        <h1 style={{'fontSize': '96px'}}>Courses</h1>
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
            <div className='Sorting'>
              <h1 onClick={() => this.setState({ sortOpen: !this.state.sortOpen})}>Sorting</h1>
              <Collapse in={this.state.sortOpen}>
                <Select options={sortOptions} simpleValue value={this.state.sortOption} placeholder='Sort by' onChange={this.sortChange} />
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
