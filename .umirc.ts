/*
 * @Author: Luoxiangyu
 * @LastEditors: Luoxiangyu
 */
/*
 * @Author: Luoxiangyu
 * @LastEditors: Luoxiangyu
 */
import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '试卷管理平台',
    icon: '/public/zhishi.jpg',
    logo: '/public/zhishi.jpg',
  },
  metas: [
    {
      'http-equiv': 'cache-control',
      content: 'no-cache, no-store, must-revalidate',
    },
    {
      'http-equiv': 'pragma',
      content: 'no-cache',
    },
    {
      'http-equiv': 'expires',
      content: '0',
    },
  ],
  routes: [
    {
      path: '/login',
      component: './login',
      layout: false,
    },
    {
      path: '/',
      redirect: '/exam',
    },
    {
      name: '试卷列表',
      path: '/exam',
      component: './exam',
    },
    {
      name: '创建试卷',
      path: '/exam/create',
      hideInMenu: true,
      component: './exam/create',
    },
    {
      name: '知识点管理',
      path: '/knowledge',
      component: './knowledge',
    },
  ],
  npmClient: 'yarn',
  utoopack: {},
});
