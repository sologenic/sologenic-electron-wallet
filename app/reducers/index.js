// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { createReducer } from 'redux-act';
// import type { HashHistory } from 'history';
import {
  getDefaultFiatCurrency,
  setDefaultFiatCurrency,
  setPinCode,
  setTerms,
  changingPin,
  generateNewWallet,
  // addNewWallet,
  fillNewWallet
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
  },
  newWallet: null,
  wallets: {
    wallets: [],
    updated: false
  }
};

const wallets = createReducer(
  {
    [fillNewWallet]: (state, payload) => {
      const { wallets } = state;
      console.log('STORE WALLETS', payload);
      const payload2 = payload.payload;

      const newWallet = {
        id: payload2.rippleClassicAddress,
        nickname: payload2.nickname,
        details: payload2.wallet,
        balance: {
          xrp: 0,
          solo: 0,
          tokenizedAssets: 0
        },
        walletAddress: payload2.rippleClassicAddress,
        rippleClassicAddress: payload2.rippleClassicAddress,
        transactions: [],
        trustline: 'ADD TRUSTLINE'
      };

      return {
        ...state,
        wallets: [...wallets, newWallet],
        updated: true
      };
    }
  },
  initial.wallets
);

const newWallet = createReducer(
  {
    [generateNewWallet]: (state, payload) => {
      return {
        ...state,
        newWallet: {
          wallet: payload.result,
          walletNickname: payload.nickname,
          walletAddress: payload.walletAddress,
          rippleClassicAddress: payload.rippleClassicAddress
        }
      };
    }
  },
  initial.newWallet
);

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

export default function createRootReducer(history) {
  return combineReducers({
    router: connectRouter(history),
    defaultFiat: defaultFiat,
    pinCode: pinCode,
    terms: terms,
    isPinChanging: isPinChanging,
    newWallet: newWallet,
    wallets: wallets
  });
}
