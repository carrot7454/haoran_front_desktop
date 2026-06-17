/*
 * @Author: Luoxiangyu
 * @LastEditors: Luoxiangyu
 */
import { request } from '@@/plugin-request';

const http = async (url: string, method: 'POST' | 'GET', data?: any) => {
  return await request('http://127.0.0.1:3000' + url, {
    method,
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default http;
