import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import CourseCard from '../../src/components/CourseCard';

describe('CourseCard Component', () => {

  it('renders a card', () => {
    const course_card = shallow(<CourseCard />);
    expect(course_card.hasClass('card'));
  })

  it('contains a title', () => {
    const course_card = shallow(<CourseCard />);
    expect(course_card.hasClass('card-block'));
  })

  it('contains a description block', () => {
    const course_card = shallow(<CourseCard />);
    expect(course_card.hasClass('card-title'));
  })

})
