import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import Jobs from '../../src/components/Jobs';

describe('Jobs Component', () => {

  it('contains course cards component', () => {
    const jobs = mount(<Jobs />);
    expect(jobs.hasClass('cards'));
  })

  it('contains page navigator', () => {
    const jobs = mount(<Jobs />);
    expect(jobs.hasClass('ReactPaginate'));
  })

  it('contains a Filter', () => {
    const jobs = mount(<Jobs />);
    expect(jobs.hasClass('Filters'));
    expect(jobs.find('.Filters')).to.have.length(1)
  })

  it('contains a sort function', () => {
    const jobs = mount(<Jobs />);
    expect(jobs.hasClass('Sorting'));
    expect(jobs.find('.Sorting')).to.have.length(1)
  })
})
