import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import About from '../src/components/About';

describe('About Component', () => {
  it('contains a Team Component', () => {
    const about = mount(<About />)
    expect(about.find('Team'))
  })
    it('contains a Tool Component', () => {
    const about = mount(<About />)
    expect(about.find('Tool'))
  })
})
