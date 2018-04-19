import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles/SearchPage.css';
import { Row, Grid, Pagination, Button, Collapse, Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import CourseCard from './CourseCard.jsx';
import ReactPaginate from 'react-paginate'
import JobCard from './JobCard.jsx';
import SubjectCard from './SubjectCard.jsx';
import Highlighter from "react-highlight-words";
import { BarLoader } from 'react-spinners'

var subj_filter = 'search_filter'
var course_filter = 'search_filter'
var jobs_filter = 'search_filter'

class SearchPage extends Component{
	constructor(props) {
		super(props);
			var query = props.match.query;
			this.state = {
        ready: true
		};
	}

  render(){
		if (!this.state.ready){
			return (<div><br/><br/><center><BarLoader color={'#123abc'} loading={true} /></center></div>)
		}
      return	(
        <div style={{ 'text-align': 'center' }}>
          <form onSubmit={(e) =>
            {    e.preventDefault();
              window.location.href = '/search/' + this.state.value}}>
              <div>
                <img src='https://i.imgur.com/g16hr23.png' style={{ 'width': 300, 'height': 200, 'marginTop': 100 }}/>
              </div>
              <input style={{ 'width': 480 }} placeholder="" onChange={(event) => {this.setState({value: event.target.value})}}/>
              <div style={{ 'margin': 20 }} >
              <input className="search_button" type="submit" value="Learning2Earn Search" />
              <input className="search_button" type="button" value="I'm Feeling Lucky" />
              </div>
          </form>
        </div>
      );
    }
}
export default SearchPage
