import React, { Component } from 'react';
import { Carousel } from 'react-bootstrap';
import './styles/FrontCarousel.css';

class FrontCarousel extends Component{
  render(){
    return(
    <Carousel>
        <Carousel.Item>
          <img alt="carousel 1" src="https://imgur.com/JX40uak.jpg" />
          <Carousel.Caption>
            <h1>Welcome to Learning2Earn!</h1>
            <p>At Learning2Earn, we hope to simplify the job search for those who are willing to dedicate time for education. We provide a stronger incentive for students (and future students) by connecting them with associated jobs.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img alt="carousel 2" src="https://imgur.com/NQRv2UA.jpg" />
          <Carousel.Caption>
            <h1>Welcome to Learning2Earn!</h1>
            <p>At Learning2Earn, we hope to simplify the job search for those who are willing to dedicate time for education. We provide a stronger incentive for students (and future students) by connecting them with associated jobs.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img alt="carousel 3" src="https://imgur.com/apyGy1M.jpg" />
          <Carousel.Caption>
            <h1>Welcome to Learning2Earn!</h1>
            <p>At Learning2Earn, we hope to simplify the job search for those who are willing to dedicate time for education. We provide a stronger incentive for students (and future students) by connecting them with associated jobs.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    );
  }
}
export default FrontCarousel;
