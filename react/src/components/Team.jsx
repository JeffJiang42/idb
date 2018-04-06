import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Row, Col, Thumbnail } from 'react-bootstrap';
import './styles/Team.css';
import _ from 'lodash'
import "isomorphic-fetch"

const commits_url = "https://api.github.com/repos/JeffJiang42/idb/stats/contributors";
const issues_url = "https://api.github.com/repos/JeffJiang42/idb/issues?state=all";

const jeff_bio = "Jeffrey is a third year Math/CS Major at UT Austin. \
  His life is consumed by his interest in both subjects. In the rare \
  occasion he has free time, he plays guitar."

const william_bio = "William is a third year CS Major. \
    He likes playing piano and guitar, cooking, and also plays some Melee."

const brandon_bio = "Brandon is a third year CS Major at UT Austin. \
  Brandon likes a lot of things, including but not limited to hiking, \
  video games, beer, soccer, anime, photography, piano, ultimate frisbee, \
  meeting people, etc."

const kurtis_bio = "Kurtis is a third year CS/Math Major at UT Austin. \
    He likes to play Super Smash Bros. Melee (Marth of course) in his spare time."

const spencer_bio = "Spencer is a junior CS major at UT Austin. He likes to cook \
    and hang out with his cats in his free time."

const jeff_resp = "Frontend"
const kurtis_resp = "Scraping + Backend"
const william_resp = "API + Full Stack"
const brandon_resp = "Frontend + Testing"
const spencer_resp = "Backend"

var info = [{
    'name': 'Jeffrey Jiang',
    'commits': 0,
    'issues': 0,
    'unit_tests': 18,
    'image': 'https://i.imgur.com/EA09WOz.jpg',
    'bio': jeff_bio,
    'resp': jeff_resp
    }, {
    'name': 'Kurtis David',
    'commits': 0,
    'issues': 0,
    'unit_tests': 267,
    'image': 'https://i.imgur.com/cUfxaZU.jpg',
    'bio': kurtis_bio,
    'resp':kurtis_resp
    },{
    'name': 'William Chia',
    'commits': 0,
    'issues': 0,
    'unit_tests': 17,
    'image': 'https://i.imgur.com/0PUOsTj.jpg',
    'bio': william_bio,
    'resp': william_resp
    },{
    'name': 'Brandon Chan',
    'commits': 0,
    'issues': 0,
    'unit_tests': 29,
    'image': 'https://i.imgur.com/3LhRT5l.jpg',
    'bio': brandon_bio,
    'resp': brandon_resp
    },{
    'name': 'Spencer Huff',
    'commits': 0,
    'issues': 0,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/1seLbaU.jpg',
    'bio': spencer_bio,
    'resp': spencer_resp
    }]

class Team extends Component{

  constructor(props){
    super(props);
    this.state = {
      commits:[0,0,0,0,0],
      issues: [0,0,0,0,0]
    };
  }

  componentDidMount(){
    fetch(commits_url)
      .then((response) => {return response.json()})
      .then((commitsJson) => {
        var commits = [0,0,0,0,0];
        for (let contributor of commitsJson){
          if (contributor.author.login === 'JeffJiang42'){
            commits[0] = contributor.total;
          }
          if (contributor.author.login === 'kurtisdavid'){
            commits[1] = contributor.total;
          }
          if (contributor.author.login === 'Acciaccatura'){
            commits[2] = contributor.total;
          }
          if (contributor.author.login === 'bchan565'){
            commits[3] = contributor.total;
          }
          if (contributor.author.login === 'spencerhuff'){
            commits[4] = contributor.total;
          }
        }
        return commits;
      })
      .catch(() => {
        return [0,0,0,0,0];
      })
      .then((data) => this.setState({commits: data}))

      fetch(issues_url)
        .then((response) => {return response.json()})
        .then((issuesJson) => {
          var issues = [0,0,0,0,0];
          for (let issue of issuesJson){
            var creator = issue.user.login;
            if (creator === 'JeffJiang42'){
              issues[0] += 1;
            }
            if (creator === 'kurtisdavid'){
              issues[1] += 1;
            }
            if (creator === 'Acciaccatura'){
              issues[2] += 1;
            }
            if (creator === 'iambrandonchan'){
              issues[3] += 1;
            }
            if (creator === 'spencerhuff'){
              issues[4] += 1;
            }
          }
          return issues;
        })
        .catch( () => {
          return [0,0,0,0,0];
        })
        .then((data) => this.setState({issues: data}))

  }

  render(){
    var stats = this.state;
    for (let i of _.range(5)){
      info[i].commits = stats.commits[i];
      info[i].issues = stats.issues[i];
    }
    var teamCards_1 = info.slice(0,3).map((person,i)=>
      <div className="memberCard" key={"member_" + i}>
        <Col xs={6} md={4}>
          <Thumbnail src={person.image} >
          <h4>{person.name}</h4>
          <p>{person.bio}</p>
          <p><b>Responsibilities: </b>{person.resp}</p>
          <p><b># of Commits: </b>{person.commits}</p>
          <p><b># of Issues: </b>{person.issues}</p>
          <p><b># of Unit Tests: </b>{person.unit_tests}</p>
          </Thumbnail>
        </Col>
      </div>
    );

    var teamCards_2 = info.slice(3).map((person,i)=>
      <div className="memberCard" key={"member_" + i}>
        <Col xs={6} md={4}>
          <Thumbnail src={person.image}>
          <h4>{person.name}</h4>
          <p>{person.bio}</p>
          <p><b>Responsibilities: </b>{person.resp}</p>
          <p><b># of Commits: </b>{person.commits}</p>
          <p><b># of Issues: </b>{person.issues}</p>
          <p><b># of Unit Tests: </b>{person.unit_tests}</p>
          </Thumbnail>
        </Col>
      </div>
    );

    return(
      <Grid>
        <Row>
          {teamCards_1}
          {teamCards_2}
        </Row>
        <br/>
        <div className="stats">
        <h3>Collective Statistics</h3>
        <p><b>Total # of Commits: </b>{this.state.commits.reduce((a,b) => {return a + b})}</p>
        <p><b>Total # of Issues: </b>{this.state.issues.reduce((a,b) => {return a + b})}</p>
        <p><b>Total # of Unit Tests: </b>119</p>
        <br/>
        </div>
        <div className="statement">
          <h3>About Learning2Earn</h3>
          <p>Learning2Earn is a place to find both work and knowledge.
            With the growing popularity of online courses, we aim to
            connect these courses to relevant job opportinuties.
            Our users will be able to see the applicability of specific
            courses and subjects, and conversely, be able to identify
            and obtain the necessary skills for their desired work.</p>
          <br/>
        </div>
      </Grid>
    );
  }
}
export default Team;
