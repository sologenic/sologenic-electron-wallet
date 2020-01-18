// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { createReducer } from 'redux-act';
import type { HashHistory } from 'history';
import {
  getDefaultFiatCurrency,
  setDefaultFiatCurrency,
  setPinCode,
  setTerms,
  changingPin
} from '../actions/index.js';

const initial = {
  defaultFiat: {
    currency: 'usd'
  },
  pinCode: {
    pin: ''
  },
  terms: {
    accepted: false
  },
  isPinChanging: {
    changing: false
  }
};

const isPinChanging = createReducer(
  {
    [changingPin]: (state, payload) => {
      return {
        ...state,
        changing: true
      };
    }
  },
  initial.isPinChanging
);

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

const pinCode = createReducer(
  {
    [setPinCode]: (state, payload) => {
      return {
        ...state,
        pin: payload
      };
    }
  },
  initial.pinCode
);

const terms = createReducer(
  {
    [setTerms]: (state, payload) => {
      return {
        ...state,
        accepted: payload
      };
    }
  },
  initial.terms
);

export default function createRootReducer(history: HashHistory) {
  return combineReducers<{}, *>({
    router: connectRouter(history),
    defaultFiat: defaultFiat,
    pinCode: pinCode,
    terms: terms,
    isPinChanging: isPinChanging
  });
}
