import { createAction } from 'redux-act';

export const setDefaultFiatCurrency = createAction('setDefaultFiatCurrency');
export const cleanDefaultFiat = createAction('cleanDefaultFiat');
export const setPinCode = createAction('setPinCode');
export const setTerms = createAction('setTerms');
export const changingPin = createAction('changingPin');
export const generateNewWallet = createAction('generateNewWallet');
export const addNewWallet = createAction('addNewWallet');
export const fillNewWallet = createAction('fillNewWallet');
export const fillWallets = createAction('fillWallets');
export const connectToRippleApi = createAction('connectToRippleApi');
export const getBalance = createAction('getBalance');
export const getBalanceSuccess = createAction('getBalanceSuccess');
export const setConnection = createAction('setConnection');

export const getMarketData = createAction('getMarketData');
export const getMarketDataSuccess = createAction('getMarketDataSuccess');
export const getMarketDataError = createAction('getMarketDataError');

export const getMarketSevens = createAction('getMarketSevens');
export const getMarketSevensSuccess = createAction('getMarketSevensSuccess');
export const getTransactions = createAction('getTransactions');
export const getTransactionsSuccess = createAction('getTransactionsSuccess');
export const getTransactionsError = createAction('getTransactionsError');

export const createTrustlineRequest = createAction('createTrustlineRequest');
export const createTrustlineSuccess = createAction('createTrustlineSuccess');
export const createTrustlineError = createAction('createTrustlineError');
export const cleanTrustlineError = createAction('cleanTrustlineError');
export const checkForExistingTrustline = createAction(
  'checkForExistingTrustline'
);

export const changeTabOnView = createAction('changeTabOnView');

export const transferXRP = createAction('transferXRP');
export const transferXrpSuccess = createAction('transferXrpSuccess');
export const cleanTransferInProgress = createAction('cleanTransferInProgress');
export const fetchRippleFee = createAction('fetchRippleFee');
export const fillRippleFee = createAction('fillRippleFee');

export const transferSOLO = createAction('transferSOLO');
export const transferSoloSuccess = createAction('transferSOLOSuccess');

export const getSoloPrice = createAction('getSoloPrice');
export const fillSoloPrice = createAction('fillSoloPrice');

export const changeWalletNickname = createAction('changeWalletNickname');
export const deleteWallet = createAction('deleteWallet');

export const closeModal = createAction('closeModal');
export const openModal = createAction('openModal');
export const openOptions = createAction('openOptions');
export const closeOptions = createAction('closeOptions');
