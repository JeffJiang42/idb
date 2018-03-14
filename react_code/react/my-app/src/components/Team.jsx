import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Row, Col, Thumbnail } from 'react-bootstrap';
import './styles/Team.css';

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
const kurtis_resp = "Frontend + Backend = Full Stack"
const william_resp = "API + Full Stack"
const brandon_resp = "Frontend"
const spencer_resp = "Backend"

var jeff_commits = 0;
var jeff_issues = 1;

var kurtis_commits = 2;
var kurtis_issues = 3;

var william_commits = 4;
var william_issues = 5;

var brandon_commits = 6;
var brandon_issues = 7;

var spencer_commits = 8;
var spencer_issues = 9;

var info = [{
    'name': 'Jeffrey Jiang',
    'commits': jeff_commits,
    'issues': jeff_issues,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/EA09WOz.jpg',
    'bio': jeff_bio,
    'resp': jeff_resp
    }, {
    'name': 'Kurtis David',
    'commits': kurtis_commits,
    'issues': kurtis_issues,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/cUfxaZU.jpg',
    'bio': kurtis_bio,
    'resp':kurtis_resp
    },{
    'name': 'William Chia',
    'commits': william_commits,
    'issues': william_issues,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/0PUOsTj.jpg',
    'bio': william_bio,
    'resp': william_resp
    },{
    'name': 'Brandon Chan',
    'commits': brandon_commits,
    'issues': brandon_issues,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/3LhRT5l.jpg',
    'bio': brandon_bio,
    'resp': brandon_resp
    },{
    'name': 'Spencer Huff',
    'commits': spencer_commits,
    'issues': spencer_issues,
    'unit_tests': 0,
    'image': 'https://i.imgur.com/1seLbaU.jpg',
    'bio': spencer_bio,
    'resp': spencer_resp
    }]


const teamCards_1 = info.slice(0,3).map((person,i)=>
  <div key={"member_" + i}>
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

const teamCards_2 = info.slice(3).map((person,i)=>
  <div key={"member_" + i}>
    <Col xs={6} md={6}>
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

class Team extends Component{
  render(){
    return(
      <Grid>
        {teamCards_1}
        {teamCards_2}
      </Grid>
    );
  }
}
export default Team;
