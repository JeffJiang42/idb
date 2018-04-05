import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import MyNavbar from '../../src/components/MyNavbar';
import NavItem from 'react-bootstrap';

describe('Navigation Component', () => {
  it('renders logo', () => {
    const navbar = mount(<MyNavbar />)
    expect(navbar.find('img')).to.have.length(1)
  })
  // it('5 links rendered', () => {
  //   const navbar = mount(<MyNavbar />)
  //   expect(navbar.find('NavItem')).to.have.length(4)
  // })
})
