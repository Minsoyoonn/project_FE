import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { Button } from '@material-ui/core';

import MyPageLayout from '../../layouts/MyPageLayout';
import TextDefault from '../../components/ui/TextDefault';
import {
  UploadContainer,
  UploadContentItems,
  UploadContentItem,
  UploadInput,
  UploadBottomWrapper,
} from '../../styles/MyPage';
import useInput from '../../hooks/useInput';
import { useStyles } from '../../styles/materialsStyle';
import SelectDefault from '../../components/ui/SelectDefault';
import CheckboxWithLabel from '../../components/ui/CheckboxWithLabel';
import QuillEditor from '../../components/editor/QuillEditor';
import { isEmpty } from '../../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { reqFileUpload } from '../../modules/actions/fileUpload';
import useFileUpload from '../../hooks/useFileUpload';

const Upload = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  // const { data, error } = useSelector((state) => ({
  //   data: state.fileUpload.data,
  //   error: state.fileUpload.error,
  // }));
  const [filename, onChangeFilename] = useInput('');
  const [file, onChangeFile] = useFileUpload('');
  const [fileImage, onChangeFileImage] = useFileUpload('');
  const [checkedOs, setCheckedOs] = useState({
    window: false,
    mac: false,
    android: false,
    ios: false,
  });
  const [checkedPrice, setCheckedPrice] = useState({
    free: true,
  });
  const [largeMenu, setLargeMenu] = useState('');
  const [smallMenu, setSmallMenu] = useState('');

  const defaultString = 'TEST';
  const [content, setContent] = useState(defaultString);

  const fileInputRef = useRef('');
  const fileImageInputRef = useRef('');

  // 더미데이터
  const largeMenuList = [
    { id: 0, name: '관리/보안' },
    { id: 1, name: '백신' },
    { id: 2, name: '파일 압축' },
    { id: 3, name: '시스템 관리' },
    { id: 4, name: '동영상 녹화' },
    { id: 5, name: '동영상 플레이어' },
    { id: 6, name: '동영상 편집' },
    { id: 7, name: '동영상 코덱' },
    { id: 8, name: '브라우저' },
    { id: 9, name: '메신저' },
    { id: 10, name: '파일 전송' },
    { id: 11, name: '문서/사무' },
    { id: 12, name: '문서 뷰어' },
    { id: 13, name: '문서 편집' },
    { id: 14, name: '기타' },
  ];
  // const smallMenuList = [
  //   { id: 0, name: '소분류1' },
  //   { id: 1, name: '소분류2' },
  //   { id: 2, name: '소분류3' },
  // ];

  const onChangeCheckedOs = (e) => {
    setCheckedOs({ ...checkedOs, [e.target.name]: e.target.checked });
  };
  const onChangeCheckedPrice = (e) => {
    const obj = {
      paid: false,
      free: false,
    };
    setCheckedPrice({ ...obj, [e.target.name]: e.target.checked });
  };

  const onChangeLargeMenu = (e) => {
    setLargeMenu(e.target.value);
  };
  // const onChangeSmallMenu = (e) => {
  //   setSmallMenu(e.target.value);
  // };

  const onClickFileUploadBtn = () => {
    fileInputRef.current.click();
  };
  const onClickFileImageUploadBtn = () => {
    fileImageInputRef.current.click();
  };

  const onClickUpload = () => {
    if (isEmpty(filename)) {
      alert('파일명을 입력해주세요.');
      return;
    }
    if (isEmpty(fileImage)) {
      alert('파일을 첨부해주세요.');
      return;
    }
    if (!checkedOs.android && !checkedOs.ios && !checkedOs.window && !checkedOs.mac) {
      alert('OS를 선택해주세요.');
      return;
    }
    if (!checkedPrice.paid && !checkedPrice.free) {
      alert('가격을 선택해주세요.');
      return;
    }

    const fileUploadDto = {
      name: '',
      imageAddress: '',
      info: '',
      osType: '',
      categoryName: '문서/사무',
    };
    const formData = new FormData();
    formData.append('files', file);
    formData.append('image', fileImage);

    fileUploadDto.name = filename;
    fileUploadDto.imageAddress = null;
    fileUploadDto.info = content;
    fileUploadDto.osType = 'Mac';

    formData.append('fileUploadDto ', JSON.stringify(fileUploadDto));

    dispatch(reqFileUpload(formData));
  };

  // useEffect(() => {
  //   console.log('data', data);
  //   console.log('error', error);

  //   if (!isEmpty(data)) {
  //     alert('업로드가 ');
  //   }

  //   if (!isEmpty(error)) {
  //     alert('업로드에 실패했습니다. 다시 시도해주세요.');
  //     return;
  //   }
  // }, [data, error]);

  return (
    <>
      <MyPageLayout title="업로드" viewState={5}>
        {/* 업로드 화면 레이아웃 - 시작 */}
        <UploadContainer>
          <UploadContentItems>
            {/* 카테고리 - 시작 */}
            <UploadContentItem>
              <TextDefault size="16px" color="#000" width="150px">
                카테고리
              </TextDefault>

              <SelectDefault
                value={largeMenu}
                menuItems={largeMenuList}
                selectName="분류"
                onChangeMenu={onChangeLargeMenu}
              />

              {/* <SelectDefault
                value={smallMenu}
                menuItems={smallMenuList}
                selectName="소분류"
                onChangeMenu={onChangeSmallMenu}
              /> */}
            </UploadContentItem>
            {/* 카테고리 - 끝 */}

            {/* 파일명 - 시작 */}
            <UploadContentItem>
              <TextDefault size="16px" color="#000" width="150px">
                파일명
              </TextDefault>
              <UploadInput type="text" value={filename} onChange={onChangeFilename} />
            </UploadContentItem>
            {/* 파일명 - 끝 */}

            {/* 파일선택 - 시작 */}
            <UploadContentItem>
              <TextDefault size="16px" color="#000" width="150px">
                파일
              </TextDefault>
              <UploadInput
                type="text"
                value={isEmpty(file) ? '' : file.name}
                onChange={onChangeFile}
                readOnly
              />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                multiple
                type="file"
                ref={fileInputRef}
                onChange={onChangeFile}
              />
              <Button
                className={`${classes.fileSelctionBtn}`}
                style={{ marginLeft: '10px' }}
                onClick={onClickFileUploadBtn}
              >
                파일선택
              </Button>
            </UploadContentItem>
            {/* 파일선택 - 끝 */}

            {/* 파일이미지 - 시작 */}
            <UploadContentItem>
              <TextDefault size="16px" color="#000" width="150px">
                파일 이미지
              </TextDefault>
              <UploadInput
                type="text"
                value={isEmpty(fileImage) ? '' : fileImage.name}
                onChange={onChangeFileImage}
                readOnly
              />
              <input
                accept="image/*"
                style={{ display: 'none' }}
                multiple
                type="file"
                ref={fileImageInputRef}
                onChange={onChangeFileImage}
              />
              <Button
                className={`${classes.fileSelctionBtn}`}
                style={{ marginLeft: '10px' }}
                onClick={onClickFileImageUploadBtn}
              >
                이미지선택
              </Button>
            </UploadContentItem>
            {/* 파일이미지 - 끝 */}

            {/* OS - 시작 */}
            <UploadContentItem>
              <TextDefault size="16px" color="#000" width="150px">
                OS
              </TextDefault>

              <CheckboxWithLabel
                checked={checkedOs.window}
                onChangeChecked={onChangeCheckedOs}
                name="Window"
                label="Window"
              />
              <CheckboxWithLabel
                checked={checkedOs.mac}
                onChangeChecked={onChangeCheckedOs}
                name="Mac"
                label="Mac"
              />
              {/* <CheckboxWithLabel
                checked={checkedOs.android}
                onChangeChecked={onChangeCheckedOs}
                name="android"
                label="Android"
              />
              <CheckboxWithLabel
                checked={checkedOs.ios}
                onChangeChecked={onChangeCheckedOs}
                name="ios"
                label="iOS"
              /> */}
            </UploadContentItem>
            {/* OS - 끝 */}

            {/* 가격 - 시작 */}
            <UploadContentItem>
              <TextDefault size="16px" color="#000" width="150px">
                가격
              </TextDefault>

              <CheckboxWithLabel
                checked={checkedPrice.free}
                onChangeChecked={onChangeCheckedPrice}
                name="free"
                label="Free"
              />
              {/* <CheckboxWithLabel
                checked={checkedPrice.paid}
                onChangeChecked={onChangeCheckedPrice}
                name="paid"
                label="Paid"
              /> */}
            </UploadContentItem>
            {/* 가격 - 끝 */}

            {/* 설명 - 시작 */}
            {/* <UploadContentItem>
              <TextDefault size="16px" color="#000" width="150px">
                설명
              </TextDefault>
              <UploadTextarea type="text" value={filename} onChange={onChangeFilename} />
            </UploadContentItem> */}
            {/* 설명 - 끝 */}
          </UploadContentItems>

          <div style={{ marginBottom: 15 }}>
            <TextDefault size="16px" color="#000" width="150px">
              설명
            </TextDefault>
          </div>
          <QuillEditor
            value={content}
            onChange={(value) => {
              setContent(value);
            }}
          />

          {/* 하단 버튼 Wrapper - 시작 */}
          <UploadBottomWrapper>
            <Button className={`${classes.userInfoUpdateBtn}`} onClick={onClickUpload}>
              업로드
            </Button>
            <Button
              className={`${classes.userInfoCancelBtn}`}
              onClick={() => {
                history.push('/my-page');
              }}
            >
              취소
            </Button>
          </UploadBottomWrapper>
          {/* 하단 버튼 Wrapper - 끝 */}
        </UploadContainer>
        {/* 업로드 화면 레이아웃 - 끝 */}
      </MyPageLayout>
    </>
  );
};

export default Upload;
