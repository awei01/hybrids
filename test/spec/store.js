import { test, resolveRaf } from '../helpers';
import { define, html } from '../../src';

import * as store from '../../src/store';

fdescribe('store:', () => {
  describe('one type with synchronous storage', () => {
    const Profile = {
      firstName: '',
      lastName: '',
    };

    store.observe(Profile, {
      get: () => ({ firstName: 'John', lastName: 'Smith' }),
    });

    define('test-store', {
      id: '1',
      profile: ({ id }) => store.get(Profile, id),
      render: ({ profile }) => html`
        ${profile && html`<h1>${profile.firstName} ${profile.lastName}</h1>`}
      `,
    });

    const tree = test('<test-store></test-store>');

    it('renders profile data', tree(el => resolveRaf(() => {
      expect(el.shadowRoot.innerHTML.trim()).toBe('<h1>John Smith</h1>');
    })));
  });
});
