import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

const onBackupSubmit = (e) => {
  console.log(e);
  e.preventDefault();
  const options = {
    url: 'http://18.118.194.242:8080/file/downloadTest?fileiId=',
    method: 'GET',
    responseType: 'blob',

    headers: {
      Authorization: 'Bearer', // + Cookies.get('access_token'),
      'Content-Type': 'application/json',
    },
  };

  axios(options)
    .then((response) => {
      console.log(response);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'image/png' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'image.png');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      alert('파일을 다운로드합니다.');
    })
    .catch((error) => {
      if (String(error).includes('500')) {
        console.log(error);
        alert('데이터가 없습니다');
      } else {
        console.log('error', error);
        alert('서버와의 통신이 불안정합니다. 다시 시도해주세요');
      }
    });
};

export default onBackupSubmit;
