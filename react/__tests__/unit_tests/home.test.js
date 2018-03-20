import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import Home from '../../src/components/Home';

describe('Home Component', () => {
  it('contains a FrontCarousel component', () => {
    const home = mount(<Home />);
    expect(home.find('FrontCarousel')).to.have.length(1);
  })

  it('contains a FrontStats component', () => {
    const home = mount(<Home />);
    expect(home.find('FrontStats')).to.be.a('number');
  })

})
