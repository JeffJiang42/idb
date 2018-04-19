import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import JobData from '../../src/components/JobData';

describe('JobData Component', () => {
  var dummy = {
    params:{
      id: 1
    }
  }

  it('Has a title', () => {
    const job_data = shallow(<JobData match={dummy}/>);
    expect(job_data.hasClass('card-title'));
  })

  it('Has an image', () => {
    const job_data = shallow(<JobData match={dummy}/>);
    expect(job_data.hasClass('card-img-top'));
  })

  it('contains a course description block with some information', () => {
    const job_data = shallow(<JobData match={dummy}/>);
    expect(job_data.hasClass('card-body'));
  })

  it('Has a Timeline Twitter feed', () => {
    const job_data = shallow(<JobData match={dummy}/>);
    expect(job_data.hasClass('TimeLine'));
  })

})
