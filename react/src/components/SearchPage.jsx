import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles/SearchPage.css';
import { Row, Grid, Pagination, Button, Collapse, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import CourseCard from './CourseCard.jsx';
import ReactPaginate from 'react-paginate'
import JobCard from './JobCard.jsx';
import SubjectCard from './SubjectCard.jsx';



class SearchPage extends Component{
	constructor(props) {
		super(props);
			var query = props.match.query;
			this.state = {
			value: "",
			query: '',
      		url:'http://api.learning2earn.me/search',
      		display:'0',
      		pageSize: 32,
      		page:'1',
      		jobs: [],
      		courses: [],
      		subjects:[]

		};
		this.getSubject = this.getSubject.bind(this)
		this.handleButtonClick = this.handleButtonClick.bind(this)
	}

	handleButtonClick(newDisplay){
		this.setState({display: newDisplay});
	}
	componentWillMount(){
		console.log(this.props.match.params.query)
		if (this.props.match.params.query == undefined){
			return
		}
		this.setState({query: this.props.match.params.query.toLowerCase()})
		const url = this.state.url + "?q=" + this.props.match.params.query.toLowerCase();

	    fetch(url)
	      .then((response) => {return response.json()})
	      .then((searchJson) =>{
	        return searchJson
	      })
	      .catch((error) => {console.log(error.message); return []})
	      .then((info) => {this.setState({courses: info.courses, jobs: info.jobs, subjects: info.subjects, maxPageCourses: Math.ceil(info.courses.length / this.state.pageSize), maxPageJobs: Math.ceil(info.jobs.length / this.state.pageSize), maxPageSubjects: Math.ceil(info.subjects.length / this.state.pageSize)})})

	}

	componentWillReceiveProps(nextProps) {
	    if(JSON.stringify(this.props.match.query) !== JSON.stringify(nextProps.match.params.query)) // Check if it's a new user, you can also use some unique, like the ID
		    {
	           this.setState({query: nextProps.match.params.query});
		    }
		const url = this.state.url + "?q=" + nextProps.match.params.query.toLowerCase();

	    fetch(url)
	      .then((response) => {return response.json()})
	      .then((searchJson) =>{
	        return searchJson
	      })
	      .catch((error) => {console.log(error.message); return []})
	      .then((info) => {this.setState({courses: info.courses, jobs: info.jobs, subjects: info.subjects, maxPageCourses: Math.ceil(info.courses.length / this.state.pageSize), maxPageJobs: Math.ceil(info.jobs.length / this.state.pageSize), maxPageSubjects: Math.ceil(info.subjects.length / this.state.pageSize)})})

	}
	getSubject(subjectID){
		var subName = async() => {await fetch('http://api.learning2earn.me/subjects?subjectId=' + subjectID)
		.then((response) => {return response.json()})
	      .then((subjectJson) => {
	        return subjectJson[0]
	      })
	      .then((sub) => {return sub})
	      }
	      return subName;
	}

  render(){

    var {courses, jobs, subjects, maxPageCourses, maxPageJobs, maxPageSubjects} = this.state;
    var list;
    var results;
    //courses
    if(this.state.display == 0){
    	var lastInd = this.state.page * this.state.pageSize
	    var firstInd = lastInd - this.state.pageSize
	    var courseArr = courses.slice(firstInd, lastInd);
    	list = courseArr.map((course,i) =>
				<Row key={i}>
    		<Link to={`/courses/${course.id}`}>
		      	<tr>
	  				<h3> Course: {course['course']} </h3>
	  				<p> Provider: {course['provider']}</p>
	  				<p> Instructor: {course['instructor']}</p>
	  				<p> Description: {course['desc']}</p>
	  				<p> Related Subjects: {this.getSubject(course['subject-id']) }  </p>
				</tr>
			</Link>
		</Row>
	    )
    }
    //subjects
    else if(this.state.display == 1){
    	var lastInd = this.state.page * this.state.pageSize
	    var firstInd = lastInd - this.state.pageSize
	    var subjectsArr = subjects.slice(firstInd, lastInd)
    	list = subjectsArr.map((subject,i) =>
				<Row key={i}>
    		<Link to={`/subjects/${subject.id}`}>
		      	<tr>
	  				<h3> Subject: {subject["subject"]} </h3>
	  				<p> Provider: {subject.provider} </p>
				</tr>
			</Link>
		</Row>
	    )
    }
    //jobs
    else{
        var lastInd = this.state.page * this.state.pageSize
	    var firstInd = lastInd - this.state.pageSize
	    var jobArr = jobs.slice(firstInd, lastInd)
    	list = jobArr.map((job,i) =>
			<Row key={i}>
    		<Link to={`/jobs/${job.id}`}>
		      	<tr>
	  				<h3>Job: {job.name} </h3>
	  				<p>Provider: {job.provider} </p>
	  				<p>Type: {job.jobtype} </p>
	  				<p>Location: {job.location} </p>
	  				<p>Description: {job.desc} </p>
				</tr>
			</Link>
			</Row>
	    )
    }
		if (list.length == 0){
			list = <h1>No Search Results :(</h1>
		}
    return(
		<div>
			<form onSubmit={(e) =>
				{    e.preventDefault();
					window.location.href = '/search/' + this.state.value}}>
			<input placeholder="Search" onChange={(event) => {this.setState({value: event.target.value})}}/>
			</form>
			<br />
			<br />
	    	<button onClick={e => this.handleButtonClick(0)}> Courses </button>
	    	<button onClick={e => this.handleButtonClick(1)}> Subjects </button>
	    	<button onClick={e => this.handleButtonClick(2)}> Jobs </button>
	      	<h2>Search Results: {results}</h2>
	      	<table>
	      		<tbody>
	      			{list}
	      		</tbody>
	      	</table>
      	</div>
    );
  }
}
export default SearchPage
