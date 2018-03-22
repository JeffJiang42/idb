import React, { Component } from 'react';
import { Link } from 'react-router-dom';



class JobData extends Component{
  constructor(props){
    super(props)
    this.state = {
      subjects: [],
      courses:[],
      info: {}
    }
    this.getSubject = this.getSubject.bind(this);
    this.getCourses = this.getCourses.bind(this);
  }

  getSubject(){
    var sids = this.state.info['subject-ids']
    if(sids !== undefined){
    var surls = []
    for (let sid of sids){
      surls.push('http://api.learning2earn.me/subjects?subjectId=' + sid)
    }
    for(let url of surls){
      fetch(url)
        .then((response) => {return response.json()})
        .then((subJson) => {
          var temp = this.state.subjects
          temp.push(subJson[0])
          this.setState({subjects: temp})
        })
    }
    }
  }

  getCourses(){
    var cids = this.state.info['course-ids']
    if(cids !== undefined){
      var curls = []
      for (let cid of cids){
        curls.push('http://api.learning2earn.me/subjects?subjectId=' + cid)
      }
      for (let url of curls){
        fetch(url)
          .then((response) => {return response.json()})
          .then((cJson) => {
            var temp = this.state.courses
            temp.push(cJson[0])
            this.setState({courses:temp})
          })
      }
    }
  }

  componentDidMount(){
    var id = this.props.match.params.id
    var jobUrl= 'http://api.learning2earn.me/jobs?jobId='+ id
    fetch(jobUrl)
      .then((response) => { return response.json() })
      .then( (jobJson) => {
        this.setState({info: jobJson[0]})
        this.getSubject()
        //this.getCourses()
      })
  }

  render(){
    this.getSubject()
    this.getCourses()
    var job = this.state.info
    var courseTemp = []
    console.log(this.state.courses.length)
    /*
    for (let course of this.state.courses){
      courseTemp.push(
        <li><Link to={`/courses/${course.id}`}></Link>{course.name}</li>
      )
    }
    courseTemp = <div>
      <p className="card-text"><strong>Related Courses:</strong></p>
      <ul className='linkList'> {courseTemp} </ul>
    </div>
    */
    return(
	<div className="container h-100">
	  	<div className="row h-100 justify-content-center align-items-center">
			<div className="card h-100" align = "center">
				<img className="card-img-top" src={job.image} />
				<div className="card-body">
				<h4 className="card-title">{job.name}</h4>
				<p className="card-text"><strong>Provider</strong>: insert provider</p>
				<p className="card-text"><strong>Link</strong>: <a href={job.link}>{job.link}</a></p>
				<p className="card-text"><strong>Description</strong>:{job.desc}</p>
				<p className="card-text"><strong>related subjects</strong>: subjects</p>
				{courseTemp}
			  </div>
			</div>
		</div>
	</div>
    );
  }
}

export default JobData;
