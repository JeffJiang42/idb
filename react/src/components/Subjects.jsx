import SubjectCard from './SubjectCard.jsx';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash'
import { Row, Grid, Pagination } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'

var card_remove_border = {
    'borderStyle': 'none'
};

class Subjects extends Component{
  constructor(props){
    super(props);
    this.state = {
      subjectList: [],
      page: 1,
      pageSize: 32,
      maxPage: 4
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(event){
    this.setState({page: Number(event.selected+1)})
  }


  componentWillMount(){
    const rehydrate = JSON.parse(localStorage.getItem('subjectSavedState'))
    this.setState(rehydrate)
    const url = 'http://api.learning2earn.me/subjects';

    fetch(url)
      .then((response) => {return response.json()})
      .then((courseJson) =>{
        return courseJson
      })
      .catch(() => {return []})
      .then((info) => {this.setState({subjectList: info, maxPage: Math.ceil(info.length / this.state.pageSize)})})

  }

  componentWillUnmount(){
    localStorage.setItem('subjectSavedState', JSON.stringify(this.state))
  }

  render(){
      console.log(this.state.page);
      var {subjectList, page, pageSize, maxPage} = this.state
      var lastInd = page * pageSize
      var firstInd = lastInd - pageSize
      var subjectArr = subjectList.slice(firstInd,lastInd)
      var subjectCards = subjectArr.map((sub,i) =>
        <div className='col-sm-3' key={i}>
          <div className='card' style={card_remove_border} >
          <SubjectCard provider={sub["provider"]} subId={sub["id"]} subName={sub["subject"]} image={sub["image"]} totalCourses={sub['course-ids'].length} totalJobs={sub['job-ids'].length}/>
          </div>
      </div>
      );

      return(
        <div className='box'>
        <Row className='cards'>
      	{subjectCards}
        </Row>
        <div className='pages' >
        <ReactPaginate previousLabel={"previous"}
                    initialPage={this.state.page-1}
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
      );
    }
}

export default Subjects;
