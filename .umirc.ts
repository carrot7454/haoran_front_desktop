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
      redirect: '/question',
    },
    // {
    //   name: '试卷列表',
    //   path: '/exam',
    //   component: './exam',
    // },
    // {
    //   name: '创建试卷',
    //   path: '/exam/create',
    //   hideInMenu: true,
    //   component: './exam/create',
    // },
    {
      name: '试题列表',
      path: '/question',
      component: './question',
    },
    {
      name: '试题创建',
      path: '/question/create',
      component: './question/create',
      hideInMenu: true,
    },
    {
      name: '知识点管理',
      path: '/knowledge',
      component: './knowledge',
    },
    {
      name: '班级分组',
      path: '/classGroup',
      component: './classGroup',
    },
    {
      name: '知识点分配',
      path: '/groupKnow',
      component: './groupKnow',
    },
    {
      name: '学员列表',
      path: '/person',
      component: './person',
    },
    {
      name: '试题修改',
      path: '/quesCheck',
      component: './quesCheck',
    },
    {
      name: '判卷',
      hideInMenu: true,
      path: '/quesCheck/check/:id',
      component: './quesCheck/check/index',
    },
  ],
  npmClient: 'yarn',
  utoopack: {},
});
