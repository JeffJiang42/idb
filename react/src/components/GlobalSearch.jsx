import React, { Component } from 'react';
import { Navbar, NavItem, Nav, Image, Form, FormGroup, Button, FormControl } from 'react-bootstrap';
import './styles/MyNavbar.css';

class GlobalSearch extends Component{
	constructor() {
		super();
		this.state = {
			search: ''
		};
	}

  render() {
    return (
    	<div className="search-align">
	    	<NavItem>
			    <Navbar.Form pullRight>
			      <FormGroup>
			        <FormControl type="text" placeholder="Search" onChange={e => this.setState({search: e.target.value})} />
			      </FormGroup>{' '}
			      <button onClick={() => console.log(this.state.search)}> Submit</button>
			    </Navbar.Form>
			</NavItem>
		</div>
    )
  }
}
export default GlobalSearch;



