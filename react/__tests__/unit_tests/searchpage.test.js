import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import SearchPage from '../../src/components/SearchPage';

describe('SearchPage Component', () => {

  it('contain a search form', () => {
    const props = {
      match: {
        params: {
          query: 'computer'
        },
      },
    };
    const searchpage = mount(<SearchPage {...props}/>);
    expect(searchpage.hasClass('form'));
    expect(searchpage.find('form')).to.have.length(1);

  })

  it('contain buttons for courses, jobs, subjects', () => {
    const props = {
      match: {
        params: {
          query: 'computer'
        },
      },
    };
    const searchpage = mount(<SearchPage {...props} />);
    expect(searchpage.hasClass('search_filters'));
    expect(searchpage.hasClass('course_filter'));
    expect(searchpage.hasClass('subj_filter'));
    expect(searchpage.hasClass('jobs_filter'));

  })

  it('default search results pertains to courses', () => {
    const props = {
      match: {
        params: {
          query: 'computer'
        },
      },
    };
    const searchpage = mount(<SearchPage {...props} />);
    console.log(searchpage.props());
    expect(searchpage.state().display).to.equal(0)
  })

  it('search results are table rows', () => {
    const props = {
      match: {
        params: {
          query: 'computer'
        },
      },
    };
    const searchpage = mount(<SearchPage {...props} />);
    expect(searchpage.find('tr')).to.not.equal(0)
  })

})
