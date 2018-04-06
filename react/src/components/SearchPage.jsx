import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles/SearchPage.css';
import { Row, Grid, Pagination, Button, Collapse, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import CourseCard from './CourseCard.jsx';
import ReactPaginate from 'react-paginate'
import JobCard from './JobCard.jsx';
import SubjectCard from './SubjectCard.jsx';
import Highlighter from "react-highlight-words";

var subj_filter = 'search_filter'
var course_filter = 'search_filter'
var jobs_filter = 'search_filter'

class SearchPage extends Component{
	constructor(props) {
		super(props);
			var query = props.match.query;
			this.state = {
			value: "",
			query: '',
      		url:'http://api.learning2earn.me/search',
      		display:0,
      		pageSize: 15,
					coursePage: 1,
					subjectPage: 1,
					jobPage: 1,
					maxPageJobs: 1,
					maxPageSubjects: 1,
					maxPageCourses: 1,
      		jobs: [],
      		courses: [],
      		subjects:[]

		};
		this.getSubject = this.getSubject.bind(this)
		this.handleButtonClick = this.handleButtonClick.bind(this)
		this.highlight = this.highlight.bind(this)
		this.handleCoursePageChange = this.handleCoursePageChange.bind(this)
		this.handleSubjectPageChange = this.handleSubjectPageChange.bind(this)
		this.handleJobPageChange = this.handleJobPageChange.bind(this)
	}

	handleCoursePageChange(event){
		this.setState({coursePage: event.selected+1})
	}

	handleSubjectPageChange(event){
		this.setState({coursePage: event.selected+1})
	}

	handleJobPageChange(event){
		this.setState({jobPage: event.selected+1})
	}

	handleButtonClick(newDisplay){
		this.setState({display: newDisplay });
	}

	componentWillMount(){
		this.setState({query: this.props.match.params.query.toLowerCase()})
		const url = this.state.url + "?q=" + this.props.match.params.query.toLowerCase();
		console.log(url)
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
		console.log(url)

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
  	highlight(words){
  		return <Highlighter searchWords={[this.state.query]} textToHighlight= {words}/>
  	}

  render(){
    var {courses, jobs, subjects, maxPageCourses, maxPageJobs, maxPageSubjects} = this.state;
    var list;
    var results;
    //courses
    if(this.state.display == 0){
        
        subj_filter = 'search_filter'
        jobs_filter = 'search_filter'
        course_filter = 'search_filter search_active'
        
    	var lastInd = this.state.coursePage * this.state.pageSize
	    var firstInd = lastInd - this.state.pageSize
	    var courseArr = courses.slice(firstInd, lastInd);
    	list = courseArr.map((course,i) =>
				<Row key={i}>
		      	<tr>
		      	<Link to={`/courses/${course.id}`}>
	  				<h3> Course: {this.highlight(course['course'])} </h3>
  				</Link>
	  				<p class="search_top"> Provider: {this.highlight(course['provider'])}</p>
	  				<p> Instructor: {this.highlight(course['instructor'])}</p>
	  				<p> Description: {this.highlight(course['desc'])}</p>
				</tr>
		</Row>
	    )
    }
    //subjects
    else if(this.state.display == 1){
        
        course_filter = 'search_filter'
        jobs_filter = 'search_filter'
        subj_filter = 'search_filter search_active'
        
    	var lastInd = this.state.subjectPage * this.state.pageSize
	    var firstInd = lastInd - this.state.pageSize
	    var subjectsArr = subjects.slice(firstInd, lastInd)
    	list = subjectsArr.map((subject,i) =>
				<Row key={i}>
		      	<tr>
    				<Link to={`/subjects/${subject.id}`}>
	  					<h3> Subject: {this.highlight(subject["subject"])} </h3>
					</Link>

	  				<p class="search_top"> Provider: {this.highlight(subject.provider)} </p>
				</tr>
		</Row>
	    )
    }
    //jobs
    else{
        
        course_filter = 'search_filter'
        jobs_filter = 'search_filter search_active'
        subj_filter = 'search_filter'
        
      var lastInd = this.state.jobPage * this.state.pageSize
	    var firstInd = lastInd - this.state.pageSize
	    var jobArr = jobs.slice(firstInd, lastInd)
    	list = jobArr.map((job,i) =>
			<Row key={i}>
		      	<tr>
    				<Link to={`/jobs/${job.id}`}>
	  					<h3>Job: {this.highlight(job.name)} </h3>
					</Link>
	  				<p class="search_top">Provider: {this.highlight(job.provider)} </p>
	  				<p>Type: {this.highlight(job.jobtype)} </p>
	  				<p>Location: {this.highlight(job.location)} </p>
	  				<p>Description: {this.highlight(job.desc)} </p>
				</tr>
			</Row>
	    )
    }
		if (list.length == 0){
			list = <h1>No Search Results :(</h1>
		}
		var courseStyle = ''
		var subjectStyle = ''
		var jobStyle = ''
		if (this.state.display == 0){
			courseStyle = {'dummy': 1}
			subjectStyle = {display: 'none'}
			jobStyle = {display: 'none'}
		}
		if (this.state.display == 1){
			courseStyle = {'display': 'none'}
			subjectStyle = {'dummy': 1}
			jobStyle = {'display': 'none'}
		}
		if (this.state.display == 2){
			courseStyle = {'display': 'none'}
			subjectStyle = {'display': 'none'}
			jobStyle = {'dummy': 1}
		}
		var coursePagination = 		<div style={courseStyle} >
				<ReactPaginate
										initialPage={this.state.coursePage-1}
										previousLabel={"previous"}
										nextLabel={"next"}
										breakLabel={<a>...</a>}
										breakClassName={"break-me"}
										pageCount={this.state.maxPageCourses}
										marginPagesDisplayed={2}
										pageRangeDisplayed={5}
										onPageChange={this.handleCoursePageChange}
										containerClassName={"pagination"}
										subContainerClassName={"pages pagination"}
										activeClassName={"active"} />
				 </div>
		var subjectPagination = 		<div style={subjectStyle} >
				<ReactPaginate
										initialPage={this.state.subjectPage-1}
										previousLabel={"previous"}
										nextLabel={"next"}
										breakLabel={<a>...</a>}
										breakClassName={"break-me"}
										pageCount={this.state.maxPageSubjects}
										marginPagesDisplayed={2}
										pageRangeDisplayed={5}
										onPageChange={this.handlePageChange}
										containerClassName={"pagination"}
										subContainerClassName={"pages pagination"}
										activeClassName={"active"} />
				 </div>
		var jobPagination = 		<div style={jobStyle} >
				<ReactPaginate
										initialPage={this.state.jobPage -1}
										previousLabel={"previous"}
										nextLabel={"next"}
										breakLabel={<a>...</a>}
										breakClassName={"break-me"}
										pageCount={this.state.maxPageJobs}
										marginPagesDisplayed={2}
										pageRangeDisplayed={5}
										onPageChange={this.handleJobPageChange}
										containerClassName={"pagination"}
										subContainerClassName={"pages pagination"}
										activeClassName={"active"} />
				 </div>

	return	(<div>
            <div id="search_bar">
			<form onSubmit={(e) =>
				{    e.preventDefault();
					window.location.href = '/search/' + this.state.value}}>
            <img src="https://i.imgur.com/g16hr23.png" width="80"/>
			<input placeholder="Search" onChange={(event) => {this.setState({value: event.target.value})}}/>            
			</form>
            <div class="search_filters">
            <div class={course_filter} onClick={e => this.handleButtonClick(0)}> Courses </div>
	    	<div class={subj_filter} onClick={e => this.handleButtonClick(1)}> Subjects </div>
	    	<div class={jobs_filter} onClick={e => this.handleButtonClick(2)}> Jobs </div>
            </div>
			</div>
	    
	      	<table>
            <h2 class="search_desc" >Search Results: {results}</h2>
	      		<tbody>
	      			{list}
	      		</tbody>
	      	</table>
					<div>
					{coursePagination}
					{subjectPagination}
					{jobPagination}
					<br />
				</div>
      	</div>
    );
  }
}
export default SearchPage
