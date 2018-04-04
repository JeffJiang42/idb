import React, { Component } from 'react';
import { Navbar, NavItem, Nav, Image, Form, FormGroup, Button, FormControl } from 'react-bootstrap';
import './styles/MyNavbar.css';
import { Link } from 'react-router-dom'

class GlobalSearch extends Component{
	constructor() {
		super();
		this.state = {
			search: ''
		};
	}

	handleClick(){

	}
  render() {
    return (
    	<div className="search-align">
	    	<NavItem>
			    <Navbar.Form pullRight>
			      <FormGroup>
			        <FormControl type="text" placeholder="Search" onChange={e => this.setState({search: e.target.value})} />
			      </FormGroup>{' '}
			      <Link to={"/search/" + this.state.search}>
			      <button onClick={() => console.log("testing123")}> Submit</button>
			      </Link>
			    </Navbar.Form>
			</NavItem>
		</div>
    )
  }
}
export default GlobalSearch;



