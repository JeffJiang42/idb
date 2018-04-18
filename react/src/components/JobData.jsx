import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TwitterFeed from './TwitterFeed.jsx'
import ReactPaginate from 'react-paginate'

class JobData extends Component{
  constructor(props){
    super(props)
    this.state = {
      subjects: [],
      courses:[],
      info: {},
      prov: ''
    }
    this.getSubject = this.getSubject.bind(this);
    this.getCourses = this.getCourses.bind(this);
  }

  getSubject(){
    var url = 'http://api.learning2earn.me/subjects?jobId=' + this.props.match.params.id
    fetch(url)
      .then((response) => { return response.json()})
      .then((subJson) => {
        this.setState({subjects: subJson})
      })
  }

  getCourses(){
    var url = 'http://api.learning2earn.me/courses?jobId=' + this.props.match.params.id
    fetch(url)
      .then((response) => { return response.json()})
      .then((courseJson) => {
        this.setState({courses: courseJson})
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
    this.getSubject()
    this.getCourses()
    var job = this.state.info
    var variable = job.provider
    //console.log(typeof(variable) + ' this is provider')
    var courseTemp = []
    for (let course of this.state.courses){
      courseTemp.push(
        <li><Link to={`/courses/${course.id}`}>{course.course}</Link></li>
      )
    }
    courseTemp = <div>
      <p className="card-text"><strong>Related Courses:</strong></p>
      <ul className='linkList'> {courseTemp} </ul>
    </div>

    var subTemp = []
    for (let sub of this.state.subjects){
      subTemp.push(
        <li><Link to={`/subjects/${sub.id}`}>{sub.subject}</Link></li>
      )
    }

    subTemp = <div>
      <p className="card-text"><strong>Related Subjects:</strong></p>
      <ul className='linkList'>{subTemp}</ul>
    </div>
    //console.log(job.provider)
    if (job.provider == 'GitHub Jobs'){
      this.state.prov = 'githubjobs'
    }
    if (job.provider == 'Authentic Jobs'){
      this.state.prov = 'authenticjobs'
    }
    //console.log(this.state.prov)
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
				{courseTemp}
        {subTemp}
			  </div>
			</div>
		</div>
	</div>
    );
  }
}

export default JobData;
