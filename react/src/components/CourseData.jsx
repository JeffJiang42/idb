import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles/ModelData.css';
import SubjectCard from './SubjectCard';
import JobCard from './JobCard';
import _ from 'lodash'
import { BarLoader } from 'react-spinners'
import ReactPaginate from 'react-paginate'
import TwitterFeed from './TwitterFeed.jsx'

var card_remove_border = {
    'borderStyle': 'none'
};

class CourseData extends Component{
  constructor(props){
    super(props)
    this.state = {
      subject:{},
      jobs:[],
      info: {},
      jobPage: 1,
      pageSize: 6,
      maxPage: 10
    }
    this.getSubject = this.getSubject.bind(this);
    this.getJobs = this.getJobs.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(event){
    this.setState({jobPage: Number(event.selected+1)})
  }

  componentWillMount(){
    var id = this.props.match.params.id
    var courseUrl= 'http://api.learning2earn.me/courses?courseId='+ id
    fetch(courseUrl)
      .then((response) => { return response.json() })
      .then( (courseJson) => {
        var temp = courseJson[0]
        //Udemy links in database are broken, needs small fix
        if (temp.provider === 'Udemy'){
            temp.link = 'https://udemy.com' + temp.link
          }
        this.setState({info: temp}, () => {
          this.getSubject()
          this.getJobs()
        })
      })
  }

  getSubject(){
    //Fetches the subject info for the specific course
    var sid = this.state.info['subject-id']
    var subjectUrl = 'http://api.learning2earn.me/subjects?subjectId=' + sid
    fetch(subjectUrl)
      .then((response) => {return response.json()})
      .then((subjectJson) => {
        return subjectJson[0]
      })
      .then((sub) => {this.setState({subject:sub})})
  }

  getJobs(){
    //Fetches related jobs fo the specific course
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
          this.setState({jobs: temp, maxPage: Math.ceil(temp.length / this.state.pageSize) })
        })
    }
  }


  render(){
    //Loading icon if data isn't here yet

    if (_.isEmpty(this.state.subject)){
      return (<div><br/><br/><center><BarLoader color={'#123abc'} loading={true} /></center></div>)
    }
    var course = this.state.info
    var jobTemp = []
    var finalLength = 0;
    if (this.state.jobs.length == 0){
      jobTemp = <p>No relevant jobs for this course</p>
    }
    else{
      var i = 0
      var lastInd = this.state.jobPage * this.state.pageSize
      var firstInd = lastInd - this.state.pageSize
      var jobArr = this.state.jobs.slice(firstInd,lastInd)
      for (let job of jobArr){
        jobTemp.push(
          <div className='col-sm-4' key={i++}>
            <div className='card' style={card_remove_border}>
              <JobCard jobId={job.id} name={job.name} company={job.company} image={job.image} provider={job.provider} numCourses={job['num-related-courses']} jobType={job.jobtype} location={job.location}/>
            </div>
          </div>
        )
      }
      finalLength = Math.ceil(jobTemp.length / 3) * 400;
    }
    if (jobTemp.constructor === Array){
      jobTemp = <div>
        <p className="card-text"><strong>Related Jobs:</strong></p>
        <ul className='linkList'> {jobTemp} </ul>
      </div>
    }
    else{
      jobTemp = <p className="card-text"><strong>Related Jobs:</strong>{jobTemp}</p>
    }
    if (course.price === 0){
      course.price = "Free"
    }
    var sub = this.state.subject
    return(
      <div className="box">
        <div className="container h-100">
          <div className="row h-100 justify-content-center align-items-center">
            <div className="card h-100" align = "center">
              <img className="card-img-top" src={course.image} />
              <div className="card-body">
                <h4 className="card-title">{course.course}</h4>
                <p className="card-text"><strong>Provider</strong>: {course.provider}</p>
                <p className="card-text"><strong>Price</strong>: {course.price}</p>
                <p className="card-text"><strong>Instructor</strong>: {course.instructor}</p>
                <p className="card-text"><strong>Link</strong>: <a href={course.link}>{course.link}</a></p>
                <p className="card-text"><strong>Description</strong>: {course.desc}</p>
                <p className="card-text"><strong>Course Subject</strong></p>
                <div className='card' style={card_remove_border} >
                  <SubjectCard provider={sub["provider"]} subId={sub["id"]} subName={sub["subject"]} image={sub["image"]} totalCourses={sub['course-ids'].length} totalJobs={sub['job-ids'].length}/>
                </div>
                <div>
                <TwitterFeed provider={course.provider} />
                </div>
                {jobTemp}
                <div style={{'marginTop': finalLength }}>
                  <ReactPaginate previousLabel={"previous"}
                    initialPage={this.state.jobPage-1}
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
            </div>
          </div>
        </div>
      </div>);
  }
}

export default CourseData;
