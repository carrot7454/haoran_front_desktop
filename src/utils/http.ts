/*
 * @Author: Luoxiangyu
 * @LastEditors: Luoxiangyu
 */
import { request } from '@@/plugin-request';
import { history } from 'umi';

// const baseUrl = 'http://127.0.0.1:3000';
const baseUrl = 'https://zhishiliu.top/api';

const http = async (url: string, method: 'POST' | 'GET', data?: any) => {
  const user = localStorage.getItem('user');
  if (!user) {
    history.replace('/login');
    return null;
  }
  return await request(baseUrl + url, {
    method,
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default http;
