// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { createReducer } from 'redux-act';
import storage from 'electron-json-storage';
// import type { HashHistory } from 'history';
import {
  getDefaultFiatCurrency,
  setDefaultFiatCurrency,
  setPinCode,
  setTerms,
  changingPin,
  generateNewWallet,
  // addNewWallet,
  fillNewWallet,
  fillWallets,
  closeModal,
  openModal,
  openOptions,
  closeOptions,
  changeWalletNickname,
  deleteWallet,
  getBalanceSuccess,
  setConnection,
  getMarketDataSuccess,
  getMarketDataError,
  getMarketSevensSuccess,
  getCurrentWallet,
  getTransactionsSuccess,
  createTrustlineSuccess,
  transferXrpSuccess,
  cleanTransferInProgress
} from '../actions/index.js';
import { create } from 'react-test-renderer';

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
  currentWallet: {
    wallet: null,
    updated: false
  },
  newWallet: null,
  wallets: {
    wallets: [],
    updated: false
  },
  modal: {
    isOpen: false
  },
  walletOptions: {
    isOpen: false
  },
  connection: {
    connected: false
  },
  marketData: {
    market: {},
    updated: false
  },
  marketSevens: {
    sevens: {},
    updated: false
  },
  transactions: {
    transactions: [],
    updated: false
  },
  transferInProgress: {
    transfer: {
      info: {},
      finished: false,
      success: false
    },
    updated: false
  }
};

const transferInProgress = createReducer(
  {
    [transferXrpSuccess]: (state, payload) => {
      console.log('TRANSFER SUCCESS ->', payload);

      if (payload.result && payload.result.status === 'failed') {
        return {
          ...state,
          transfer: {
            info: payload,
            finished: true,
            success: false,
            reason: payload.result.reason
          },
          updated: true
        };
      } else {
        return {
          ...state,
          transfer: {
            info: payload,
            finished: true,
            success: true,
            reason: ''
          },
          updated: true
        };
      }
    },
    [cleanTransferInProgress]: (state, payload) => {
      return {
        ...state,
        transfer: { info: {}, finished: false, success: false },
        updated: false
      };
    }
  },
  initial.transferInProgress
);

const transactions = createReducer(
  {
    [getTransactionsSuccess]: (state, payload) => {
      console.log(payload);

      return {
        ...state,
        transactions: payload,
        updated: true
      };
    }
  },
  initial.transactions
);

const currentWallet = createReducer(
  {
    [getCurrentWallet]: (state, payload) => {
      console.log('GET_WALLET -> ');

      const { id } = payload;
      const { wallets } = state;
      const currentWallet = wallets.wallets.find(item => item.id === id);

      return {
        ...state,
        wallet: currentWallet,
        updated: true
      };
    }
  },
  initial.currentWallet
);

const marketSevens = createReducer(
  {
    [getMarketSevensSuccess]: (state, payload) => {
      console.log('MARKET 7 REDUCER', state);
      return {
        ...state,
        sevens: payload,
        updated: true
      };
    }
  },
  initial.marketSevens
);

const marketData = createReducer(
  {
    [getMarketDataSuccess]: (state, payload) => {
      return {
        ...state,
        market: payload,
        updated: true
      };
    },
    [getMarketDataError]: (state, payload) => {
      return {
        ...state,
        market: payload,
        updated: true
      };
    }
  },
  initial.marketData
);

const connection = createReducer(
  {
    [setConnection]: (state, payload) => {
      return {
        ...state,
        connected: payload
      };
    }
  },
  initial.connection
);

const walletOptions = createReducer(
  {
    [openOptions]: (state, payload) => {
      return {
        ...state,
        isOpen: true
      };
    },
    [closeOptions]: (state, paylod) => {
      return {
        ...state,
        isOpen: false
      };
    }
  },
  initial.walletOptions
);

const modal = createReducer(
  {
    [closeModal]: (state, payload) => {
      return {
        ...state,
        isOpen: false
      };
    },
    [openModal]: (state, payload) => {
      return {
        ...state,
        isOpen: true
      };
    }
  },
  initial.modal
);

const wallets = createReducer(
  {
    [fillNewWallet]: (state, payload) => {
      const { wallets } = state;
      console.log('STORE WALLETS', payload);
      const payload2 = payload;

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
        trustline: false,
        isActive: false
      };

      storage.set('wallets', [...wallets, newWallet], function(err) {
        if (err) {
          console.log(err);
        }
      });

      return {
        ...state,
        wallets: [...wallets, newWallet],
        updated: true
      };
    },
    [fillWallets]: (state, payload) => {
      return {
        ...state,
        wallets: payload,
        updated: true
      };
    },
    [changeWalletNickname]: (state, payload) => {
      console.log('Changing Wallet Name', payload);

      const { wallet, newName } = payload;
      const { wallets } = state;
      let walletsCopy = [...wallets];
      const updatedWallets = walletsCopy.map(wlt => {
        if (wallet.id === wlt.id) {
          wlt.nickname = newName;
        }
        return wlt;
      });

      storage.set('wallets', [...updatedWallets], function(err) {
        if (err) {
          console.log(err);
        }
      });

      return {
        ...state,
        wallets: updatedWallets
      };
    },
    [deleteWallet]: (state, payload) => {
      const { wallet } = payload;
      const { wallets } = state;
      const walletsCopy = [...wallets];
      const updatedWallets = walletsCopy.filter(wlt => {
        return wallet.id !== wlt.id;
      });

      storage.set('wallets', [...updatedWallets], function(err) {
        if (err) {
          console.log(err);
        }
      });

      return {
        ...state,
        wallets: updatedWallets
      };
    },
    [getBalanceSuccess]: (state, payload) => {
      const { wallets } = state;
      const { id, amount } = payload;

      console.log('GET_BALANCE_SUCESS -> ', payload);
      const updatedWallets = wallets.map(item => {
        if (item.id === id) {
          item.balance.xrp = amount;

          return item;
        }

        return item;
      });

      storage.set('wallets', [...updatedWallets], function(err) {
        if (err) {
          console.log(err);
        }
      });
      // const {id, payload} = payload;
      return {
        ...state,
        wallets: updatedWallets
      };
    },
    [createTrustlineSuccess]: (state, payload) => {
      const id = payload;
      const { wallets } = state;
      const copyWallets = [...wallets];
      const updatedWallets = copyWallets.map(wlt => {
        if (wlt.id === id) {
          wlt.trustline = true;
        }

        return wlt;
      });

      storage.set('wallets', [...updatedWallets], function(err) {
        if (err) {
          console.log(err);
        }
      });

      return {
        ...state,
        wallets: updatedWallets
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
      storage.set('defaultCurrency', { currency: payload }, function(err) {
        if (err) {
          console.log('ERROR', err);
        }
      });

      let symbol = '$';

      switch (payload) {
        case 'gbp':
          symbol = '£';
          break;
        case 'eur':
          symbol = '€';
          break;
        case 'aed':
          symbol = 'د.إ';
          break;
        case 'jpy':
          symbol = '¥';
          break;
        default:
          symbol = '$';
      }

      return {
        ...state,
        currency: payload,
        symbol: symbol
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
    wallets: wallets,
    modal: modal,
    walletOptions: walletOptions,
    connection: connection,
    marketData: marketData,
    marketSevens: marketSevens,
    currentWallet: currentWallet,
    transactions: transactions,
    transferInProgress: transferInProgress
  });
}
