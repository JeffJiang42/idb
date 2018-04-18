import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Timeline } from 'react-twitter-widgets'

class TwitterFeed extends Component{
  constructor(props){
    super(props)
  }

  componentWillReceiveProps(props){
    this.prov = props.prov
  }

  render(){
  	var provider = this.props.provider
    provider = String(provider).toLowerCase().replace(/\s/g,'')

	  return(
	  	<div>
      <Timeline
			    dataSource={{
			      sourceType: 'profile',
			      screenName: provider
			    }}
			    options={{
			      username: 'TwitterDev',
			      height: '400',
			      width: '300'
			    }}
			    onLoad={() => console.log('Timeline is loaded!')}
			  />
      </div>

	  )

  }
}
export default TwitterFeed;
