import JobCard from './JobCard.jsx';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'

var card_remove_border = {
    'borderStyle': 'none'
};

class Jobs extends Component{
  constructor(props){
    super(props)
    this.state = {
      jobList: [],
      page: 1,
      pageSize: 32,
      maxPage: 10
    }
    this.handlePageChange = this.handlePageChange.bind(this)
  }

  handlePageChange(event){
    this.setState({page: Number(event.selected+1)})
  }

  componentWillMount(){
    const rehydrate = JSON.parse(localStorage.getItem('jobSavedState'))
    this.setState(rehydrate)
    const url = 'http://api.learning2earn.me/jobs';
    fetch(url)
      .then((response) => {return response.json()})
      .catch((error) => {console.log(error.message)})
      .then((info) => {this.setState({jobList: info, maxPage: Math.ceil(info.length / this.state.pageSize)})})
      .catch((error) => {console.log(error.message)})
  }

  componentWillUnmount(){
    localStorage.setItem('jobSavedState', JSON.stringify(this.state))
  }

  render(){
    var {jobList, page, pageSize, maxPage} = this.state
    var lastInd = page * pageSize
    var firstInd = lastInd - pageSize
    var jobArr = jobList.slice(firstInd, lastInd)
    var jCards = jobArr.map((job,i) =>
      <div className='col-sm-3' key={i}>
        <div className='card' style={card_remove_border}>
          <JobCard jobId={job.id} name={job.name} company={job.company} image={job.image} provider={job.provider} numCourses={job['course-ids'].length} jobType={job.jobtype} location={job.location}/>
        </div>
      </div>
    )
    return(
      <div className='box'>
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
