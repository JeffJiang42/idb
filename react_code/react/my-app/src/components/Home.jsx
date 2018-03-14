import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid } from 'react-bootstrap';
import  FrontCarousel  from './FrontCarousel.jsx';
import FrontStats from './FrontStats.jsx';
import './styles/Home.css';

class Home extends Component{
  render(){
    return(
      <Grid fluid>
        <FrontCarousel/>
        <FrontStats/>
      </Grid>
    );
  }
}
export default Home
