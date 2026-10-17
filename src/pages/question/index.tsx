import { getNewQuesList } from '@/services/api';
import { PageHeader } from '@ant-design/pro-components';
import { Modal, Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import style from './index.less';

function Question() {
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(0);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');

  const typeSet: Record<string, string> = {
    1: '单选题',
    2: '多选题',
    3: '填空题',
    4: '解答题',
    5: '证明题',
    6: '作图题',
  };

  const queryList = (page: number = 1, pageSize: number = 10) => {
    getNewQuesList({ page, size: pageSize }).then((res) => {
      console.log(res);
      setDataSource(res.data.list);
      setTotal(res.data.pageinfo.total);
      setPage(page);
      setSize(pageSize);
    });
  };

  useEffect(() => {
    queryList();
    return () => {};
  }, []);

  const column = [
    {
      title: '序号',
      dataIndex: 'id',
      render: (text: string, _: any, index: number) => (
        <div>{(page - 1) * size + (index + 1)}</div>
      ),
    },
    {
      title: '题目',
      dataIndex: 'name',
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: '所属章节',
      dataIndex: 'code_name',
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: '试题类型',
      dataIndex: 'type',
      render: (text: string) => <div>{typeSet[text]}</div>,
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (text: string) => (
        <div>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</div>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      render: (text: string) => (
        <div>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</div>
      ),
    },
    {
      title: '内容',
      dataIndex: 'desc',
      render: (text: string, record: any) => (
        <>
          <a
            style={{
              marginRight: 10,
              color: '#1890ff',
            }}
            onClick={() => {
              setContent(record.desc);
              setOpen(true);
            }}
          >
            查看
          </a>
          <a>删除</a>
        </>
      ),
    },
  ];

  const pagination = {
    total,
    current: page,
    pageSize: size,
    onChange: (page: number, pageSize: number) => {
      queryList(page, pageSize);
    },
  };

  return (
    <PageHeader title="试题列表">
      <div className={style.ques_list}>
        <Table
          columns={column}
          dataSource={dataSource}
          key={'code'}
          scroll={{ x: 'max-content' }}
          pagination={pagination}
        ></Table>
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          title="试题内容"
          width={800}
          footer={null}
        >
          <div
            className={style.ques_content}
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </Modal>
      </div>
    </PageHeader>
  );
}

export default Question;
