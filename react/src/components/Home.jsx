import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid } from 'react-bootstrap';
import  FrontCarousel  from './FrontCarousel.jsx';
import FrontStats from './FrontStats.jsx';
import './styles/Home.css';

var grid_style: {
    'backgroundColor': '#ff0000',
    'padding-left': '600px',
    'padding-right': 0,
};

class Home extends Component{
  render(){
    return(
      <Grid fluid style={grid_style}>
        <FrontCarousel/>
        <FrontStats/>
      </Grid>
    );
  }
}
export default Home
