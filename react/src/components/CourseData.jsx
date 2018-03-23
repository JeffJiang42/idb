import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles/ModelData.css';

class CourseData extends Component{
  constructor(props){
    super(props)
    this.state = {
      subject:'',
      jobs:[],
      info: {}
    }
    this.getSubject = this.getSubject.bind(this);
    this.getJobs = this.getJobs.bind(this);
  }

  componentWillMount(){
    var id = this.props.match.params.id
    var courseUrl= 'http://api.learning2earn.me/courses?courseId='+ id
    fetch(courseUrl)
      .then((response) => { return response.json() })
      .then( (courseJson) => {
        var temp = courseJson[0]
        if (temp.provider === 'Udemy'){
            temp.link = 'https://udemy.com' + temp.link
          }
        this.setState({info: temp})
        this.getSubject()
        this.getJobs()
      })
  }

  getSubject(){
    var sid = this.state.info['subject-id']
    var subjectUrl = 'http://api.learning2earn.me/subjects?subjectId=' + sid
    fetch(subjectUrl)
      .then((response) => {return response.json()})
      .then((subjectJson) => {
        return subjectJson[0]
      })
      .then((sub) => {this.setState({subject:sub.subject})})
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
    var course = this.state.info
    var jobTemp = []
    if (this.state.jobs.length == 0){
      jobTemp = <p>No relevant jobs for this course</p>
    }
    else{
      for (let job of this.state.jobs){
        jobTemp.push(
          <li><Link to={`/jobs/${job.id}`}>{job.name}</Link></li>
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
    return(
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
				<p className="card-text"><strong>Related Subjects</strong>: <Link to={`/subjects/${course['subject-id']}`} >{this.state.subject}</Link></p>
				{jobTemp}
			  </div>
			</div>
		</div>
	</div>
    );
  }
}

export default CourseData;
