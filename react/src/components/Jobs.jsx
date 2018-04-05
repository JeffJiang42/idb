import JobCard from './JobCard.jsx';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Collapse} from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import Select from "react-virtualized-select";

var card_remove_border = {
    'borderStyle': 'none'
};

const sortQueries  = ["name", "name&desc=TRUE", "company", "company&desc=TRUE", "provider", "provider&desc=TRUE", "location", "location&desc=TRUE", "num-related-courses", "num-related-courses&desc=TRUE"]

class Jobs extends Component{
  constructor(props){
    super(props)
    this.state = {
      jobList: [],
      page: 1,
      pageSize: 32,
      maxPage: 10,
      sortOpen: false,
      queries: [],
      sortOption: ''
    }
    this.handlePageChange = this.handlePageChange.bind(this)
    this.makeQuery = this.makeQuery.bind(this)
    this.sortChange = this.sortChange.bind(this)
  }

  sortChange(choice){
    this.setState({sortOption: choice})
    //console.log(this.state.queries)
    if(choice != null){
      this.state.queries.sort = ("sort_by=" + sortQueries[choice-1])
      //console.log(this.state.queries)
    }
    else{
      delete this.state.queries.sort
    }
    this.makeQuery()
  }

  makeQuery(){
    var url = 'http://api.learning2earn.me/jobs'
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
        this.setState({jobList: sorted, page: 1, maxPage: Math.ceil(sorted.length / this.state.pageSize)})
      })
  }

  handlePageChange(event){
    this.setState({page: Number(event.selected+1)})
  }

  componentWillMount(){
    const rehydrate = JSON.parse(localStorage.getItem('jobSavedState'))
    this.setState(rehydrate)
    this.setState({sortOption:''})
    const url = 'http://api.learning2earn.me/jobs';
    fetch(url)
      .then((response) => {return response.json()})
      .catch((error) => {console.log(error.message)})
      .then((info) => {this.setState({jobList: info, maxPage: Math.ceil(info.length / this.state.pageSize)})})
      .catch((error) => {console.log(error.message)})
  }

  componentWillUnmount(){
    var toSave = {
      page: this.state.page,
      sortOption: this.state.sortOption
    };
    localStorage.setItem('jobSavedState', JSON.stringify(toSave))
  }

  render(){
    const sortOptions=[{label: "Name (alphabetical)",  value: 1}, {label: "Name (Descending alphabetical)", value: 2},
    {label: "Company (alphabetical)", value: 3}, {label: "Company (Descending alphabetical)", value: 4},
    {label: "Provider (alphabetical)", value: 5}, {label: "Provider (Descending alphabetical)", value: 6},
    {label: "Location (alphabetical)", value: 7}, {label: "Location (Descending alphabetical)", value: 8},
    {label: "Number of courses", value: 9}, {label: "Number of courses (Descending)", value: 10}]
    var {jobList, page, pageSize, maxPage} = this.state
    var lastInd = page * pageSize
    var firstInd = lastInd - pageSize
    var jobArr = jobList.slice(firstInd, lastInd)
    var jCards = jobArr.map((job,i) =>
      <div className='col-sm-3' key={i}>
        <div className='card' style={card_remove_border}>
          <JobCard jobId={job.id} name={job.name} company={job.company} image={job.image} provider={job.provider} numCourses={job['num-related-courses']} jobType={job.jobtype} location={job.location}/>
        </div>
      </div>
    )
    return(
      <div className='box'>
        <div className='Sorting'>
          <h1 onClick={() => this.setState({ sortOpen: !this.state.sortOpen})}>Sorting</h1>
          <br />
          <Collapse in={this.state.sortOpen}>
            <Select options={sortOptions} simpleValue value={this.state.sortOption} placeholder='Sort by' onChange={this.sortChange} />
          </Collapse>
        </div>
        <Row className='cards'>
        {jCards}
        </Row>
        <div className='pages' >
        <ReactPaginate
                    initialPage={this.state.page-1}
                    previousLabel={"previous"}
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
export default Jobs;
