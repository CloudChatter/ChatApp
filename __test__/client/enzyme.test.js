import React from 'react';
import { configure, shallow } from 'enzyme';
import Adaptor from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';

// import components
import App from '../../src/client/App';

// config Enzyme for React 16 (adapter for react-17 not ready yet)
configure({ adapter: new Adaptor() });

describe('React unit tests', () => {
  describe('a comonent', () => {
    let wrapper;
    const props = {
      // nothing right now, if there are props, we pass it into <App {...props} />
    };
    beforeAll(() => {
      wrapper = shallow(<App />);
    });

    it('Renders a <div> tag', () => {
      expect(wrapper.type()).toEqual('div');
    });

    it('should contain a <h1> text', () => {
      expect(wrapper.find('h1').text()).toEqual('Hello Squirtle World!');
    });
  });
});
