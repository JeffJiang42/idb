import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TwitterFeed from './TwitterFeed.jsx'
import ReactPaginate from 'react-paginate'
import { BarLoader } from 'react-spinners'
import _ from 'lodash'
import CourseCard from './CourseCard.jsx'
import SubjectCard from './SubjectCard.jsx'

var card_remove_border = {
    'borderStyle': 'none'
};

class JobData extends Component{
  constructor(props){
    super(props)
    this.state = {
      subjects: [],
      courses:[],
      info: {},
      coursePage: 1,
      subjectPage: 1,
      courseMaxPage: 10,
      subjectMaxPage: 10,
      pageSize: 6
    }
    this.getSubject = this.getSubject.bind(this);
    this.getCourses = this.getCourses.bind(this);
    this.handleCoursePageChange = this.handleCoursePageChange.bind(this)
    this.handleSubjectPageChange = this.handleSubjectPageChange.bind(this)
  }

  handleCoursePageChange(event){
    //Page change for paginated course cards
    this.setState({coursePage: Number(event.selected+1)})
  }

  handleSubjectPageChange(event){
    //Page change for paginated subject cards
    this.setState({subjectPage: Number(event.selected+1)})
  }

  getSubject(){
    //Fetched subject info for the given job
    var url = 'http://api.learning2earn.me/subjects?jobId=' + this.props.match.params.id
    fetch(url)
      .then((response) => { return response.json()})
      .then((subJson) => {
        this.setState({subjects: subJson,  subjectMaxPage: Math.ceil(subJson.length / this.state.pageSize)})
      })
  }

  getCourses(){
    //Fetched course info for the given job
    var url = 'http://api.learning2earn.me/courses?jobId=' + this.props.match.params.id
    fetch(url)
      .then((response) => { return response.json()})
      .then((courseJson) => {
        this.setState({courses: courseJson, courseMaxPage: Math.ceil(courseJson.length / this.state.pageSize)})
      })
  }

  componentDidMount(){
    var id = this.props.match.params.id
    var jobUrl= 'http://api.learning2earn.me/jobs?jobId='+ id
    fetch(jobUrl)
      .then((response) => { return response.json() })
      .then( (jobJson) => {
        this.setState({info: jobJson[0]})
        this.getSubject()
        this.getCourses()
      })
  }

  render(){
    //Loading icon if all the data isn't there
    if (_.isEmpty(this.state.subjects)){
      return (<div><br/><br/><center><BarLoader color={'#123abc'} loading={true} /></center></div>)
    }

    if (_.isEmpty(this.state.courses)){
      return (<div><br/><br/><center><BarLoader color={'#123abc'} loading={true} /></center></div>)
    }
    this.getSubject()
    this.getCourses()
    var job = this.state.info
    var variable = job.provider
    var courseTemp = []
    var i = 0
    var lastInd = this.state.coursePage * this.state.pageSize
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
    var courseLength = 400 * Math.ceil(courseTemp.length / 3)
    courseTemp = <div>
      <p className="card-text"><strong>Related Courses:</strong></p>
      <ul className='linkList'> {courseTemp} </ul>
    </div>

    var subTemp = []
    i = 0
    lastInd = this.state.subjectPage * this.state.pageSize
    firstInd = lastInd - this.state.pageSize
    var subArr = this.state.subjects.slice(firstInd, lastInd)
    for (let sub of subArr){
      subTemp.push(
        <div className='col-sm-4' key={i++}>
          <div className='card' style={card_remove_border} >
          <SubjectCard provider={sub["provider"]} subId={sub["id"]} subName={sub["subject"]} image={sub["image"]} totalCourses={sub['course-ids'].length} totalJobs={sub['job-ids'].length}/>
          </div>
      </div>
      )
    }
    var subjectLength = 400 * Math.ceil(subTemp.length / 3)

    subTemp = <div>
      <p className="card-text"><strong>Related Subjects:</strong></p>
      <ul className='linkList'>{subTemp}</ul>
    </div>
    return(
	<div className="container h-100">
    <div className="row h-100 justify-content-center align-items-center">
			<div className="card h-100" align = "center">
				<img className="card-img-top" src={job.image} />
				<div className="card-body">
          <h4 className="card-title">{job.name}</h4>
          <p className="card-text"><strong>Provider</strong>: {job.provider}</p>
          <p className="card-text"><strong>Type</strong>: {job.jobtype}</p>
          <p className="card-text"><strong>Location</strong>: {job.location}</p>
          <p className="card-text"><strong>Link</strong>: <a href={job.link}>{job.link}</a></p>
          <p className="card-text"><strong>Description</strong>:{job.desc}</p>
          <TwitterFeed provider={job.provider} />
          <div>
            {courseTemp}
            <div style={{ 'marginTop': courseLength }}>
              <ReactPaginate previousLabel={"previous"}
                initialPage={this.state.coursePage-1}
                nextLabel={"next"}
                breakLabel={<a>...</a>}
                breakClassName={"break-me"}
                pageCount={this.state.courseMaxPage}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.handleCoursePageChange}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"} />
            </div>
          </div>
          <div style={{ 'marginTop': (courseLength + 100) }}>
            {subTemp}
            <div style={{ 'marginTop': subjectLength }}>
              <ReactPaginate previousLabel={"previous"}
                initialPage={this.state.subjectPage-1}
                nextLabel={"next"}
                breakLabel={<a>...</a>}
                breakClassName={"break-me"}
                pageCount={this.state.subjectMaxPage}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.handleSubjectPageChange}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    );
  }
}

export default JobData;
