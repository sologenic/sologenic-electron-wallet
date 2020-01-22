// @flow
import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import type { Store } from '../reducers/types';
import Routes from './Routes';
import RootContainer from './containers/RootContainer.js';

type Props = {
  store: Store,
  history: {}
};

const Root = ({ store, history }: Props) => (
  <Provider store={store}>
    <RootContainer history={history} />
  </Provider>
);

export default hot(Root);
