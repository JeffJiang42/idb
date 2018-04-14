import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TwitterTimeline from 'react-twitter-embedded-timeline';

class JobData extends Component{
  constructor(props){
    super(props)
    this.state = {
    }
  }

 

  render(){
        <TwitterTimeline widgetId="695868534455275520" chrome="noborders noheader" height={300} />
  }
}

export default TwitterFeed;