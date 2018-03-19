import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import FrontCarousel from '../../src/components/FrontCarousel';
import CarouselItem from 'react-bootstrap';


describe('FrontCarousel Component', () => {
  it('3 Carousel Items', () => {
    const carousel = mount(<FrontCarousel />)
    expect(carousel.find('CarouselItem')).to.have.length(3)
  })
  it('3 images', () => {
    const carousel = mount(<FrontCarousel />)
    expect(carousel.find('img')).to.have.length(3)
  })
})
