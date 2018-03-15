import React, { Component } from 'react';
import './styles/Tools.css';

class Tools extends Component{
  render(){
    return (
      <div>
      <div className="project">
        <h3>Project Links</h3>
        <p><a href="https://github.com/JeffJiang42/learning2earn"><b>Github Repository</b></a></p>
        <p><a href="https://acciaccatura.gitbooks.io/api/content/"><b>API Documentation</b></a></p>
        <p><a href="https://jeffjiang42.gitbooks.io/report/content/"><b>Report</b></a></p>
      </div>
      <div className="tools">
        <p>Our code is hosted on <a href="https://github.com"><b>GitHub</b></a></p>
        <p>We are using <a href="https://slack.com"><b>Slack</b></a> as our main method of communication</p>
        <p>We are using <a href="https://trello.com"><b>Trello</b></a> to organize collaboration</p>
        <p>We are using <a href="http://flask.pocoo.org"><b>Flask</b></a> for our web framework</p>
        <p>We are using <a href="https://getbootstrap.com"><b>Bootstrap</b></a> as a CSS framework</p>
        <p>We are using <a href="https://www.getpostman.com"><b>Postman</b></a> to design our API</p>
        <p>We are using <a href="https://www.gitbook.com"><b>GitBook</b></a> to document our API and for our report</p>
        <p>We are using <a href="https://www.docker.com"><b>Docker</b></a> to deploy our website</p>
        <p>Our project is hosted on <a href="https://aws.amazon.com"><b>Amazon Web Services</b></a></p>
      </div>
    </div>
    )
  }
}
export default Tools;
