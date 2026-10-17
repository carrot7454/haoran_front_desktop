import { addClassGroup, getClassGroup } from '@/services/api';
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Col, Form, Input, message, Row } from 'antd';
import { useEffect, useState } from 'react';
import style from './index.less';

interface ClassGroupItem {
  id: number;
  name: string;
}

function ClassGroup() {
  const [form] = Form.useForm();
  const FormItem = Form.Item;
  const [classGroups, setClassGroups] = useState<ClassGroupItem[]>([]);

  const fetchClassGroups = () => {
    getClassGroup({}).then((res) => {
      if (res.code === 200) {
        console.log('Fetched class groups:', res.data);
        // Update state or UI with the fetched class groups
        setClassGroups(res.data);
      } else {
        message.error('Failed to fetch class groups: ' + res.message);
      }
    });
  };

  const addGroup = () => {
    form.validateFields().then((values) => {
      // Handle add group logic here
      console.log('Adding group with values:', values);
      addClassGroup(values).then((res) => {
        if (res.code === 200) {
          console.log('Group added successfully');
          // Optionally, refresh the group list or reset the form
          message.success('班级分组添加成功');
          fetchClassGroups();
          form.resetFields();
        } else {
          message.error('Failed to add group: ' + res.message);
        }
      });
    });
  };

  useEffect(() => {
    fetchClassGroups();
  }, []);

  return (
    <PageContainer title="班级分组">
      <div className={style.classGroup}>
        <div className={style.classGroupTop}>
          <Form form={form}>
            <Row gutter={16}>
              <Col span={8}>
                <FormItem
                  label="班级组名"
                  name="name"
                  rules={[{ required: true, message: '请填写班级组名' }]}
                >
                  <Input placeholder="请填写班级组名" />
                </FormItem>
              </Col>
              <Col span={8}>
                <Button icon={<PlusOutlined />} onClick={() => addGroup()}>
                  添加
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <div className={style.classGroupBody}>
          {classGroups.map((group) => (
            <div className={style.classGroupBodyItem} key={group.id}>
              <div className={style.classGroupBodyItemTitle}>{group.name}</div>
              <DeleteFilled />
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

export default ClassGroup;
