import { fork, put, takeLatest, call, all } from 'redux-saga/effects';
import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  GET_ME_REQUEST,
  GET_ME_SUCCESS,
  GET_ME_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  EMAIL_VERIFY_REQUEST,
  EMAIL_VERIFY_SUCCESS,
  EMAIL_VERIFY_FAILURE,
  VERIFY_REQUEST_REQUEST,
  VERIFY_REQUEST_SUCCESS,
  VERIFY_REQUEST_FAILURE,
  SIGN_UP_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  URL_PAGE_REQUEST,
} from '../actions/user';
import axios from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createAction, handleAction, handleActions } from 'redux-actions';
import * as authAPI from '../../api/auth';
import createRequestSaga, { createRequestActionTypes } from '../../library/createRequestSaga';

// 새로고침 이후 임시 로그인 처리
const TEMP_SET_USER = 'user/TEMP_SET_USER';
// 회원정보 확인
const [CHECK, CHECK_SUCCESS, CHECK_FAILURE] = createRequestActionTypes('user/CHECK');

export const tempSetUser = createAction(TEMP_SET_USER, (user) => user);
export const check = createAction(CHECK);

const checkSaga = createRequestSaga(CHECK, authAPI.check);
export function* userSaga() {
  yield takeLatest(CHECK, checkSaga);
}

const initialState = {
  user: null,
  checkError: null,
};

export default handleActions(
  {
    [TEMP_SET_USER]: (state, { payload: user }) => ({
      ...state,
      user,
      checkError: null,
    }),
    [CHECK_FAILURE]: (state, { payload: error }) => ({
      ...state,
      user: null,
      checkError: error,
    }),
  },
  initialState,
);

function logInAPI(data) {
  return axios.post('/user/login', data, { withCredentials: true });
  // headers: {
  //   Accept: 'application/json',
  //   'Content-Type': 'application/json',
  // },
  // credentials: 'same-origin',
}

function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data);
    const link = action.data.history;
    if (result.data.response === 'success') {
      yield put({
        type: LOG_IN_SUCCESS,
        data: result.data.data,
      });
      alert('로그인 성공했습니다.');
      link.push('/blockfish');
    } else {
      yield put({
        type: LOG_IN_FAILURE,
        data: result.data,
      });
      alert('로그인 실패했습니다.');
    }
  } catch (err) {
    console.error(err);
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response,
    });
  }
}

function getMeAPI() {
  return axios.get('/user/me', { withCredentials: true });
}

function* getMe(action) {
  try {
    const result = yield call(getMeAPI);
    if (result.data.response === 'success') {
      yield put({
        type: GET_ME_SUCCESS,
        data: result.data.data,
      });
    } else {
      yield put({
        type: GET_ME_FAILURE,
        data: result.data,
      });
    }
  } catch (err) {
    yield put({
      type: GET_ME_FAILURE,
      error: err.response,
    });
  }
}

function logoutAPI(data) {
  return axios.post('/user/logout');
}

function* logout(action) {
  try {
    const result = yield call(logoutAPI);
    if (result.data.response === 'success') {
      yield put({
        type: LOG_OUT_SUCCESS,
        data: result.data,
      });
    } else {
      yield put({
        type: LOG_OUT_FAILURE,
        data: result.data,
      });
    }
  } catch (error) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: error.response.data,
    });
  }
}

function emailVerifyAPI(data) {
  return axios.post('/user/duplicate', data);
}

function* emailVerify(action) {
  try {
    const result = yield call(emailVerifyAPI, action.data);
    if (result.data.response === 'success') {
      yield put({
        type: EMAIL_VERIFY_SUCCESS,
        data: result.data,
      });
    } else {
      yield put({
        type: EMAIL_VERIFY_FAILURE,
        data: result.data,
      });
    }
  } catch (err) {
    console.log(err);
    yield put({
      type: EMAIL_VERIFY_FAILURE,
      error: err.response.data,
    });
  }
}

function VerifyRequestAPI(data) {
  return axios.post('/user/verify', data);
}

function* VerifyRequest(action) {
  try {
    const result = yield call(VerifyRequestAPI, action.data);
    if (result.data.response === 'success') {
      yield put({
        type: VERIFY_REQUEST_SUCCESS,
        data: result.data,
      });
    } else {
      yield put({
        type: VERIFY_REQUEST_FAILURE,
        data: result.data,
      });
    }
  } catch (err) {
    console.log(err);
    yield put({
      type: VERIFY_REQUEST_FAILURE,
      error: err.response.data,
    });
  }
}

function signUpAPI(data) {
  return axios.post('/user/signup', data);
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    const link = action.data.history;

    // yield delay(1000);
    if (result.data.response === 'success') {
      yield put({
        type: SIGN_UP_SUCCESS,
        data: result.data,
      });
      alert('회원가입 성공했습니다.');
      link.push('/login');
      yield call(VerifyRequestAPI, action);
    } else {
      yield put({
        type: SIGN_UP_FAILURE,
        data: result.data,
      });
      console.log(result.data);
      alert('회원가입에 실패했습니다.' + result.data.data.split(':')[1]);
    }
  } catch (err) {
    console.error(err);
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    });
    alert('회원가입에 실패했습니다.');
  }
}

function urlpageAPI(data) {
  return axios.get('/user/verify/{key}', data);
}

function* urlpage(action) {
  try {
    const result = yield call(urlpageAPI, action.data);
    const link = action.data.history;

    if (result.data.response === 'success') {
      link.push('/login');
    } else {
      alert('메일 전송에 실패했습니다.');
    }
  } catch (err) {
    alert('메일전송에 실패했습니다.');
  }
}

function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}

function* watchGetMe() {
  yield takeLatest(GET_ME_REQUEST, getMe);
}

function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logout);
}

function* watchEmailVerify() {
  yield takeLatest(EMAIL_VERIFY_REQUEST, emailVerify);
}

function* watchVerifyRequest() {
  yield takeLatest(VERIFY_REQUEST_REQUEST, VerifyRequest);
}

function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

function* watchUrlpage() {
  yield takeLatest(URL_PAGE_REQUEST, urlpage);
}

// API 호출 SAGA
export function* fetchUserSaga() {
  yield all([
    fork(watchLogIn),
    fork(watchGetMe),
    fork(watchSignUp),
    fork(watchEmailVerify),
    fork(watchLogOut),
    fork(watchVerifyRequest),
    fork(watchUrlpage),
  ]);
}
