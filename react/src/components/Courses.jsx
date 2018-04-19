import './styles/ModelGrid.css';
import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import _ from 'lodash'
import { Row, Grid, Pagination, Button, Collapse } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import Select from "react-virtualized-select";
import CourseCard from './CourseCard.jsx';
import { BarLoader } from 'react-spinners'

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
      queries:{},
      subjectList:[],
      subjectIdList: [],
      subjectOption: '',
      ready: false
    };
    this.handlePageChange = this.handlePageChange.bind(this);
    this.providerChange = this.providerChange.bind(this)
    this.priceChange = this.priceChange.bind(this)
    this.jobChange = this.jobChange.bind(this)
    this.sortChange = this.sortChange.bind(this)
    this.makeQuery = this.makeQuery.bind(this)
    this.saveState = this.saveState.bind(this)
    this.getSubjects = this.getSubjects.bind(this)
    this.getSubjectNames = this.getSubjectNames.bind(this)
    this.subjectChange = this.subjectChange.bind(this)
  }


  getSubjects(){
    var subjectIds = new Set()
    for (let course of this.state.courseList){
      subjectIds.add(course['subject-id'])
    }
    var ids = Array.from(subjectIds)
    this.setState({courseList: this.state.courseList}, this.getSubjectNames(ids))
  }

  getSubjectNames(subjectIds){
    if (subjectIds.length == 0){
      return;
    }
    var url = 'http://api.learning2earn.me/subjects?subjectId=' + subjectIds.pop()
    fetch(url)
      .then((response) => {return response.json()})
      .then((json) => {
        var temp = this.state.subjectList.filter(name => (name != null && name != undefined))
        temp = new Set(temp)
        temp = Array.from(temp)
        temp.push(json[0])
        this.setState({subjectList: temp}, () => {
          this.getSubjectNames(subjectIds)})
      })
  }

  subjectChange(choice){
    this.setState({subjectOption: choice})
    var str = ''
    if (choice != null){
      str = 'subjectId=' + this.state.subjectIdList[choice - 1]
    }
    var temp = this.state.queries
    temp.subject = str
    this.setState({queries: temp}, this.makeQuery())
  }

  providerChange(choice){
    this.setState({providerOption: choice})
    var choiceArr = choice.split(',')
    choiceArr = choiceArr.map((a) => {return encodeURI(providersList[parseInt(a)-1])})
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
        this.setState({courseList: sorted, page: this.state.page, maxPage: Math.ceil(sorted.length / this.state.pageSize), ready: true}, () => {this.setState({courseList: this.state.courseList},this.saveState())})
      })
  }


  handlePageChange(event){
    this.setState({page: Number(event.selected+1)})
    window.scrollTo(0,0)
  }

  componentWillMount(){
    const url = 'http://api.learning2earn.me/courses';
    fetch(url)
      .then((response) => {return response.json()})
      .catch((error) => {console.log(error.message)})
      .then((info) => {this.setState({courseList: info, maxPage: Math.ceil(info.length / this.state.pageSize)},
        () => {
          this.getSubjects()
          this.resetState()
        })})
      .catch((error) => {console.log(error.message)})
  }

  resetState(){
    const rehydrate = JSON.parse(localStorage.getItem('coursesSavedState'))
    if (rehydrate != null){
      this.state = rehydrate
    }
    this.setState(rehydrate)
    this.makeQuery()
  }

  componentWillUnmount(){
    this.saveState()
  }

  saveState(){
    var toSave = this.state
    toSave.courseList = []
    localStorage.setItem('coursesSavedState', JSON.stringify(toSave))
  }

  render(){
    if (!this.state.ready){
      return (<div><br/><br/><center><BarLoader color={'#123abc'} loading={true} /></center></div>)
    }

    if(this.state.subjectList == undefined || this.state.subjectList.length < 140){
      return (<div><br/><br/><center><BarLoader color={'#123abc'} loading={true} /></center></div>)
    }

    const providerOptions = [{label: 'Khan Academy', value: 1}, {label:'Udemy', value: 2}]
    const priceOptions=[{label:"Free", value: 1},{label:"less than $50", value:2},{label:"between $50 and $100", value:3},
    {label:"between $100 and $150", value:4},{label:"between $150 and $200", value:5}, {label:"greater than $200", value:6}]
    const relJobOptions=[{label:"More than 10", value:1},{label:"More than 20", value:2},{label:"More than 30", value:3},
    {label:"More than 40", value:4},{label:"More than 50", value:5}]
    const sortOptions=[{label: "Name (Alphabetical)", value: 1}, {label: "Name (Descending alphabetical)", value: 2},{label: "Provider (Alphabetical)", value: 3},
    {label:"Provider (Descending alphabetical)", value: 4}, {label: "Price", value: 5}, {label: "Price (Descending)", value: 6},
    {label: "Relevant jobs", value: 7}, {label:"Relevant jobs (Descending)", value: 8}]
    var subjectOptions = []
    var subjectIds = []
    var i = 1
    for (let sub of this.state.subjectList){
      if(subjectIds.includes(sub.id)){
        continue
      }
      subjectOptions.push({label: sub.subject, value: i++})
      subjectIds.push(sub.id)
    }
    this.state.subjectIdList = subjectIds;
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
                  <Select options={subjectOptions} simpleValue value={this.state.subjectOption} placeholder='Subject' onChange={this.subjectChange} />
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
                     initialPage={this.state.page - 1}
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
