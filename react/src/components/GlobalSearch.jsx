import React, { Component } from 'react';
import { Navbar, NavItem, Nav, Image, Form, FormGroup, Button, FormControl } from 'react-bootstrap';
import './styles/MyNavbar.css';
import { Link } from 'react-router-dom'
import SearchPage from './SearchPage.jsx'

class GlobalSearch extends Component{
	constructor() {
		super();
		this.state = {
			search: ''
		};
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(event){
		var test = this.enableKeyboardNavigation
		console.log(test)
		console.log("event = " + event)
		this.setState({search: event.target.value}, ()=>{console.log(this.state.search)})
	}


  render() {
    return (
    	<div className="search-align">
			    <Navbar.Form pullRight>
						<FormControl type="text" placeholder="Search" onChange={this.handleChange}/>
			      <Link to={"/search/" + this.state.search}>
			      <button onClick={() => console.log("testing123")}> Submit</button>
			      </Link>
			    </Navbar.Form>
		</div>
    )
  }
}
export default GlobalSearch;
