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

const sortQueries = ["provider", "provider&desc=TRUE", "num-courses", "num-courses&desc=TRUE"]

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
      url:'http://api.learning2earn.me/subjects'
    };
    this.handlePageChange = this.handlePageChange.bind(this);
    this.sortChange = this.sortChange.bind(this)
  }

  sortChange(choice){
    this.setState({sortOption: choice})
    var url = ''
    if (choice != null){
      //TODO make this work with filtering (using & instead of ?) when it's there
      url = this.state.url + '?sort_by=' + sortQueries[choice - 1]
      fetch(url)
        .then((response) => {return response.json()})
        .then((json) => {
          var sorted = json
          this.setState({subjectList: sorted, page: 1, maxPage: Math.ceil(sorted.length / this.state.pageSize)})
        })
    }
    else{
      url = this.state.url
      fetch(url)
        .then((response) => {return response.json()})
        .then((json) => {
          var sorted = json
          this.setState({subjectList: sorted, page: 1, maxPage: Math.ceil(sorted.length / this.state.pageSize)})
        })
      }
  }

  handlePageChange(event){
    this.setState({page: Number(event.selected+1)})
  }


  componentWillMount(){
    const rehydrate = JSON.parse(localStorage.getItem('subjectSavedState'))
    this.setState(rehydrate)
    const url = 'http://api.learning2earn.me/subjects';

    fetch(url)
      .then((response) => {return response.json()})
      .then((courseJson) =>{
        return courseJson
      })
      .catch(() => {return []})
      .then((info) => {this.setState({subjectList: info, maxPage: Math.ceil(info.length / this.state.pageSize)})})

  }

  componentWillUnmount(){
    localStorage.setItem('subjectSavedState', JSON.stringify(this.state))
  }

  render(){
      const filterOptions=[{label:"Provider", value: 1}]
      const sortOptions=[{label: "Provider (Alphabetical)", value: 1}, {label:"Provider (Descending alphabetical)", value: 2},
      {label: "Number of courses", value: 3}, {label:"Number of courses (Descending)", value: 4}]
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
        <div className='Filters'>
          <h1 onClick={() => this.setState({filterOpen: !this.state.filterOpen})}>Filters</h1>
          <Collapse in={this.state.filterOpen}>
            <Select options={filterOptions} />
          </Collapse>
        </div>
        <div className='Sorting'>
          <h1 onClick={() => this.setState({ sortOpen: !this.state.sortOpen})}>Sorting</h1>
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
