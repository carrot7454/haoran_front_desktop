import { addNewQues, queryclass } from '@/services/api';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-components';
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Select,
  TreeSelect,
} from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { useEffect, useState } from 'react';
import style from './index.less';

function QuesCreate() {
  const { TreeNode } = TreeSelect;
  const [form] = Form.useForm();
  const RadioGroup = Radio.Group;
  const FormItem = Form.Item;
  const txt = 'ABCDEFGHIGKLMNOPQRSTUVWXYZ';
  const diff = [
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
  ];

  const [queslist, setQuesList] = useState(['']);
  const [classList, setClassList] = useState([]);
  const needOption = Form.useWatch('type', form);

  useEffect(() => {
    queryclass({}).then((res) => {
      if (res.code === 200) {
        setClassList(res.data);
      }
    });

    return () => {};
  }, []);

  const renderTreeNodes = (data: any[]) =>
    data.map((item) => {
      if (item.children.length) {
        item.disable = true;
        return (
          <TreeNode
            title={item.name}
            key={item.code}
            value={item.code}
            disabled={item.disable}
          >
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          {...item}
          title={item.name}
          key={item.code}
          value={item.code}
        />
      );
    });

  return (
    <PageHeader title="试题创建">
      <div className={style.quesCreate}>
        <Form
          form={form}
          onFinish={(value) => {
            console.log(value);
            console.log(value.desc.toHTML());
            const data = {
              ...value,
              desc: value.desc.toHTML(),
              option: JSON.stringify(value.option),
            };
            addNewQues(data).then((res) => {
              console.log(res);
              if (res.code === 200) {
                message.success('创建成功');
                form.resetFields();
                setQuesList(['']);
              } else {
                message.error(res.message || '创建失败');
              }
            });
          }}
          labelCol={{ span: 4 }}
        >
          <FormItem
            label="试题类型"
            name="type"
            initialValue={1}
            rules={[{ required: true, message: '请选择试题类型' }]}
          >
            <RadioGroup>
              <Radio value={1}>单选题</Radio>
              <Radio value={2}>多选题</Radio>
              <Radio value={3}>填空题</Radio>
              <Radio value={4}>解答题</Radio>
              <Radio value={5}>证明题</Radio>
              <Radio value={6}>作图题</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem
            label="名称"
            name="name"
            rules={[{ required: true, message: '请输入试题名称' }]}
          >
            <Input placeholder="请输入试题名称" />
          </FormItem>
          <FormItem
            label="所属知识点"
            name="knowladge"
            rules={[{ required: true, message: '请选择知识点' }]}
          >
            <TreeSelect>{renderTreeNodes(classList)}</TreeSelect>
          </FormItem>
          <FormItem
            label="试题内容"
            name="desc"
            rules={[{ required: true, message: '请输入题目' }]}
          >
            <BraftEditor />
          </FormItem>
          <FormItem label="难度" name="difficulty" initialValue={1}>
            <Select options={diff}></Select>
          </FormItem>
          {needOption <= 2 && (
            <div>
              {queslist.map((item, index) => (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 20,
                  }}
                  key={index}
                >
                  <FormItem
                    style={{ marginBottom: 0, flex: 1 }}
                    label={'选项' + txt[index]}
                    name={['option', index]}
                    rules={[
                      { required: true, message: '请输入选项' + (index + 1) },
                    ]}
                  >
                    <Input placeholder={'请输入选项' + (index + 1)} />
                  </FormItem>
                  <PlusCircleOutlined
                    style={{ fontSize: 20, marginLeft: 6, cursor: 'pointer' }}
                    onClick={() => {
                      const tmp_ls = JSON.parse(JSON.stringify(queslist));
                      tmp_ls.splice(index, 0, '');
                      setQuesList(tmp_ls);
                    }}
                  />
                  <MinusCircleOutlined
                    style={{ fontSize: 20, marginLeft: 6, cursor: 'pointer' }}
                    onClick={() => {
                      const tmp_ls = JSON.parse(JSON.stringify(queslist));
                      if (tmp_ls.length <= 1) {
                        message.error('选项不能少于1个');
                        return;
                      }
                      tmp_ls.splice(index, 1);
                      setQuesList(tmp_ls);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
          {needOption === 3 && (
            <FormItem
              label="填空数量"
              name="option"
              rules={[{ required: true, message: '请输入填空数量' }]}
              initialValue={1}
            >
              <InputNumber step={1} min={1} />
            </FormItem>
          )}
          <FormItem>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                style={{ marginRight: 10 }}
                onClick={() => {
                  form.resetFields();
                  setQuesList(['']);
                }}
              >
                重置
              </Button>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </div>
          </FormItem>
        </Form>
      </div>
    </PageHeader>
  );
}

export default QuesCreate;
