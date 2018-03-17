import React, { Component } from 'react';
import { Row } from 'react-bootstrap';
import './styles/FrontStats.css';

class FrontStats extends Component{
  render(){
    return(
      <div className="test">
        <Row>
        <div class="col statistic">
          <h3>Number of Courses</h3>
          <h4>3</h4>
        </div>
        <div class="col statistic">
          <h3>Number of Subjects</h3>
          <h4>3</h4>
        </div>
        <div class="col statistic">
          <h3>Number of Jobs</h3>
          <h4>3</h4>
        </div>
      </Row>
      </div>
    );
  }
}
export default FrontStats;
