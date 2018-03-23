import React, { Component } from 'react';
import { Row } from 'react-bootstrap';
import './styles/FrontStats.css';

class FrontStats extends Component{
  render(){
    return(
      <div className="stats">
        <Row>
        <div className="col statistic">
          <h3>Number of Courses</h3>
          <h4>2772</h4>
        </div>
        <div className="col statistic">
          <h3>Number of Subjects</h3>
          <h4>140</h4>
        </div>
        <div className="col statistic">
          <h3>Number of Jobs</h3>
          <h4>211</h4>
        </div>
      </Row>
      </div>
    );
  }
}
export default FrontStats;
