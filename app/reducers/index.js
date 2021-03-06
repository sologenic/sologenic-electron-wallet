//     Sologenic Wallet, Decentralized Wallet. Copyright (C) 2020 Sologenic

//     This program is free software: you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation, either version 3 of the License, or
//     (at your option) any later version.

//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.

//     You should have received a copy of the GNU General Public License
//     along with this program.  If not, see <https://www.gnu.org/licenses/>.

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
  getTransactionsSuccess,
  createTrustlineSuccess,
  transferXrpSuccess,
  transferSoloSuccess,
  cleanTransferInProgress,
  fillSoloPrice,
  fillRippleFee,
  createTrustlineError,
  cleanTrustlineError,
  cleanDefaultFiat,
  changeTabOnView,
  fillEmailResponse
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
  soloPrice: {
    price: null,
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
  },
  rippleFee: {
    fee: null,
    updated: false
  },
  trustlineError: {
    error: false,
    updated: false
  },
  tabOnView: {
    view: 'xrp'
  },
  emailResponse: {
    added: false,
    updated: false
  }
};

const emailResponse = createReducer(
  {
    [fillEmailResponse]: (state, payload) => {
      return {
        ...state,
        added: payload.added,
        updated: true
      };
    }
  },
  initial.emailResponse
);

const tabOnView = createReducer(
  {
    [changeTabOnView]: (state, payload) => {
      return {
        ...state,
        view: payload
      };
    }
  },
  initial.tabOnView
);

const trustlineError = createReducer(
  {
    [createTrustlineError]: (state, payload) => {
      return {
        ...state,
        error: true,
        reason: payload.reason
          ? payload.reason
          : 'Something went wrong! Please try again later!',
        updated: true
      };
    },
    [cleanTrustlineError]: (state, payload) => {
      return {
        ...state,
        error: false,
        updated: false
      };
    }
  },
  initial.trustlineError
);

const rippleFee = createReducer(
  {
    [fillRippleFee]: (state, payload) => {
      return {
        ...state,
        fee: payload,
        updated: true
      };
    }
  },
  initial.rippleFee
);

const soloPrice = createReducer(
  {
    [fillSoloPrice]: (state, payload) => {
      return {
        ...state,
        price: payload,
        updated: true
      };
    }
  },
  initial.soloPrice
);

const transferInProgress = createReducer(
  {
    [transferXrpSuccess]: (state, payload) => {
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
    [transferSoloSuccess]: (state, payload) => {
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
      return {
        ...state,
        transactions: {
          txs: payload,
          currentLedger: payload.currentLedger
        },
        updated: true
      };
    }
  },
  initial.transactions
);

const marketSevens = createReducer(
  {
    [getMarketSevensSuccess]: (state, payload) => {
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
      const { id, amountXrp, amountSolo } = payload;

      const updatedWallets = wallets.map(item => {
        if (item.id === id) {
          item.balance.xrp = amountXrp;
          item.balance.solo = amountSolo;

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
          rippleClassicAddress: payload.rippleClassicAddress,
          passphraseProvisional: payload.passphraseProvisional
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
    },
    [cleanDefaultFiat]: (state, payload) => {
      storage.remove('defaultCurrency');

      return {
        ...state,
        currency: 'usd',
        symbol: '$'
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
    transactions: transactions,
    transferInProgress: transferInProgress,
    soloPrice: soloPrice,
    rippleFee: rippleFee,
    trustlineError: trustlineError,
    tabOnView: tabOnView,
    emailResponse: emailResponse
  });
}
