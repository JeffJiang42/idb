import JobCard from './JobCard.jsx';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row } from 'react-bootstrap'




class Jobs extends Component{
  constructor(props){
    super(props)
    this.state = {
      jobList: [],
      page: 1,
      pageSize: 30,
      maxPage: 10
    }
    this.handlePageChange = this.handlePageChange.bind(this)
  }

  handlePageChange(event){
    this.setState({page: Number(event.selected+1)})
  }

  componentDidMount(){
    const url = 'http://api.learning2earn.me/jobs';
    fetch(url)
      .then((response) => {return response.json()})
      .catch((error) => {console.log(error.message)})
      .then((info) => {this.setState({jobList: info, maxPage: Math.ceil(info.length / this.state.pageSize)})})
  }

  render(){
    var {jobList, page, pageSize, maxPage} = this.state
    var lastInd = page * pageSize
    var firstInd = lastInd - pageSize
    var jobArr = jobList.slice(firstInd, lastInd)
    var jCards = jobArr.map((job,i) => 
      <div className='col-sm-4' key={i}>
        <div className='card'>
          <JobCard jobId={job.id} name={job.name} company={job.company} image={job.image} provider={job.provider} />
        </div>
      </div>
    )
    console.log(jCards.length)
    console.log(jobList.length)
    return(
      <div className='box'>
        {jCards}
      </div>
    );
  }
}
export default Jobs;
