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
    this.prevPage = this.prevPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }

  handlePageChange(event){
    this.setState({page: Number(event.selected+1)})
  }

  prevPage(event){
    var currPage = this.state.page
    if (currPage == 1){
      return
    }
    this.setState({page:currPage-1})
  }

  nextPage(event){
    var currPage = this.state.page
    if (currPage == this.state.maxPage){
      return
    }
    this.setState({page:currPage+1})
  }

  componentDidMount(){
    const url = 'http://api.learning2earn.me/subjects';

    fetch(url)
      .then((response) => {return response.json()})
      .then((courseJson) =>{
        return courseJson
      })
      .catch(() => {return []})
      .then((info) => {this.setState({subjectList: info})})

  }

  render(){
      var {subjectList, page, pageSize, maxPage} = this.state
      var pageItems = []
      for (let i of _.range(1,maxPage + 1)){
        pageItems.push(
          <Pagination.Item key={i} id={i} onClick={this.handlePageChange} active={i === page}>{i}</Pagination.Item>
        );
      }
      var lastInd = page * pageSize
      var firstInd = lastInd - pageSize
      var subjectArr = subjectList.slice(firstInd,lastInd)
      var subjectCards = subjectArr.map((sub) =>
        <div className='col-sm-4'>
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
        <ReactPaginate previousLabel={"previous"}
                    nextLabel={"next"}
                    breakLabel={<a href="">...</a>}
                    breakClassName={"break-me"}
                    pageCount={this.state.maxPage}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageChange}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"} />
        </div>
      );
    }
}

export default Subjects;
