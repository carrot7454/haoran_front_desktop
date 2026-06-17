/*
 * @Author: Luoxiangyu
 * @LastEditors: Luoxiangyu
 */
import { addKnowledge, queryclass } from '@/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Col, Form, Input, message, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import style from './index.less';

interface IClass {
  id: number;
  name: string;
}

export default function Knowledge() {
  const [form] = Form.useForm();
  const [classList, setClassList] = useState<IClass[]>([]);

  useEffect(() => {
    queryclass({}).then((res) => {
      console.log(res);
      if (res.code === 200) {
        setClassList(res.data);
      }
    });
  }, []);

  const submitForm = async () => {
    const values = await form.validateFields();
    console.log(values);
    const data = await addKnowledge(values);
    console.log(data);
    if (data.code === 200) {
      message.success('提交成功');
    }
  }
    

  return (
    <PageContainer title="知识库">
      <div className={style.knowledgeContainer}>
        <Form form={form} >
          <Row>
            <Col span={6}>
              <Form.Item
                label="名称"
                name="name"
                required
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="所属年级"
                name="class"
                required
                rules={[{ required: true, message: '请选择所属年级' }]}
              >
                <Select
                  options={classList.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <div>
                <Button type="primary" onClick={() => submitForm()}>提交</Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </PageContainer>
  );
}
