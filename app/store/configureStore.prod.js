// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from '../reducers';
import createSagaMiddleware from 'redux-saga';
import saga from '../sagas/index';

const history = createHashHistory();
const rootReducer = createRootReducer(history);
const router = routerMiddleware(history);
const sagaMiddleware = createSagaMiddleware();
const enhancer = applyMiddleware(thunk, router, sagaMiddleware);

function configureStore(initialState) {
  // sagaMiddleware.run(saga).done.catch(err => console.warn('PROD SAGA', err));

  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
