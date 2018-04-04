import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles/SearchPage.css';


class SearchPage extends Component{
	constructor(props) {
		super(props);
		console.log(props)
			this.state = {
			query: props.match.params.query
		};
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
