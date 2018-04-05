import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import Subjects from '../../src/components/Subjects';

describe('Subjects Component', () => {

  it('contains course cards component', () => {
    const subjects = mount(<Subjects />);
    expect(subjects.hasClass('cards'));
  })

  it('contains page navigator', () => {
    const subjects = mount(<Subjects />);
    expect(subjects.hasClass('ReactPaginate'));
  })

  it('contains a Filter', () => {
    const subjects = mount(<Subjects />);
    expect(subjects.hasClass('Filters'));
    expect(subjects.find('.Filters')).to.have.length(1)
  })


})
