import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import CourseData from '../../src/components/CourseData';

describe('CourseData Component', () => {
  var dummy = {
    params:{
      id: 1
    }
  }

  it('Has a title', () => {
    const course_data = shallow(<CourseData match={dummy}/>);
    expect(course_data.hasClass('card-title'));
  })

  it('Has an image', () => {
    const course_data = shallow(<CourseData match={dummy}/>);
    expect(course_data.hasClass('card-img-top'));
  })

  it('contains a course description block with some information', () => {
    const course_data = shallow(<CourseData match={dummy}/>);
    expect(course_data.hasClass('card-body'));
  })

})
