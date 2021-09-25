import React, { useState } from 'react';
import TextDefault from '../../components/ui/TextDefault';
import { JoinContainer } from '../../styles/Join';
import { Button } from '@material-ui/core';
import { UserInfoFieldWrapper, UserInfoBottomWrapper, UserInfoInput } from '../../styles/MyPage';
import useInput from '../../hooks/useInput';
import { useStyles } from '../../styles/materialsStyle';
import { regExpPwd, debounce, isEmpty } from '../../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { signupRequestAction, emailVerifyRequestAction } from '../../modules/actions/user';
import { useHistory } from 'react-router-dom';

const JoinForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [email, onChangeEmail] = useInput('');
  const [name, onChangeName] = useInput('');

  const [password, setPassword] = useState('');
  const [pwdState, setPwdState] = useState(true);
  const [pwdCheck, setPwdCheck] = useState(true);
  const [error, setError] = useState('');

  /* verifyBtn - 버튼 눌림 확인
   * emailCondition - @ 포함 확인
   * emailVerify - api 호출 결과값
   * emailVerifyLoading - api 호출 로딩 후 */
  const [verifyBtn, setVerifyBtn] = useState(false);
  const [emailCondition, setEmailCondition] = useState(true);

  const { emailVerify } = useSelector((state) => ({
    emailVerify: state.user.emailVerify,
  }));
  const { emailVerifyLoading } = useSelector((state) => ({
    emailVerifyLoading: state.user.emailVerifyLoading,
  }));

  const history = useHistory();

  const onChangeEmailFunc = (e) => {
    onChangeEmail(e);
    setVerifyBtn(false);
  };

  const onCheckEmail = (e) => {
    e.preventDefault();
    setVerifyBtn(true);
    if (email.indexOf('@') === -1) {
      setEmailCondition(false);
    } else {
      dispatch(emailVerifyRequestAction({ email }));
      setEmailCondition(true);
    }
  };

  const [url, seturl] = useState('');

  // url 클릭시 로그인 페이지로 전송

  const onChangePwd = (e) => {
    if (e.target.value.length === 0 || e.target.value.length < 8 || e.target.value.length > 20) {
      setError('영문, 숫자, 특수문자 조합의 8~20자리 입니다.');
      setPwdState(false);
      return;
    }
    if (regExpPwd(e.target.value)) {
      setError('비밀번호 조건 충족');
      setPwdState(true);
    }
    setPassword(e.target.value);
  };

  const onCheckPwd = (e) => {
    const currentPwd = e.target.value;
    if (currentPwd === password) {
      setPwdCheck(true);
    } else {
      setPwdCheck(false);
    }
  };
  // 가입하기
  const handleSignup = (e) => {
    e.preventDefault();
    if (email.length === 0 || name.length === 0 || password.length === 0 || history.length === 0) {
      alert('필수입력사항을 채워주세요.');
      return;
    }

    if (email.indexOf('@') === -1) {
      alert('이메일에 "@"이 포함되야 합니다.');
      return;
    }

    if (!verifyBtn || !emailVerify) {
      alert('이메일 중복확인을 해주세요.');
      return;
    }

    if (!pwdCheck) {
      alert('비밀번호가 불일치합니다.');
      return;
    }

    if (pwdState) {
      const userId = email;
      dispatch(signupRequestAction({ userId, email, name, password, history }));
    } // 컴포넌트가 처음 렌더링 될 때, 초기화함
  };

  return (
    <>
      <JoinContainer>
        <TextDefault size="30px" weight="700">
          회원가입
        </TextDefault>
        <span style={{ marginRight: 60, alignSelf: 'flex-end' }}>
          <TextDefault size="14px" color="#FF0000">
            *필수입력사항입니다.
          </TextDefault>
        </span>
        <div>
          <form style={{ marginTop: 40 }} noValidate autoComplete="off" onSubmit={handleSignup}>
            <UserInfoFieldWrapper>
              <span style={{ width: 130 }}>
                <TextDefault width="100px" size="16px" color="#000000">
                  <span>이메일</span>
                </TextDefault>
              </span>
              <UserInfoInput
                type="email"
                className={`${classes.userInfoInput}`}
                onChange={onChangeEmailFunc}
              />
              <span style={{ marginLeft: 15 }}>
                {verifyBtn && !emailCondition && '이메일에는 @이 포함되야 합니다. 사용 불가능'}
                {verifyBtn && emailCondition && emailVerify && !emailVerifyLoading && '사용 가능'}
                {verifyBtn &&
                  emailCondition &&
                  !emailVerify &&
                  !emailVerifyLoading &&
                  '사용 불가능'}
                <Button
                  className={`${classes.emailChkBtn}`}
                  onClick={onCheckEmail}
                  disabled={email.length === 0}
                >
                  중복확인
                </Button>
              </span>
            </UserInfoFieldWrapper>
            <UserInfoFieldWrapper>
              <span style={{ width: 130 }}>
                <TextDefault width="100px" size="16px" color="#000000">
                  <span>이름</span>
                </TextDefault>
              </span>
              <UserInfoInput className={`${classes.userInfoInput}`} onChange={onChangeName} />
            </UserInfoFieldWrapper>
            <UserInfoFieldWrapper>
              <span style={{ width: 130 }}>
                <TextDefault size="16px" color="#000000">
                  <span>비밀번호</span>
                </TextDefault>
              </span>
              <UserInfoInput
                type="password"
                className={`${classes.userInfoInput}`}
                onChange={onChangePwd}
              />
              {error && (
                <span style={{ marginLeft: 5 }}>
                  <TextDefault size="14px" color="#000080">
                    {error}
                  </TextDefault>
                </span>
              )}
            </UserInfoFieldWrapper>
            <UserInfoFieldWrapper>
              <span style={{ width: 130 }}>
                <TextDefault size="16px" color="#000000">
                  <span>비밀번호 확인</span>
                </TextDefault>
              </span>
              <UserInfoInput
                type="password"
                className={`${classes.userInfoInput}`}
                onChange={onCheckPwd}
              />
              <span style={{ marginLeft: 5 }}>
                <TextDefault size="14px" color="#808080">
                  {pwdCheck ? '비밀번호 일치' : '비밀번호 불일치'}
                </TextDefault>
              </span>
            </UserInfoFieldWrapper>
            <UserInfoBottomWrapper>
              <Button type="submit" className={`${classes.joinFormBtn}`}>
                가입하기
              </Button>
            </UserInfoBottomWrapper>
          </form>
        </div>
      </JoinContainer>
    </>
  );
};

export default JoinForm;
