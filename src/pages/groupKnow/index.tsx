import { getClassGroup, pairClassKnowledge, queryclass } from '@/services/api';
import { PageContainer } from '@ant-design/pro-components';
import { Button, message, Radio, Space, Tree } from 'antd';
import { useEffect, useState } from 'react';
import style from './index.less';

function GroupKnow() {
  const [classList, setClassList] = useState([]);
  const [classGroup, setClassGroup] = useState([]);
  const [selectKeys, setSelectKeys] = useState<any[]>([]);
  const [group, setGroup] = useState<number>(0);

  const RadioGroup = Radio.Group;

  const reset = () => {
    setSelectKeys([]);
    setGroup(0);
  };

  const submit = () => {
    if (!group) {
      message.error('请选择班级');
      return;
    }
    if (!selectKeys.length) {
      message.error('请选择知识点');
      return;
    }
    const data = {
      classid: group,
      knowledgeid: selectKeys.join(','),
    };
    pairClassKnowledge(data).then((res) => {
      if (res.code === 200) {
        message.success('分配成功');
        reset();
      } else {
        message.error(res.message || '分配失败');
      }
    });
  };

  useEffect(() => {
    queryclass({}).then((res) => {
      console.log(res);
      setClassList(res.data);
    });
    getClassGroup({}).then((res) => {
      console.log(res);
      setClassGroup(res.data);
    });
    return () => {};
  }, []);

  return (
    <PageContainer title="知识点分配">
      <div className={style.groupKnowContainer}>
        <div className={style.groupKnowLeft}>
          <div className={style.groupKnowTitle}>班级</div>

          <RadioGroup
            value={group}
            size="large"
            onChange={(e) => {
              setGroup(e.target.value);
            }}
          >
            <Space direction="vertical">
              {classGroup.map((item: any) => (
                <Radio value={item.id} key={item.id}>
                  {item.name}
                </Radio>
              ))}
            </Space>
          </RadioGroup>
        </div>
        <div className={style.groupKnowRight}>
          <div className={style.groupKnowTitle}>知识点</div>

          <Tree
            treeData={classList}
            checkable
            checkedKeys={selectKeys}
            fieldNames={{ title: 'name', key: 'code' }}
            showLine
            onCheck={(selectdKeys) => {
              console.log(selectdKeys);
              setSelectKeys(
                Array.isArray(selectdKeys) ? selectdKeys : selectdKeys.checked,
              );
            }}
          ></Tree>
        </div>
      </div>
      <div className={style.groupKnowBtn}>
        <Button style={{ marginRight: 10 }} onClick={() => reset()}>
          重置
        </Button>
        <Button type="primary" onClick={() => submit()}>
          提交
        </Button>
      </div>
    </PageContainer>
  );
}

export default GroupKnow;
