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
    expect(searchpage.find('button')).to.have.length(3);
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
