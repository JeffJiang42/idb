import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import JobCard from '../../src/components/JobCard';

describe('JobCard Component', () => {

  it('renders a card', () => {
    const job_card = shallow(<JobCard />);
    expect(job_card.hasClass('card'));
  })

  it('contains a title', () => {
    const job_card = shallow(<JobCard />);
    expect(job_card.hasClass('card-block'));
  })

  it('contains a description block', () => {
    const job_card = shallow(<JobCard />);
    expect(job_card.hasClass('card-title'));
  })

})
