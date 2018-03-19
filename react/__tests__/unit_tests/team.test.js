import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import Team from '../../src/components/Team';

describe('Team Component', () => {
  it('contains a card for each member', () => {
    const team = mount(<Team />)
    expect(team.find('.memberCard')).to.have.length(5)
  })

  it('has a description of the project', () => {
    const team = mount(<Team />)
    expect(team.find('.statement')).to.have.length(1)
  })

})
