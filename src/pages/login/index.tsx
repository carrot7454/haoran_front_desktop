/*
 * @Author: Luoxiangyu
 * @LastEditors: Luoxiangyu
 */
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useState } from 'react';
import { history } from 'umi';
import style from './index.less';

interface LoginFormValues {
  username: string;
  password: string;
  remember?: boolean;
}

export default function Login() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      // 模拟登录请求
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 这里应该调用真实的登录 API
      // const response = await login(values);
      if (values.username === 'admin' && values.password === 'adminliu123') {
        message.success('登录成功');
        // 保存登录状态
        localStorage.setItem(
          'user',
          JSON.stringify({ username: values.username }),
        );
        // 跳转到首页
        history.push('/exam');
      } else {
        message.error('用户名或密码错误');
      }
    } catch (error) {
      message.error('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.loginContainer}>
      <div className={style.loginBox}>
        <div className={style.loginHeader}>
          <h1 className={style.title}>系统登录</h1>
          <p className={style.subtitle}>欢迎登录考试管理系统</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          className={style.form}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: '请输入用户名',
              },
              {
                min: 3,
                message: '用户名至少3个字符',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名或邮箱"
              size="large"
              className={style.input}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
              {
                min: 6,
                message: '密码至少6个字符',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
              className={style.input}
            />
          </Form.Item>

          <div className={style.options}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住密码</Checkbox>
            </Form.Item>
            <a href="#" className={style.forgot}>
              忘记密码?
            </a>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              block
              className={style.button}
            >
              登录
            </Button>
          </Form.Item>

          <div className={style.footer}>
            <span>还没有账号? </span>
            <a href="/register" className={style.register}>
              立即注册
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}
