export const initState = {
  isAuthUser: !!localStorage.getItem('user'),
  logInLoading: false,
  logInDone: false,
  logInError: null,
  logOutLoading: false,
  logOutDone: false,
  logOutError: null,
  getmeLoading: false,
  getmeDone: false,
  getmeError: null,
  emailVerifyLoading: false,
  emailVerify: false,
  VerifyRequest: false,
  VerifyRequestLoading: false,
  signUpLoading: false,
  signUpDone: false,
  signUpError: null,
  user: JSON.parse(localStorage.getItem('user')) || {},
  loginData: {},
};

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const GET_ME_REQUEST = 'GET_ME_REQUEST';
export const GET_ME_SUCCESS = 'GET_ME_SUCCESS';
export const GET_ME_FAILURE = 'GET_ME_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const EMAIL_VERIFY_REQUEST = 'EMAIL_VERIFY_REQUEST';
export const EMAIL_VERIFY_SUCCESS = 'EMAIL_VERIFY_SUCCESS';
export const EMAIL_VERIFY_FAILURE = 'EMAIL_VERIFY_FAILURE';

export const VERIFY_REQUEST_REQUEST = 'VERIFY_REQUEST_REQUEST';
export const VERIFY_REQUEST_SUCCESS = 'VERIFY_REQUEST_SUCCESS';
export const VERIFY_REQUEST_FAILURE = 'VERIFY_REQUEST_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const URL_PAGE_REQUEST = 'URL_PAGE_REQUEST';

// 액션 함수 정의
export const emailVerifyRequestAction = (data) => ({
  type: EMAIL_VERIFY_REQUEST,
  data,
});

export const loginRequestAction = (data) => ({
  type: LOG_IN_REQUEST,
  data,
});
export const getMeRequestAction = () => ({
  type: GET_ME_REQUEST,
});
export const logoutRequestAction = () => ({
  type: LOG_OUT_REQUEST,
});
export const signupRequestAction = (data) => ({
  type: SIGN_UP_REQUEST,
  data,
});
export const VerifyRequestAction = (data) => ({
  type: VERIFY_REQUEST_REQUEST,
  data,
});
/**
 * @function user
 * @description user Reducer
 */
// user Reducer
const user = (state = initState, action) => {
  switch (action.type) {
    case LOG_IN_REQUEST:
      return {
        ...state,
        isAuthUser: true,
        logInLoading: true,
        logInDone: false,
        logInError: null,
      };
    case LOG_IN_SUCCESS:
      return {
        ...state,
        user: action.data,
        isAuthUser: true,
        logInLoading: false,
        logInDone: true,
        logInError: null,
      };
    case LOG_IN_FAILURE:
      return {
        ...state,
        isAuthUser: true,
        logInLoading: false,
        logInDone: true,
        logInError: action.error,
      };
    case GET_ME_REQUEST:
      return {
        ...state,
        isAuthUser: true,
        getmeLoading: true,
        getmeDone: false,
        getmeError: null,
      };
    case GET_ME_SUCCESS:
      return {
        ...state,
        user: action.data,
        isAuthUser: true,
        getmeLoading: false,
        getmeDone: true,
        getmeError: null,
      };
    case GET_ME_FAILURE:
      return {
        ...state,
        isAuthUser: true,
        getmeLoading: false,
        getmeDone: true,
        getmeError: action.error,
      };
    case LOG_OUT_REQUEST:
      return {
        ...state,
        logOutLoading: true,
        logOutDone: false,
        logOutError: null,
      };
    case EMAIL_VERIFY_REQUEST:
      return {
        emailVerifyLoading: true,
      };
    case EMAIL_VERIFY_SUCCESS:
      return {
        emailVerify: true,
        emailVerifyLoading: false,
      };
    case EMAIL_VERIFY_FAILURE:
      return {
        emailVerify: false,
        emailVerifyLoading: false,
      };

    case VERIFY_REQUEST_REQUEST:
      return {
        VerifyRequestLoading: true,
      };
    case VERIFY_REQUEST_SUCCESS:
      return {
        VerifyRequest: true,
        VerifyRequestLoading: false,
      };
    case VERIFY_REQUEST_FAILURE:
      return {
        VerifyRequesty: false,
        VerifyRequestLoading: false,
      };

    case SIGN_UP_REQUEST:
      return {
        ...state,
        signUpLoading: true,
        signUpDone: false,
        signUpError: null,
      };
    case SIGN_UP_SUCCESS:
      return {
        ...state,
        signUpLoading: false,
        signUpDone: true,
        signUpError: null,
      };
    case SIGN_UP_FAILURE:
      return {
        ...state,
        signUpLoading: false,
        signUpDone: false,
        signUpError: action.error,
      };
    default:
      return state;
  }
};
export default user;
