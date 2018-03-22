import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import Tools from '../../src/components/Tools';

describe('Tools Component', () => {

	it('contains links to our repos', () => {
	    const tools = shallow(<Tools />)
	    expect(tools.find('.project')).to.have.length(1);
  	})

  	it('contains links to our tools', () => {
	    const tools = shallow(<Tools />)
	    expect(tools.find('.tools')).to.have.length(1);
  	})

   it('contains a list sites where we scraped data from', () => {
     const tools = shallow(<Tools />)
     expect(tools.find('.data')).to.have.length(1);
   })
})
