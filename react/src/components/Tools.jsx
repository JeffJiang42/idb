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
        <p><a href="https://travis-ci.org/JeffJiang42/idb"><b>TravisCI</b></a></p>
        <br/>
      </div>
      <div className="tools">
        <h3>Our Tools</h3>
        <p>Our code is hosted on <a href="https://github.com"><b>GitHub</b></a></p>
        <p>We are using <a href="https://slack.com"><b>Slack</b></a> as our main method of communication</p>
        <p>We are using <a href="https://trello.com"><b>Trello</b></a> to organize collaboration</p>
        <p>We are using <a href="http://flask.pocoo.org"><b>Flask</b></a> for our web framework</p>
        <p>We are using <a href="https://reactjs.org"><b>React</b></a> as our frontend framework</p>
        <p>We are using <a href="https://mochajs.org"><b>Mocha</b></a> for testing our frontend</p>
        <p>We are using <a href="http://airbnb.io/enzyme/"><b>Enzyme</b></a> as an additional package to test our React components</p>
        <p>We are using <a href="https://www.seleniumhq.org/"><b>Selenium</b></a> for our frontend acceptance tests</p>
        <p>We are using <a href="https://travis-ci.org/"><b>TravisCI</b></a> to automate our testing</p>
        <p>We are using <a href="https://getbootstrap.com"><b>Bootstrap</b></a> as a CSS framework</p>
        <p>We are using <a href="https://www.getpostman.com"><b>Postman</b></a> to design and test our API</p>
        <p>We are using <a href="https://www.gitbook.com"><b>GitBook</b></a> to document our API and for our report</p>
        <p>We are using <a href="https://www.docker.com"><b>Docker</b></a> to deploy our Backend</p>
        <p>Our project is hosted on <a href="https://aws.amazon.com"><b>Amazon Web Service</b></a></p>
      </div>
      <div className="data">
        <p>For data on courses, we are using APIs from <a href="https://www.udemy.com/developers/">
          <b>Udemy</b></a>, <a href="https://github.com/Khan/khan-api/wiki/Khan-Academy-API"><b>KhanAcademy</b></a>,
          and </p>
        <p>For data  on jobs, we are using APIs from <a href="https://jobs.github.com/api"><b>GitHubJobs</b></a> and <a href="https://authenticjobs.com/api/documentation/"><b>AuthenticJobs</b></a></p>
      </div>
    </div>
    )
  }
}
export default Tools;
