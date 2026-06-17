/*
 * @Author: Luoxiangyu
 * @LastEditors: Luoxiangyu
 */
import { getQuesList } from '@/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import style from './index.less';

export default function Exam() {
  const [dataSource, setDataSource] = useState([]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '题目',
      dataIndex: 'name',
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
    },
  ];

  useEffect(() => {
    getQuesList().then((res) => {
      if (res.code === 200) {
        console.log(res.data);
        setDataSource(res.data); // Assuming res.data is an array of questions
      }
    });
  }, []);

  return (
    <PageContainer title="试卷列表">
      <div className={style.examContainer}>
        <Table columns={columns} dataSource={dataSource} />
      </div>
    </PageContainer>
  );
}
