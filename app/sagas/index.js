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

import { testingSaga, addNewWallet, fillNewWallet } from '../actions/index';
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

// ADD NEW WALLET
function* addNewWalletSaga() {
  yield takeLatest(`${addNewWallet}`, getTrustlineCall);
}

function getTrustline(address, issuer) {}

function* getTrustlineCall(data) {
  try {
    console.log('SAGAS TRUSTLINE', data);
    yield put(fillNewWallet(data));
  } catch (e) {
    console.log(e);
  }
}

export default function* rootSaga() {
  yield all([fork(testingSagaSaga), fork(addNewWalletSaga)]);
}
