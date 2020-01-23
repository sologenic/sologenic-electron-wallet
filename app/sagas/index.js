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
  testingSaga,
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
  getMarketSevensSuccess
} from '../actions/index';
import { createSevensObj, sologenic } from '../utils/utils2.js';
import { create } from 'apisauce';

const api = create({
  baseURL: 'https://api.coinfield.com/v1/',
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

// TESTING SAGA
function* testingSagaSaga() {
  yield takeLatest(`${testingSaga}`, testingCall);
}

function* testingCall() {
  try {
    console.log('HELLO, SAGA READY!!!!');
  } catch (e) {
    console.log('EEEE');
  }
}

// GET MARKET SEVENS
function* getMarketSevensSaga() {
  yield takeLatest(`${getMarketSevens}`, getMarketSevensCall);
}

function* getMarketSevensCall(data) {
  try {
    // console.log('GET_MARKET_7 ->', data);

    const response = yield call(getMarketSevensApi);
    console.log('RESPONSE 7', response);

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

    console.log('GET_MARKET_DATA_CALL ->', response);
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
    yield sologenic.connect();

    yield sologenic.on('queued', (id, tx) => {
      console.log('TX QUEUED: ', id);
    });
    yield sologenic.on('dispatched', (id, tx) => {
      console.log('TX DISPATCHED:', id);
    });
    yield sologenic.on('requeued', (id, tx) => {
      console.log('TX REQUEUED:', id);
    });
    yield sologenic.on('warning', (id, type, tx) => {
      console.log('TX WARNING:', id, type, tx);
    });
    yield sologenic.on('validated', (id, tx) => {
      console.log('TX VALIDATED:', id);
    });
    yield sologenic.on('failed', (id, type, tx) => {
      console.log('TX FAILED:', id, type, tx);
    });
    console.log('start');

    yield put(setConnection(true));
  } catch (error) {
    // yield put(connectToRippleApiError());
    console.log('REQUEST_CONNECT_RIPPLE_API_ERROR', error);
    yield put(setConnection(false));
  }
}

// GET BALANCE
function* getBalanceSaga() {
  yield takeLatest(`${getBalance}`, requestBalance);
}

const getBalances = address => {
  const rippleApi = sologenic.getRippleApi();
  return rippleApi.getBalances(address);
};

function* requestBalance(data) {
  try {
    const { id, address } = data.payload;

    const response = yield call(getBalances, address);
    console.log('REQUEST_BALANCE_SAGA ->', response);
    const xrpBalance = response.filter(item => item.currency === 'XRP');

    if (response) {
      yield put(getBalanceSuccess({ id, amount: Number(xrpBalance[0].value) }));
    }
  } catch (e) {
    console.log('REQUEST_BALANCE_ERROR -> ', e);
  }
}

export default function* rootSaga() {
  yield all([
    fork(testingSagaSaga),
    // fork(addNewWalletSaga),
    fork(connectToRippleApiSaga),
    fork(getBalanceSaga),
    fork(getMarketDataSaga),
    fork(getMarketSevensSaga)
  ]);
}
