import SubjectCard from './SubjectCard.jsx';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash'
import { Row, Grid, Pagination, Collapse } from 'react-bootstrap'
import Select from "react-virtualized-select";
import ReactPaginate from 'react-paginate'

var card_remove_border = {
    'borderStyle': 'none'
};

const providerList = ["Khan Academy", "Udemy"]
const sortQueries = ["subject", "subject&desc=TRUE", "provider", "provider&desc=TRUE", "num-courses", "num-courses&desc=TRUE"]
const numCourseList = ["0..20", "20..40", "40..60", "60..80", "80..100", "100.."]

class Subjects extends Component{
  constructor(props){
    super(props);
    this.state = {
      subjectList: [],
      page: 1,
      pageSize: 32,
      maxPage: 4,
      sortOpen: false,
      filterOpen: false,
      providerOption: '',
      sortOption: '',
      numCourseOption:'',
      queries: {},
      url:'http://api.learning2earn.me/subjects'
    };
    this.handlePageChange = this.handlePageChange.bind(this);
    this.sortChange = this.sortChange.bind(this)
    this.makeQuery = this.makeQuery.bind(this)
    this.providerChange = this.providerChange.bind(this)
    this.numCourseChange = this.numCourseChange.bind(this)
    this.saveState = this.saveState.bind(this)
  }

  providerChange(choice){
    this.setState({providerOption: choice})
    var choiceArr = choice.split(',')
    choiceArr = choiceArr.map((a) => {return encodeURI(providerList[parseInt(a)-1])})
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

  numCourseChange(choice){
    this.setState({numCourseOption: choice})
    var str = ''
    if (choice != null){
      str = 'num-courses=' + numCourseList[choice - 1]
    }
    var temp = this.state.queries
    temp.numCourse = str
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
    var url = 'http://api.learning2earn.me/subjects'
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
        this.setState({subjectList: sorted, page: this.state.page, maxPage: Math.ceil(sorted.length / this.state.pageSize)}, this.saveState())
      })
  }

  handlePageChange(event){
    this.setState({page: Number(event.selected+1)})
    window.scrollTo(0,0)
  }


  componentWillMount(){
    const rehydrate = JSON.parse(localStorage.getItem('subjectSavedState'))
    if(rehydrate != null){
      this.state = rehydrate
    }
    this.makeQuery()
  }

  componentWillUnmount(){
    this.saveState()
  }

  saveState(){
    console.log('Goodbye!')
    var toSave = this.state
    toSave.subjectList = []
    /*
    toSave.filterOpen = false
    toSave.sortOpen = false
    */
    localStorage.setItem('subjectSavedState', JSON.stringify(toSave))
  }

  render(){
      const providerOptions=[{label:"Khan Academy", value: 1}, {label: "Udemy", value: 2}]
      const numCourseOptions=[{label:"less than 20", value: 1}, {label:"between 20 and 40", value: 2},{label:"between 40 and 60", value: 3},
      {label:"between 60 and 80", value: 4}, {label: "between 80 and 100", value: 5}, {label:"greater than 100", value: 6}]
      const sortOptions=[{label: "Name (Alphabetical)", value: 1}, {label: "Name (Descending alphabetical)", value:2},
      {label: "Provider (Alphabetical)", value: 3}, {label:"Provider (Descending alphabetical)", value: 4},
      {label: "Number of courses", value: 5}, {label:"Number of courses (Descending)", value: 6}]
      //console.log(this.state.page);
      var {subjectList, page, pageSize, maxPage} = this.state
      var lastInd = page * pageSize
      var firstInd = lastInd - pageSize
      var subjectArr = subjectList.slice(firstInd,lastInd)
      var subjectCards = subjectArr.map((sub,i) =>
        <div className='col-sm-3' key={i}>
          <div className='card' style={card_remove_border} >
          <SubjectCard provider={sub["provider"]} subId={sub["id"]} subName={sub["subject"]} image={sub["image"]} totalCourses={sub['course-ids'].length} totalJobs={sub['job-ids'].length}/>
          </div>
      </div>
      );

      return(
        <div className='box'>
        <h1 style={{'fontSize': '96px'}}>Subjects</h1>
        <div className='Filters'>
          <h1 onClick={() => this.setState({filterOpen: !this.state.filterOpen})}>Filters</h1>
          <br />
          <Collapse in={this.state.filterOpen}>
            <div>
            <Select multi options={providerOptions} simpleValue value={this.state.providerOption} placeholder='Provider' onChange={this.providerChange} />
            <Select options={numCourseOptions} simpleValue value={this.state.numCourseOption} placeholder='Number of courses' onChange={this.numCourseChange} />
            </div>
          </Collapse>
        </div>
        <br />
        <div className='Sorting'>
          <h1 onClick={() => this.setState({ sortOpen: !this.state.sortOpen})}>Sorting</h1>
          <br />
          <Collapse in={this.state.sortOpen}>
            <Select options={sortOptions} simpleValue value={this.state.sortOption} placeholder='Sort by' onChange={this.sortChange} />
          </Collapse>
        </div>
        <Row className='cards'>
      	{subjectCards}
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

export default Subjects;
