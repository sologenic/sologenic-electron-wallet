import { createAction } from 'redux-act';

// export const getDefaultFiatCurrency = () => {
//   return {
//     type: 'GET_DEFAULT_FIAT'
//   };
// };

export const setDefaultFiatCurrency = createAction('setDefaultFiatCurrency');
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

export const transferXRP = createAction('transferXRP');

export const changeWalletNickname = createAction('changeWalletNickname');
export const deleteWallet = createAction('deleteWallet');

export const closeModal = createAction('closeModal');
export const openModal = createAction('openModal');
export const openOptions = createAction('openOptions');
export const closeOptions = createAction('closeOptions');

export const testingSaga = createAction('testingSaga');

// export const getMarketData = () => {
//   return {
//     type: 'GET_MARKET_DATA'
//   };
// };

// export const getMarketDataSuccess = data => {
//   return {
//     type: 'GET_MARKET_DATA_SUCCESS',
//     payload: data
//   };
// };

// export const getMarketDataError = data => {
//   return {
//     type: 'GET_MARKET_DATA_ERROR',
//     payload: data
//   };
// };

// export const getMarketSevens = () => {
//   return {
//     type: 'GET_MARKET_SEVENS'
//   };
// };

// export const getMarketSevensSuccess = data => {
//   return {
//     type: 'GET_MARKET_SEVENS_SUCCESS',
//     payload: data
//   };
// };

// export const getMarketSevensError = data => {
//   return {
//     type: 'GET_MARKET_SEVENS_ERROR',
//     payload: data
//   };
// };

// export const testTodoReset = () => {
//   return {
//     type: 'TEST_TODO_RESET'
//   };
// };

// export const updatePhraseTestValue1 = value => {
//   return {
//     type: 'UPDATE_PHRASE_TEST_VALUE_1',
//     value
//   };
// };

// export const updatePhraseTestValue2 = value => {
//   return {
//     type: 'UPDATE_PHRASE_TEST_VALUE_2',
//     value
//   };
// };

// export const updatePhraseTestValue3 = value => {
//   return {
//     type: 'UPDATE_PHRASE_TEST_VALUE_3',
//     value
//   };
// };

// export const getBalance = () => {
//   return {
//     type: 'GET_BALANCE'
//   };
// };

// export const getBalanceSuccess = data => {
//   return {
//     type: 'GET_BALANCE_SUCCESS',
//     payload: data
//   };
// };

// export const getBalanceError = data => {
//   return {
//     type: 'GET_BALANCE_ERROR',
//     payload: data
//   };
// };

// export const postPaymentTransaction = (
//   address,
//   destinationAddress,
//   amountValue,
//   secret
// ) => {
//   return {
//     type: 'POST_PAYMENT_TRANSACTION',
//     address,
//     secret,
//     destinationAddress,
//     amountValue
//   };
// };

// export const postPaymentTransactionSuccess = data => {
//   return {
//     type: 'POST_PAYMENT_TRANSACTION_SUCCESS',
//     payload: data
//   };
// };

// export const postPaymentTransactionError = data => {
//   return {
//     type: 'POST_PAYMENT_TRANSACTION_ERROR',
//     payload: data
//   };
// };

// export const getListenToTransaction = account => {
//   return {
//     type: 'GET_LISTEN_TO_TRANSACTION',
//     account
//   };
// };

// export const getListenToTransactionSuccess = data => {
//   return {
//     type: 'GET_LISTEN_TO_TRANSACTION_SUCCESS',
//     payload: data
//   };
// };

// export const getListenToTransactionError = data => {
//   return {
//     type: 'GET_LISTEN_TO_TRANSACTION_ERROR',
//     payload: data
//   };
// };

// export const connectToRippleApi = () => {
//   return {
//     type: 'CONNECT_TO_RIPPLE_API'
//   };
// };

// export const connectToRippleApiSuccess = () => {
//   return {
//     type: 'CONNECT_TO_RIPPLE_API_SUCCESS'
//   };
// };

// export const connectToRippleApiError = () => {
//   return {
//     type: 'CONNECT_TO_RIPPLE_API_ERROR'
//   };
// };

// export const updateIsOrientationComplete = data => {
//   return {
//     type: 'UPDATE_ORIENTATION_COMPLETE',
//     payload: data
//   };
// };

// export const createPinSuccess = data => {
//   return {
//     type: 'CREATE_PIN',
//     payload: data
//   };
// };

// export const setupAuthentication = () => {
//   return {
//     type: 'SETUP_AUTH_SUCCESS'
//   };
// };

// export const authSuccess = () => {
//   return {
//     type: 'AUTH_SUCCESS'
//   };
// };
