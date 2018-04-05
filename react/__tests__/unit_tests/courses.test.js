import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import Courses from '../../src/components/Courses';

describe('Courses Component', () => {

  it('contains course cards component', () => {
    const courses = mount(<Courses />);
    expect(courses.hasClass('cards'));
  })

  it('contains page navigator', () => {
    const courses = mount(<Courses />);
    expect(courses.hasClass('ReactPaginate'));
  })

  it('contains a Filter', () => {
    const courses = mount(<Courses />);
    expect(courses.hasClass('Filters'));
    expect(courses.find('.Filters')).to.have.length(1)
  })

})
