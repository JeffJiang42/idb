import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BarLoader } from 'react-spinners'
import _ from 'lodash'
import JobCard from './JobCard.jsx'
import CourseCard from './CourseCard.jsx'

var card_remove_border = {
    'borderStyle': 'none'
};

class SubjectData extends Component{
  constructor(props){
    super(props)
    this.state = {
      courses:[],
      jobs:[],
      info: {  'course-ids':[], 'job-ids':[] },
      coursePage: 1,
      jobPage: 1,
      pageSize: 6,
      maxPage: 10
    }
    this.getCourses = this.getCourses.bind(this);
    this.getJobs = this.getJobs.bind(this);
  }

  componentWillMount(){
    var id = this.props.match.params.id
    var sUrl= 'http://api.learning2earn.me/subjects?subjectId='+ id
    fetch(sUrl)
      .then((response) => { return response.json() })
      .then( (sJson) => {
        this.setState({info: sJson[0]})
        this.getCourses()
        this.getJobs()
      })
  }

  getCourses(){
    var cids = this.state.info['course-ids']
    var courseUrls = []
    for (let cid of cids){
      courseUrls.push('http://api.learning2earn.me/courses?courseId=' + cid)
    }
    for (let url of courseUrls){
      fetch(url)
        .then((response) => {return response.json()})
        .then((courseJson) => {
          var temp = this.state.courses
          temp.push(courseJson[0])
          this.setState({courses: temp})
        })
    }
  }

  getJobs(){
    var jids = this.state.info['job-ids']
    if (jids.length == 0){
      return;
    }
    var jobUrls = []
    for (let jid of jids){
      jobUrls.push('http://api.learning2earn.me/jobs?jobId=' + jid)
    }
    for (let url of jobUrls){
      fetch(url)
        .then((response) => {return response.json()})
        .then((jobJson) => {
          var temp = this.state.jobs
          temp.push(jobJson[0])
          this.setState({jobs: temp})
        })
    }
  }

  render(){
    if (_.isEmpty(this.state.jobs)){
      return (<div><br/><br/><center><BarLoader color={'#123abc'} loading={true} /></center></div>)
    }

    if (_.isEmpty(this.state.courses)){
      return (<div><br/><br/><center><BarLoader color={'#123abc'} loading={true} /></center></div>)
    }

    var sub = this.state.info
    var jobTemp = []
    if (this.state.jobs.length == 0){
      jobTemp = <p>No relevant jobs for this course</p>
    }
    else{
      var i = 0
      var lastInd = this.state.jobPage * this.state.pageSize
      var firstInd = lastInd - this.state.pageSize
      var jobArr = this.state.jobs.slice(firstInd, lastInd)
      for (let job of jobArr){
        jobTemp.push(
          <div className='col-sm-4' key={i++}>
            <div className='card' style={card_remove_border}>
              <JobCard jobId={job.id} name={job.name} company={job.company} image={job.image} provider={job.provider} numCourses={job['num-related-courses']} jobType={job.jobtype} location={job.location}/>
            </div>
          </div>
        )
      }
    }
    if (jobTemp.constructor === Array){
      jobTemp = <div>
        <p className="card-text"><strong>Related Jobs:</strong></p>
        <ul className='linkList'> {jobTemp} </ul>
      </div>
    }
    else{
      jobTemp = <p className="card-text"><strong>Related Jobs:</strong> {jobTemp}</p>
    }
    var courseTemp = []
    var i = 0
    var lastInd = this.state.jobPage * this.state.pageSize
    var firstInd = lastInd - this.state.pageSize
    var courseArr = this.state.courses.slice(firstInd, lastInd)
    for (let course of courseArr){
      courseTemp.push(
        <div className="col-sm-4" key={i++} >
        <div className='card' style={card_remove_border}>
          <CourseCard provider={course["provider"]} price={course["price"]} courseId={course["id"]} courseName={course["course"]} image={course["image"]} relJobs={course['job-ids'].length}/>
        </div>
        </div>
      )
    }
    courseTemp = <div>
      <p className="card-text"><strong>Related Courses:</strong></p>
      <ul className='linkList'>{courseTemp}</ul>
    </div>
    return(
	<div className="container h-100">
	  	<div className="row h-100 justify-content-center align-items-center">
			<div className="card h-100" align = "center">
				<img className="card-img-top" src={sub.image} />
				<div className="card-body">
				<h4 className="card-title">{sub.subject}</h4>
				<p className="card-text"><strong>Provider</strong>: {sub.provider}</p>
				{courseTemp}
				{jobTemp}
			  </div>
			</div>
		</div>
	</div>
    );
  }
}

export default SubjectData;
