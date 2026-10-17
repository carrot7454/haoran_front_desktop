import { getUserList } from '@/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { Table } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

function Person() {
  const [dataSource, setDataSource] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(0);

  const queryList = (page: number = 1, size: number = 10) => {
    getUserList({ page, size }).then((res) => {
      console.log(res);
      setDataSource(res.data);
      setPage(page);
      setSize(size);
      setTotal(res.total);
    });
  };

  useEffect(() => {
    queryList();
    return () => {};
  }, []);

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      render: (text: string, _: any, index: number) => (
        <div>{(page - 1) * size + (index + 1)}</div>
      ),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: '班级',
      dataIndex: 'class_name',
      render: (text: string) => <div>{text}</div>,
    },
    {
      title: '创建时间',
      dataIndex: 'ctime',
      render: (text: string) => (
        <div>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</div>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'utime',
      render: (text: string) => (
        <div>{dayjs(text).format('YYYY-MM-DD HH:mm:ss')}</div>
      ),
    },
    // {
    //   title: '操作',
    //   dataIndex: 'action',
    //   render: (text: string, record: any) => (
    //     <div>
    //       <Button type="link" onClick={() => {}}>
    //         编辑
    //       </Button>
    //       <Button type="link" onClick={() => {}}>
    //         删除
    //       </Button>
    //     </div>
    //   ),
    // },
  ];

  const pagination = {
    total,
    current: page,
    pageSize: size,
    onChange: (page: number, size: number) => {
      queryList(page, size);
    },
  };

  return (
    <PageContainer title="学员列表">
      <div>
        <Table
          rowKey={'id'}
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
        />
      </div>
    </PageContainer>
  );
}

export default Person;
