/*
 * @Author: Luoxiangyu
 * @LastEditors: Luoxiangyu
 */
import { addKnowledge, queryclass, uploadclass } from '@/services/api';
import {
  PlusOutlined,
  PlusSquareOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Spin,
  Upload,
} from 'antd';
import { useEffect, useState } from 'react';
import style from './index.less';

interface IClass {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  children: IClass[];
}

export default function Knowledge() {
  const [form] = Form.useForm();
  const [classList, setClassList] = useState<IClass[]>([]);
  const [knowshowModal, setKnowshowModal] = useState(false);
  const [type, setType] = useState(1);
  const [serial, setSerial] = useState<IClass[]>([]);
  const [knowls, setKnowls] = useState<IClass[]>([]);
  const [firstClass, setFirstClass] = useState<number>(0);
  const [secondClass, setSecondClass] = useState<number>(0);
  const [openUploadModal, setOpenUploadModal] = useState(false);

  // const getKnowledgeList = async (page: number = 1, size: number = 10) => {
  //   queryKnowledge({ page, size }).then((res) => {
  //     if (res.code === 200) {
  //       setKnowledgeList(res.data.list);
  //       setTotal(res.data.total);
  //       setPage(res.data.page);
  //       setSize(res.data.size);
  //     } else {
  //       message.error(res.message || '查询知识库失败');
  //     }
  //   });
  // };

  const getClassList = async () => {
    queryclass({}).then((res) => {
      console.log(res);
      if (res.code === 200) {
        const _class = res.data.map((item: any, index: number) => {
          return {
            ...item,
            isActive: index === 0,
          };
        });
        const _serial = res.data[0].children.map((item: any, index: number) => {
          return {
            ...item,
            isActive: index === 0,
          };
        });
        const _knowls = res.data[0].children[0].children.map(
          (item: any, index: number) => {
            return {
              ...item,
              isActive: index === 0,
            };
          },
        );
        setClassList(_class);
        setSerial(_serial);
        setKnowls(_knowls);
      }
    });
  };

  useEffect(() => {
    getClassList();
  }, []);

  const submitForm = async () => {
    const values = await form.validateFields();
    console.log(values);
    const _data = values;
    if (type === 2) {
      _data.classid = classList[firstClass].code;
    }
    if (type === 3) {
      _data.classid = classList[firstClass].code;
      _data.serialid = serial[secondClass].code;
    }
    const data = await addKnowledge(_data);
    console.log(data);
    if (data.code === 200) {
      message.success('添加成功');
      getClassList();
    } else {
      message.error(data.message || '提交失败');
    }
    form.resetFields();
    setKnowshowModal(false);
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
            <Upload
              name="file"
              beforeUpload={async (file) => {
                setOpenUploadModal(true);
                const formData = new FormData();
                formData.append('file', file);
                const data = await uploadclass(formData);
                if (data.code === 200) {
                  message.success('上传成功');
                  getClassList();
                }
                setOpenUploadModal(false);
                return false;
              }}
              showUploadList={false}
            >
              <Button type="primary">
                批量添加
                <PlusOutlined />
              </Button>
            </Upload>
          </div>
          <div className={style.main}>
            <div className={style.main_ls}>
              <div className={style.main_ls_title}>
                年级{classList?.length && `(${classList.length})`}
                <div className={style.main_ls_title_add}>
                  <PlusSquareOutlined
                    onClick={() => {
                      setKnowshowModal(true);
                      setType(1);
                    }}
                  />
                </div>
              </div>
              <div className={style.main_ls_con}>
                {classList?.map((item, index) => (
                  <div
                    className={`${style.main_ls_con_item} ${
                      item.isActive && style.active
                    }`}
                    onClick={() => {
                      const _ls = classList.map((item, idx) => ({
                        ...item,
                        isActive: idx === index,
                      }));
                      const _ls1 = _ls[index]?.children.map((item, index) => ({
                        ...item,
                        isActive: index === 0,
                      }));
                      const _ls2 = _ls[index]?.children[0]?.children.map(
                        (item, index) => ({
                          ...item,
                          isActive: index === 0,
                        }),
                      );
                      setClassList(_ls);
                      setSerial(_ls1);
                      setKnowls(_ls2);
                      setFirstClass(index);
                    }}
                    key={item.id}
                  >
                    {item.name}
                    {item.isActive && <RightOutlined />}
                  </div>
                ))}
              </div>
            </div>
            <div className={style.symbol}>&gt;&gt;</div>
            <div className={style.main_ls}>
              <div className={style.main_ls_title}>
                章节{serial?.length && `(${serial.length})`}
                <div className={style.main_ls_title_add}>
                  <PlusSquareOutlined
                    onClick={() => {
                      setKnowshowModal(true);
                      setType(2);
                    }}
                  />
                </div>
              </div>
              <div className={style.main_ls_con}>
                {serial?.map((item, index) => (
                  <div
                    className={`${style.main_ls_con_item} ${
                      item.isActive && style.active
                    }`}
                    onClick={() => {
                      const _ls = serial.map((item, idx) => ({
                        ...item,
                        isActive: idx === index,
                      }));
                      const _ls2 = _ls[index]?.children.map((item, index) => ({
                        ...item,
                        isActive: index === 0,
                      }));
                      setSerial(_ls);
                      setKnowls(_ls2);
                      setSecondClass(index);
                    }}
                    key={item.id}
                  >
                    {item.name}
                    {item.isActive && <RightOutlined />}
                  </div>
                ))}
              </div>
            </div>
            <div className={style.symbol}>&gt;&gt;</div>
            <div className={style.main_ls}>
              <div className={style.main_ls_title}>
                知识点{knowls?.length && `(${knowls.length})`}
                <div className={style.main_ls_title_add}>
                  <PlusSquareOutlined
                    onClick={() => {
                      setKnowshowModal(true);
                      setType(3);
                    }}
                  />
                </div>
              </div>
              <div className={style.main_ls_con}>
                {knowls?.map((item, index) => (
                  <div
                    className={`${style.main_ls_con_item} ${
                      item.isActive && style.active
                    }`}
                    onClick={() => {
                      const _ls = knowls.map((item, idx) => ({
                        ...item,
                        isActive: idx === index,
                      }));

                      setKnowls(_ls);
                    }}
                    key={item.id}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
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
        </Form>
      </Modal>
      <Modal
        footer={null}
        centered
        title={null}
        open={openUploadModal}
        closable={false}
        width={150}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          上传中...&nbsp;&nbsp;
          <Spin />
        </div>
      </Modal>
    </PageContainer>
  );
}
