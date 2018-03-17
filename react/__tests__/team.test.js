import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import Team from '../src/components/Team';

describe('Team Component', () => {
  it('contains a Team Component', () => {
    const team = mount(<Team />)
    expect(team.find('teamCards_1')).to.have.length(5)
  })

})
