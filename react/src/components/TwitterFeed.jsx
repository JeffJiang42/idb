import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Timeline } from 'react-twitter-widgets'

class TwitterFeed extends Component{
  constructor(props){
    super(props)
    console.log(props)
    this.state = {
    	prov: ''
    }
  }

  componentWillReceiveProps(props){
    this.prov = props.prov
  }

  render(){
	  return(
	  	<Timeline
		    dataSource={{
		      sourceType: 'profile',
		      screenName: this.state.prov
		    }}
		    options={{
		      username: 'TwitterDev',
		      height: '400',
		      width: '300'
		    }}
		    onLoad={() => console.log('Timeline is loaded!')}
		  />
	  )

  }
}
export default TwitterFeed;
