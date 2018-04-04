import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles/SearchPage.css';


class SearchPage extends Component{
	constructor(props) {
		super(props);
		console.log(props)
			var query = props.match.query;
			this.state = {
			query: ''
		};
	}

	componentWillMount(){
		this.setState({query: this.props.match.params.query})
	}

	componentWillReceiveProps(nextProps) {
	    if(JSON.stringify(this.props.match.query) !== JSON.stringify(nextProps.match.params.query)) // Check if it's a new user, you can also use some unique, like the ID
	    {
	           this.setState({query: nextProps.match.params.query});
	    }
	} 

  render(){
    return(
    	<div>
      <h1>No search results :C</h1>
      <h1>You searched {this.state.query}</h1>
      </div>
    );
  }
}
export default SearchPage
