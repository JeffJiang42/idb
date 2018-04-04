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
	}


  render() {
    return (
	    	<NavItem>
    	<div className="search-align">
			    <Navbar.Form pullRight>
			      <FormGroup>
			        <FormControl type="text" placeholder="Search" onChange={e => this.setState({search: e.target.value})} />
			      </FormGroup>{' '}
			      <Link to={"/search/" + this.state.search}>
			      <button onClick={() => console.log("testing123")}> Submit</button>
			      </Link>
			    </Navbar.Form>
		</div>
			</NavItem>
    )
  }
}
export default GlobalSearch;



