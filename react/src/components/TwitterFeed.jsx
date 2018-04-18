import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Timeline } from 'react-twitter-widgets'

class TwitterFeed extends Component{
  constructor(props){
    super(props)
    this.state = {
      mounted: false
    }
  }

  componentWillReceiveProps(props){
    this.prov = props.prov
  }

  componentDidMount() {
    this.setState({ mounted: true })
  }

  componentWillUnmount() {
  	this.setState({ mounted: false })
  }

  render(){
  	var provider = this.props.provider
    provider = String(provider).toLowerCase().replace(/\s/g,'')

    if (this.state.mounted) {
      return(
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

	  )
    } else {
      return <div> </div>
    }
	  

  }
}
export default TwitterFeed;
