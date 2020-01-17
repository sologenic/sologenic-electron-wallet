// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { createReducer } from 'redux-act';
import type { HashHistory } from 'history';
import {
  getDefaultFiatCurrency,
  setDefaultFiatCurrency
} from '../actions/index.js';

const initial = {
  defaultFiat: {
    currency: 'initial'
  }
};

const defaultFiat = createReducer(
  {
    [setDefaultFiatCurrency]: (state, payload) => {
      return {
        ...state,
        currency: payload
      };
    }
  },
  initial.defaultFiat
);

export default function createRootReducer(history: HashHistory) {
  return combineReducers<{}, *>({
    router: connectRouter(history),
    defaultFiat: defaultFiat
  });
}
