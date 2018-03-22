import SubjectCard from './SubjectCard.jsx';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash'
import { Row, Grid, Pagination } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'



class Subjects extends Component{
  constructor(props){
    super(props);
    this.state = {
      subjectList: [],
      page: 1,
      pageSize: 30,
      maxPage: 4
    };
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  handlePageChange(event){
    console.log(event.selected)
    this.setState({page: Number(event.selected+1)})
  }


  componentDidMount(){
    const url = 'http://api.learning2earn.me/subjects';

    fetch(url)
      .then((response) => {return response.json()})
      .then((courseJson) =>{
        return courseJson
      })
      .catch(() => {return []})
      .then((info) => {this.setState({subjectList: info, maxPage: Math.ceil(info.length / this.state.pageSize)})})

  }

  render(){
      var {subjectList, page, pageSize, maxPage} = this.state
      var lastInd = page * pageSize
      var firstInd = lastInd - pageSize
      var subjectArr = subjectList.slice(firstInd,lastInd)
      var subjectCards = subjectArr.map((sub,i) =>
        <div className='col-sm-4' key={i}>
          <div className='card'>
          <SubjectCard provider={sub["provider"]} subId={sub["id"]} subName={sub["subject"]} image={sub["image"]} totalCourses={sub['course-ids'].length}/>
          </div>
      </div>
      );

      return(
        <div className='box'>
        <Row className-='cards'>
      	{subjectCards}
        </Row>
        <div className='pages' >
        <ReactPaginate previousLabel={"previous"}
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
