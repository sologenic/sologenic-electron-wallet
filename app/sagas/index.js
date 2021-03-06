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

require('dotenv').config();

import {
  fork,
  take,
  call,
  put,
  cancel,
  race,
  takeEvery,
  takeLatest,
  all
} from 'redux-saga/effects';

import {
  addNewWallet,
  fillNewWallet,
  connectToRippleApi,
  getBalance,
  setConnection,
  getBalanceSuccess,
  getMarketData,
  getMarketDataSuccess,
  getMarketDataError,
  getMarketSevens,
  getMarketSevensSuccess,
  getTransactions,
  getTransactionsSuccess,
  getTransactionsError,
  createTrustlineRequest,
  createTrustlineSuccess,
  createTrustlineError,
  transferXRP,
  transferXrpSuccess,
  transferSOLO,
  transferSoloSuccess,
  getSoloPrice,
  fillSoloPrice,
  fetchRippleFee,
  fillRippleFee,
  checkForExistingTrustline,
  joinNewsletter,
  fillEmailResponse
} from '../actions/index';
import {
  createSevensObj,
  sologenic,
  filterTransactions
} from '../utils/utils2.js';
import configVars from '../utils/config';
import { create } from 'apisauce';

const soloWebsite = create({
  baseURL: 'https://sologenic.com/',
  timeout: 10000
});

const api = create({
  baseURL: 'https://api.coinfield.com/v1/',
  headers: {
    post: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  timeout: 10000
});

const ops = create({
  baseURL: 'https://ops.coinfield.com',
  headers: {
    post: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  timeout: 10000
});

const mediatorApi = create({
  baseURL: 'https://mediator.coinfield.com/',
  headers: {
    post: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  },
  timeout: 10000
});

const getMarketSevensApi = () => mediatorApi.get('seven');

// JOIN NEWSLETTER
function* joinNewsletterSaga() {
  yield takeLatest(`${joinNewsletter}`, joinNewsletterCall);
}

function* joinNewsletterCall(data) {
  try {
    const email = data.payload;

    const response = yield soloWebsite.post(
      `newsletter-solo-wallet?email=${email}`
    );

    if (response) {
      yield put(fillEmailResponse(response.data));
    }
  } catch (e) {
    console.log('JOIN_NEWSLETTER_ERROR ->', e);
  }
}

// FETCH RIPPLE FEE
function* fetchRippleFeeSaga() {
  yield takeLatest(`${fetchRippleFee}`, fetchRippleFeeCall);
}

function* fetchRippleFeeCall() {
  try {
    const ripple = yield sologenic.getRippleApi();
    const rippleFee = yield ripple.getFee();

    if (rippleFee) {
      yield put(fillRippleFee(rippleFee));
    }
  } catch (e) {
    console.log('FETCH_RIPPLE_SAGA_ERROR', e);
  }
}

// TRANSFER XRP
function* transferXRPSaga() {
  yield takeLatest(`${transferXRP}`, transferXRPCall);
}

const transferXrp = (account, destination, value, tag) => {
  const valueAmount = Number(value) / 0.000001;

  if (tag) {
    return sologenic.submit({
      TransactionType: 'Payment',
      Account: account,
      Destination: destination,
      Amount: `${valueAmount.toFixed()}`,
      DestinationTag: Number(tag)
    });
  }

  return sologenic.submit({
    TransactionType: 'Payment',
    Account: account,
    Destination: destination,
    Amount: `${valueAmount.toFixed()}`
  });
};

function* transferXRPCall(data) {
  try {
    const { account, keypair, destination, value, secret, tag } = data.payload;

    var isValidSecret;
    var isValidPrivate;

    if (secret !== '') {
      isValidSecret = sologenic.getRippleApi().isValidSecret(secret);
    }

    if (typeof keypair.privateKey !== 'undefined') {
      const isValidPrivateKey = /[0-9A-Fa-f]{66}/g;

      isValidPrivate = isValidPrivateKey.test(keypair.privateKey);
    }

    if (isValidSecret || isValidPrivate) {
      yield call(setAccount, account, secret, keypair);
      const tx = yield call(transferXrp, account, destination, value, tag);
      const response = yield tx.promise;
      if (response) {
        yield put(transferXrpSuccess(response));
      }
    } else {
      const badSecret = {
        result: {
          reason: 'localWRONG_PASSWORD',
          status: 'failed'
        }
      };

      yield put(transferXrpSuccess(badSecret));
    }

    // const secret = keypair ? keypair : '';
  } catch (e) {
    console.log('TRANSFER_XRP_ERROR ->', e);
  }
}

// TRANSFER SOLO
function* transferSOLOSaga() {
  yield takeLatest(`${transferSOLO}`, transferSOLOCall);
}

const transferSolo = (account, destination, value, tag) => {
  if (tag) {
    return sologenic.submit({
      TransactionType: 'Payment',
      Account: account,
      Destination: destination,
      DestinationTag: Number(tag),
      SendMax: {
        currency: configVars.soloHash,
        issuer: configVars.soloIssuer,
        value: value
      },
      Amount: {
        currency: configVars.soloHash,
        issuer: configVars.soloIssuer,
        value: String(Number(value) - Number(value) * 0.0001)
      }
    });
  }

  return sologenic.submit({
    TransactionType: 'Payment',
    Account: account,
    Destination: destination,
    SendMax: {
      currency: configVars.soloHash,
      issuer: configVars.soloIssuer,
      value: value
    },
    Amount: {
      currency: configVars.soloHash,
      issuer: configVars.soloIssuer,
      value: String(Number(value) - Number(value) * 0.0001)
    }
  });
};

function* transferSOLOCall(data) {
  try {
    const { account, keypair, destination, value, secret, tag } = data.payload;

    var isValidSecret;
    var isValidPrivate;

    if (secret !== '') {
      isValidSecret = sologenic.getRippleApi().isValidSecret(secret);
    }

    if (typeof keypair.privateKey !== 'undefined') {
      const isValidPrivateKey = /[0-9A-Fa-f]{66}/g;

      isValidPrivate = isValidPrivateKey.test(keypair.privateKey);
    }

    if (isValidSecret || isValidPrivate) {
      yield call(setAccount, account, secret, keypair);
      const tx = yield call(transferSolo, account, destination, value, tag);
      const response = yield tx.promise;
      if (response) {
        yield put(transferSoloSuccess(response));
      }
    } else {
      const badSecret = {
        result: {
          reason: 'localWRONG_PASSWORD',
          status: 'failed'
        }
      };

      yield put(transferSoloSuccess(badSecret));
    }
  } catch (e) {
    console.log('TRANSFER_SOLO_ERROR -> ', e);
  }
}

// CREATE TRUSTLINE
function* createTrustlineSaga() {
  yield takeLatest(`${createTrustlineRequest}`, createTrustlineCall);
}

const setAccount = (address, secret, keypair) => {
  if (keypair.publicKey) {
    return sologenic.setAccount({
      address,
      keypair
    });
  }

  return sologenic.setAccount({
    address,
    secret
    // secret: 'ssyBY4mUyoXJoMKqKbqfZJQSzPo6H'
  });
};

const setTrustline = account => {
  const solo = '534F4C4F00000000000000000000000000000000';
  return sologenic.submit({
    TransactionType: 'TrustSet',
    Account: account,
    LimitAmount: {
      currency: solo,
      issuer: configVars.soloIssuer,
      // issuer: 'rEFgkRo5BTxXJiLVYMdEnQQ9J9Kj1F3Yvi', //this is a test issuer for solo which is generated by sologenic-issuarance
      value: configVars.soloIssuerValue
    },
    // Flags: 0x00020000
    Flags: configVars.soloFlags
  });
};

function* checkForExistingTrustlineSaga() {
  yield takeLatest(
    `${checkForExistingTrustline}`,
    checkForExistingTrustlineCall
  );
}

function* checkForExistingTrustlineCall(data) {
  try {
    const { address, secret, keypair, id } = data.payload;

    yield call(setAccount, address, secret, keypair);

    const ripple = sologenic.getRippleApi();
    const ts = yield ripple.getTrustlines(address, {
      counterparty: configVars.soloIssuer
    });

    if (ts.length > 0) {
      yield put(createTrustlineSuccess(id));
    }
  } catch (e) {
    console.log('CHECK_FOR_EXISTING_TRUSTLINE_ERROR ->', e);
  }
}

function* createTrustlineCall(data) {
  try {
    const { address, secret, keypair, id } = data.payload;

    var isValidSecret = false;
    var isValidPrivate = false;

    if (secret !== '') {
      isValidSecret = sologenic.getRippleApi().isValidSecret(secret);
    }

    if (typeof keypair.privateKey !== 'undefined') {
      const isValidPrivateKey = /[0-9A-Fa-f]{66}/g;

      isValidPrivate = isValidPrivateKey.test(keypair.privateKey);
    }

    if (isValidSecret || isValidPrivate) {
      yield call(setAccount, address, secret, keypair);

      const ripple = sologenic.getRippleApi();
      const ts = yield ripple.getTrustlines(address, {
        counterparty: configVars.soloIssuer
      });

      if (ts.length > 0) {
        yield put(createTrustlineSuccess(id));
      } else {
        const tx = yield call(setTrustline, address);

        const response = yield tx.promise;

        if (response.result && response.result.status === 'failed') {
          yield put(createTrustlineError());
        } else {
          yield put(createTrustlineSuccess(id));
        }
      }
    } else {
      yield put(createTrustlineError({ reason: 'Wrong Password!' }));
    }
  } catch (e) {
    console.log('CREATE_TRUSTLINE_ERROR ->', e);
    yield put(createTrustlineError());
  }
}

// GET SOLO PRICE
function* getSoloPriceSaga() {
  yield takeLatest(`${getSoloPrice}`, getSoloPriceCall);
}

const getSoloPriceOps = () => ops.get('/solo_rates.json');

function* getSoloPriceCall() {
  try {
    const response = yield call(getSoloPriceOps);

    if (response) {
      yield put(fillSoloPrice(response.data));
    }
  } catch (e) {
    console.log('GET_SOLO_PRICE_ERROR', e);
  }
}

// GET TRANSACTIONS
function* getTransactionsSaga() {
  yield takeLatest(`${getTransactions}`, getTransactionsCall);
}

const getTransactionsApi = async (address, limit) => {
  const rippleApi = sologenic.getRippleApi();
  const currentLedger = await rippleApi.getLedgerVersion();
  const serverInfo = await rippleApi.getServerInfo();
  const ledgers = serverInfo.completeLedgers.split('-');
  const minLedgerVersion = Number(ledgers[0]);
  const maxLedgerVersion = Number(ledgers[1]);

  let txs = await rippleApi.getTransactions(address, {
    minLedgerVersion: minLedgerVersion,
    maxLedgerVersion: maxLedgerVersion,
    limit
  });

  let txsObj = {
    txs,
    currentLedger
  };

  return txsObj;
};

const getFormattedTransactions = async transactions => {
  const rippleApi = sologenic.getRippleApi();
  const currentLedger = await rippleApi.getLedgerVersion();
  const formattedTransactions = filterTransactions(transactions, currentLedger);
  return formattedTransactions;
};

function* getTransactionsCall(data) {
  try {
    const { address, limit } = data.payload;
    const response = yield call(getTransactionsApi, address, limit);

    const { xrpTransactions, soloTransactions } = yield call(
      getFormattedTransactions,
      response.txs
    );

    if (response) {
      yield put(
        getTransactionsSuccess({
          xrpTransactions,
          soloTransactions,
          currentLedger: response.currentLedger
        })
      );
    }
  } catch (e) {
    console.log('GET_TRANSACTION_ERROR -> ', e);
  }
}

// GET MARKET SEVENS
function* getMarketSevensSaga() {
  yield takeLatest(`${getMarketSevens}`, getMarketSevensCall);
}

function* getMarketSevensCall(data) {
  try {
    const response = yield call(getMarketSevensApi);

    if (response.ok) {
      const sevenObj = yield createSevensObj(response.data);
      yield put(getMarketSevensSuccess(sevenObj));
    }
  } catch (e) {
    console.log('GET_MARKET_SEVENS_ERROR ->', e);
  }
}

// GET MARKET DATA
function* getMarketDataSaga() {
  yield takeLatest(`${getMarketData}`, getMarketDataCall);
}

const getMarketDataApi = defaultCurrency =>
  api.get(`tickers/xrp${defaultCurrency}`);

function* getMarketDataCall(data) {
  try {
    const { defaultFiat } = data.payload;

    const response = yield call(getMarketDataApi, defaultFiat);
    if (response.ok) {
      yield put(getMarketDataSuccess(response.data.markets[0]));
    } else {
      yield put(getMarketDataError(response.data));
    }
  } catch (e) {
    console.log('GET_MARKET_DATA_ERROR -> ', e);
  }
}

// CONNECT TO RIPPLE API
function* connectToRippleApiSaga() {
  yield takeLatest(`${connectToRippleApi}`, connectToRippleApiCall);
}

function* connectToRippleApiCall() {
  try {
    const isConnected = sologenic.getRippleApi().isConnected();

    if (!isConnected) {
      yield sologenic.connect();
    }

    yield sologenic.on('queued', (id, tx) => {
      console.log('TX QUEUED: ', id, tx);
    });
    yield sologenic.on('dispatched', (id, tx) => {
      console.log('TX DISPATCHED:', id, tx);
    });
    yield sologenic.on('requeued', (id, tx) => {
      console.log('TX REQUEUED:', id, tx);
    });
    yield sologenic.on('warning', (id, type, tx) => {
      console.log('TX WARNING:', id, type, tx);
    });
    yield sologenic.on('validated', (id, tx) => {
      console.log('TX VALIDATED:', id, tx);
    });
    yield sologenic.on('failed', (id, type, tx) => {
      console.log('TX FAILED:', id, type, tx);
    });
  } catch (error) {
    console.log('REQUEST_CONNECT_RIPPLE_API_ERROR', error);
  }
}

// GET BALANCE
function* getBalanceSaga() {
  yield takeEvery(`${getBalance}`, requestBalance);
}

const getBalances = address => {
  const rippleApi = sologenic.getRippleApi();
  return rippleApi.getBalances(address);
};

function* requestBalance(data) {
  try {
    const { id, address } = data.payload;

    const response = yield call(getBalances, address);
    const xrpBalance = response.filter(item => item.currency === 'XRP');
    const soloBalance = response.filter(
      item => item.currency === configVars.soloHash
    );

    if (response) {
      yield put(
        getBalanceSuccess({
          id,
          amountXrp: Number(xrpBalance[0].value),
          amountSolo:
            soloBalance.length === 0 ? 0 : Number(soloBalance[0].value)
        })
      );
    }
  } catch (e) {
    console.log('REQUEST_BALANCE_ERROR -> ', e);
  }
}

export default function* rootSaga() {
  yield all([
    fork(connectToRippleApiSaga),
    fork(getBalanceSaga),
    fork(getMarketDataSaga),
    fork(getMarketSevensSaga),
    fork(getTransactionsSaga),
    fork(createTrustlineSaga),
    fork(transferXRPSaga),
    fork(transferSOLOSaga),
    fork(getSoloPriceSaga),
    fork(fetchRippleFeeSaga),
    fork(checkForExistingTrustlineSaga),
    fork(joinNewsletterSaga)
  ]);
}
