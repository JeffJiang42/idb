import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import SubjectData from '../../src/components/SubjectData';

describe('SubjectData Component', () => {
  var dummy = {
    params:{
      id: 1
    }
  }

  it('Has a title', () => {
    const subject_data = shallow(<SubjectData match={dummy}/>);
    expect(subject_data.hasClass('card-title'));
  })

  it('Has an image', () => {
    const subject_data = shallow(<SubjectData match={dummy}/>);
    expect(subject_data.hasClass('card-img-top'));
  })

  it('contains a course description block with some information', () => {
    const subject_data = shallow(<SubjectData match={dummy}/>);
    expect(subject_data.hasClass('card-body'));
  })

})
