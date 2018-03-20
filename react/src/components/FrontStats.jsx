import React, { Component } from 'react';
import { Row } from 'react-bootstrap';
import './styles/FrontStats.css';

class FrontStats extends Component{
  render(){
    return(
      <div className="test">
        <Row>
        <div className="col statistic">
          <h3>Number of Courses</h3>
          <h4>2772</h4>
        </div>
        <div className="col statistic">
          <h3>Number of Subjects</h3>
          <h4>139</h4>
        </div>
        <div className="col statistic">
          <h3>Number of Jobs</h3>
          <h4>302</h4>
        </div>
      </Row>
      </div>
    );
  }
}
export default FrontStats;
