import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import SubjectCard from '../../src/components/SubjectCard';

describe('SubjectCard Component', () => {

  it('renders a card', () => {
    const subect_card = shallow(<SubjectCard />);
    expect(subect_card.hasClass('card'));
  })

  it('contains a title', () => {
    const subect_card = shallow(<SubjectCard />);
    expect(subect_card.hasClass('card-block'));
  })

  it('contains a description block', () => {
    const subect_card = shallow(<SubjectCard />);
    expect(subect_card.hasClass('card-title'));
  })

})
