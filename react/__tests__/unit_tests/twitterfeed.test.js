import React from 'react';
import { expect } from 'chai';
import Enzyme from 'enzyme';
import { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

import TwitterFeed from '../../src/components/TwitterFeed';

describe('TwitterFeed Component', () => {
  var dummy = {
    params:{
      provider: 'khanacademy'
    }
  }

  it('Has a Timeline Twitter feed', () => {
    const twitter_feed = mount(<TwitterFeed props={dummy}/>);
    expect(twitter_feed.hasClass('TimeLine'));
  })

})
