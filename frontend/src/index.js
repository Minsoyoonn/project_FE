import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';
import './styles/global.scss';
import 'slick-carousel/slick/slick.css'; // Slick Carousel css
import 'slick-carousel/slick/slick-theme.css'; // Slick Carousel css
import App from './App';

import rootReducer, { rootSaga } from './modules/reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import { tempSetUser, check } from './modules/sagas/user';
import createSagaMiddleware from '@redux-saga/core';


const sagaMiddleware = createSagaMiddleware();
const reduxStore = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

function loadUser(){
  try{
    const user = localStorage.getItem('user');
    if(!user) return; // 로그인 상태가 아니라면 아무것도 안 함

    reduxStore.dispatch(tempSetUser(JSON.parse(user)));
    reduxStore.dispatch(check());
  } catch(e) {
    console.log('localStorage is not working');
  }
}

sagaMiddleware.run(rootSaga);
loadUser();




ReactDOM.render(
  <Provider store={reduxStore}>
    <CookiesProvider>
      <App/>
    </CookiesProvider>
  </Provider>,
  document.getElementById('root'),
);
