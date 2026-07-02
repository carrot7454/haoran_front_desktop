/*
 * @Author: Luoxiangyu
 * @LastEditors: Luoxiangyu
 */
import { addKnowledge, queryclass, queryKnowledge } from '@/services/api';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
} from 'antd';
import { useEffect, useState } from 'react';
import style from './index.less';

interface IClass {
  id: number;
  name: string;
}

export default function Knowledge() {
  const [form] = Form.useForm();
  const [classList, setClassList] = useState<IClass[]>([]);
  const [knowledgeList, setKnowledgeList] = useState<any[]>([]);
  const [knowshowModal, setKnowshowModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const getKnowledgeList = async (page: number = 1, size: number = 10) => {
    queryKnowledge({ page, size }).then((res) => {
      if (res.code === 200) {
        setKnowledgeList(res.data.list);
        setTotal(res.data.total);
        setPage(res.data.page);
        setSize(res.data.size);
      } else {
        message.error(res.message || '查询知识库失败');
      }
    });
  };

  useEffect(() => {
    queryclass({}).then((res) => {
      console.log(res);
      if (res.code === 200) {
        setClassList(res.data);
      }
    });
    getKnowledgeList();
  }, []);

  const submitForm = async () => {
    const values = await form.validateFields();
    console.log(values);
    const data = await addKnowledge(values);
    console.log(data);
    if (data.code === 200) {
      message.success('添加成功');
    } else {
      message.error(data.message || '提交失败');
    }
    form.resetFields();
    getKnowledgeList();
    setKnowshowModal(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '知识点名称',
      dataIndex: 'knowladgename',
    },
    {
      title: '所属年级',
      dataIndex: 'classname',
    },
  ];

  const pagination = {
    total,
    current: page,
    pageSize: size,
    onChange: (page, pageSize) => {
      queryKnowledge({ page, size: pageSize });
    },
  };

  return (
    <PageContainer title="知识库">
      <div className={style.knowledgeContainer}>
        <div className={style.tableContainer}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '20px',
            }}
          >
            <Button
              type="primary"
              onClick={() => {
                setKnowshowModal(true);
              }}
            >
              添加
              <PlusOutlined />
            </Button>
          </div>
          <Table
            dataSource={knowledgeList}
            columns={columns}
            pagaination={pagination}
            rowKey="id"
          />
        </div>
      </div>
      <Modal
        destroyOnClose
        open={knowshowModal}
        title="知识库添加"
        onOk={() => submitForm()}
        onCancel={() => setKnowshowModal(false)}
        okText="提交"
      >
        <Form form={form}>
          <Row>
            <Col>
              <Form.Item
                label="名称"
                name="name"
                required
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <Input placeholder="请输入知识库名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item
                label="所属年级"
                name="class"
                required
                rules={[{ required: true, message: '请选择所属年级' }]}
              >
                <Select
                  placeholder="请选择所属年级"
                  options={classList.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </PageContainer>
  );
}
