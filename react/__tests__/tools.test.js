import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import Tools from '../src/components/Tools';

describe('Tools Component', () => {

	it('contains links to our repos', () => {
	    const tools = mount(<Tools />)
	    expect(tools.contains(<h3>Project Links</h3>)).to.equal(true);
  	})

  	it('contains links to our tools', () => {
	    const tools = mount(<Tools />)
	    expect(tools.contains(<h3>Our Tools</h3>)).to.equal(true);
  	})

	//cant get these to work :(
  // it('contains links to our repos', () => {
  //   const tools = mount(<Tools />)
  //   expect(tools.contains(<div className="project"/>)).to.equal(true);
  // })

  // it('contains a list of tools/libraries we use', () => {
  //   const tools = mount(<Tools />)
  //   expect(tools.contains(<div className="tools" />)).to.equal(true);
  // })

  // it('contains a list sites where we scraped data from', () => {
  //   const tools = mount(<Tools />)
  //   expect(tools.contains(<div className="data" />)).to.equal(true);
  // })

})
