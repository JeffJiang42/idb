import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class SubjectData extends Component{
  constructor(props){
    super(props)
    this.state = {
      courses:[],
      jobs:[],
      info: {  'course-ids':[], 'job-ids':[]}
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
    var sub = this.state.info
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
        <ul className='jobList'> {jobTemp} </ul>
      </div>
    }
    else{
      jobTemp = <p className="card-text"><strong>Related Jobs:</strong> {jobTemp}</p>
    }
    return(
	<div className="container h-100">
	  	<div className="row h-100 justify-content-center align-items-center">
			<div className="card h-100" align = "center">
				<img className="card-img-top" src={sub.image} />
				<div className="card-body">
				<h4 className="card-title">{sub.subject}</h4>
				<p className="card-text"><strong>Provider</strong>: {sub.provider}</p>
				<p className="card-text"><strong># of Courses</strong>: {sub['course-ids'].length}</p>
				<p className="card-text"><strong>Related courses</strong>: coursesr</p>
				{jobTemp}
			  </div>
			</div>
		</div>
	</div>
    );
  }
}

export default SubjectData;
