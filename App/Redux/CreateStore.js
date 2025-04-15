import {createStore, applyMiddleware, compose} from 'redux';
import Config from '../Config/DebugConfig';
import createSagaMiddleware from 'redux-saga';
import ScreenTracking from './ScreenTrackingMiddleware';
import {persistStore, persistReducer} from 'redux-persist';
import ReduxPersist from '../Config/ReduxPersist';

import {appNavigatorMiddleware} from '../Navigation/ReduxNavigation';

// creates the store
export default (rootReducer, rootSaga) => {
  /* ------------- Redux Configuration ------------- */

  const middleware = [];
  const enhancers = [];

  /* ------------- Navigation Middleware ------------ */
  // const navigationMiddleware = createReactNavigationReduxMiddleware(
  //   'root',
  //   state => state.nav
  // )
  // middleware.push(navigationMiddleware)
  middleware.push(appNavigatorMiddleware);

  /* ------------- Analytics Middleware ------------- */
  middleware.push(ScreenTracking);

  /* ------------- Saga Middleware ------------- */

  const sagaMonitor = Config.useReactotron
    ? console.tron.createSagaMonitor()
    : null;
  const sagaMiddleware = createSagaMiddleware({sagaMonitor});
  middleware.push(sagaMiddleware);

  const createDebugger = require('redux-flipper').default;
  middleware.push(createDebugger());

  /* ------------- Assemble Middleware ------------- */

  enhancers.push(applyMiddleware(...middleware));

  // if Reactotron is enabled (default for __DEV__), we'll create the store through Reactotron
  const createAppropriateStore = Config.useReactotron
    ? console.tron.createStore
    : createStore;
  const persistedReducer = persistReducer(
    ReduxPersist.storeConfig,
    rootReducer,
  );
  const store = createAppropriateStore(persistedReducer, compose(...enhancers));
  const persistor = persistStore(store);

  // kick off root saga
  let sagasManager = sagaMiddleware.run(rootSaga);

  return {
    persistor,
    store,
    sagasManager,
    sagaMiddleware,
  };
};
