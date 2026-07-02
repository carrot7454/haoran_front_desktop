/*
 * @Author: Luoxiangyu
 * @LastEditors: Luoxiangyu
 */
import { getQuesList } from '@/services/api';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Image, Table } from 'antd';
import { useEffect, useState } from 'react';
import { history } from 'umi';
import style from './index.less';

export default function Exam() {
  const [dataSource, setDataSource] = useState([]);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [currentPics, setCurrentPics] = useState<string[]>([]);

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
    {
      title: '操作',
      render: (text: string, record: any) => {
        console.log(record);
        return (
          <a
            onClick={() => {
              const list = record.quesPic.map((item: any) => item.uri);
              setCurrentPics(list);
              setShowPreview(true);
            }}
          >
            查看试卷
          </a>
        );
      },
    },
  ];

  useEffect(() => {
    getQuesList({}).then((res) => {
      if (res.code === 200) {
        console.log(res.data);
        setDataSource(res.data); // Assuming res.data is an array of questions
      }
    });
  }, []);

  return (
    <PageContainer title="试卷列表">
      <div
        className={style.btn}
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        <Button
          type="primary"
          onClick={() => {
            history.push('/exam/create');
          }}
        >
          添加试题
          <PlusOutlined />
        </Button>
      </div>
      <div className={style.examContainer}>
        <Table columns={columns} dataSource={dataSource} />
      </div>
      <Image.PreviewGroup
        items={currentPics}
        preview={{
          visible: showPreview,
          onVisibleChange: (e) => {
            setShowPreview(false);
          },
        }}
      ></Image.PreviewGroup>
    </PageContainer>
  );
}
