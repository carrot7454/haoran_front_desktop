import { getExamList } from '@/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Col, Form, Input, Row, Select, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import style from './index.less';

function QuesCheck() {
  const [form] = Form.useForm();
  const FormItem = Form.Item;
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const typeList = [
    { label: '单选题', value: 1 },
    { label: '多选题', value: 2 },
    { label: '填空题', value: 3 },
    { label: '解答题', value: 4 },
    { label: '证明题', value: 5 },
    { label: '作图题', value: 6 },
  ];

  const queryQues = async (page: number = 1, pageSize: number = 10) => {
    const data = form.getFieldsValue();
    getExamList({
      page,
      size: pageSize,
      ...data,
    }).then((res) => {
      if (res.code === 200) {
        setDataSource(res.data.list);
        setTotal(res.data.pageinfo.total);
        setPage(page);
        setPageSize(pageSize);
      }
    });
  };

  useEffect(() => {
    queryQues();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text: number) => (
        <div
          style={{ color: text === 1 ? '#f00' : text === 2 ? '#0f0' : 'black' }}
        >
          {text === 1 ? '待批改' : text === 2 ? '已批改' : '-'}
        </div>
      ),
    },
    {
      title: '试题名称',
      dataIndex: 'quesName',
    },
    {
      title: '试题类型',
      dataIndex: 'quesType',
      render: (text: number) => (
        <div>{typeList.find((item) => item.value === text)?.label || '-'}</div>
      ),
    },
    {
      title: '提交人',
      dataIndex: 'nickname',
    },
    {
      title: '创建时间',
      dataIndex: 'c_time',
      render: (text: number) => (
        <div>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</div>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'u_time',
      render: (text: number) => (
        <div>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</div>
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text: number, record: any) => (
        <div>
          <Button
            type="link"
            onClick={() => {
              history.push(`/quesCheck/check/${record.id}`);
            }}
          >
            修改
          </Button>
        </div>
      ),
    },
  ];

  const pagegation = {
    total,
    page,
    pageSize,
  };
  return (
    <PageContainer title="试题修改">
      <div className={style.quesCheckSearch}>
        <Form form={form}>
          <Row>
            <Col span={6}>
              <FormItem name="name" label="学生名称">
                <Input />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem name="stutus" label="状态">
                <Select
                  options={[
                    { label: '待批改', value: 1 },
                    { label: '已批改', value: 2 },
                  ]}
                />
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem name="type" label="试题类型">
                <Select options={typeList} />
              </FormItem>
            </Col>
            <Col span={6}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  onClick={() => {
                    form.resetFields();
                    queryQues();
                  }}
                >
                  重置
                </Button>
                <Button type="primary" onClick={() => queryQues()}>
                  查询
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
      <div className={style.quesCheckTable}>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={pagegation}
          rowKey={'id'}
        />
      </div>
    </PageContainer>
  );
}

export default QuesCheck;
