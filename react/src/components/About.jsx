import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles/About.css';
import Team from './Team.jsx';
import  Tools from './Tools.jsx'

class About extends Component{
  render(){
    return(
      <div>
      <Team />
      <Tools />
      <br/>
      <br/>
      </div>
    );
  }
}
export default About;
