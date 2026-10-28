import { finishQuesUser, getExamDetail } from '@/services/api';
import { useParams } from '@@/exports';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Form, InputNumber, message, Modal, Radio } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { useEffect, useState } from 'react';
import style from './index.less';

function QuesReview() {
  const [ques, setQues] = useState<any>({});
  const [current, setCurrent] = useState<number>(0);
  const [answers, setAnswers] = useState<any>([]);
  const [article, setArticle] = useState<string>('');
  const [articleOpen, setArticleOpen] = useState(false);
  const params = useParams();
  const [form] = Form.useForm();

  const typeSet: Record<string, string> = {
    1: '单选题',
    2: '多选题',
    3: '填空题',
    4: '解答题',
    5: '证明题',
    6: '作图题',
  };

  const submit = async () => {
    form.validateFields().then((res) => {
      console.log('====================================');
      console.log(res);
      console.log('====================================');
      finishQuesUser({
        id: params.id,
        comment: res.remark.toHTML(),
        score: res.score,
        is_err: res.isRight,
      }).then((res) => {
        console.log(res);
        if (res.code === 200) {
          message.success('提交成功');
          history.back();
        } else {
          message.success('提交失败');
        }
      });
    });
  };

  useEffect(() => {
    console.log(params);
    getExamDetail({ id: params.id }).then((res) => {
      console.log(res);

      if (res.code === 200) {
        setQues(res.data);
        let ans;
        if (ques.type < 4) {
          ans = Array.isArray(res.data.answer)
            ? res.data.answer
            : res.data.answer.join(',');
        } else {
          ans = JSON.parse(res.data.answer);
        }
        setAnswers(ans);
        const _str = BraftEditor.createEditorState(res.data.desc);
        setArticle(_str);
      }
    });
  }, []);

  return (
    <PageContainer title="判卷">
      <div className={style.QuesReview}>
        <a
          style={{ marginBottom: 20, fontSize: 18 }}
          onClick={() => {
            history.back();
          }}
        >
          &lt;&lt;&nbsp;返回
        </a>
        <div className={style.QuesReview_title}>
          <div>
            题目：{ques.name} <span>{typeSet[ques.type]}</span>
          </div>
          <a
            onClick={() => {
              setArticleOpen(true);
            }}
          >
            查看
          </a>
        </div>
        <div className={style.QuesReview_content}>
          <div className={style.QuesReview_left}>
            <div className={style.QuesReview_left_title}>学生答案</div>
            {ques.type >= 4 ? (
              <div className={style.QuesReview_left_content}>
                <div>
                  <img src={answers[current]} alt={'答案' + (current + 1)} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '10px 0',
                  }}
                >
                  {current !== 0 && (
                    <div
                      style={{ marginRight: 10 }}
                      onClick={() =>
                        setCurrent(current === 0 ? 0 : current - 1)
                      }
                    >
                      &lt;&lt;上一张
                    </div>
                  )}
                  {current !== answers.length - 1 && (
                    <div
                      onClick={() =>
                        setCurrent(
                          current === answers.length - 1
                            ? answers.length - 1
                            : current + 1,
                        )
                      }
                    >
                      下一张&gt;&gt;
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={style.QuesReview_left_content}>{answers}</div>
            )}
          </div>
          <div className={style.QuesReview_right}>
            <div className={style.QuesReview_right_title}>老师评判</div>
            <div className={style.QuesReview_right_content}>
              <Form form={form}>
                <div>
                  <Form.Item
                    label="评语"
                    name="remark"
                    rules={[
                      {
                        required: true,
                        message: '请输入评语',
                      },
                    ]}
                  >
                    <BraftEditor
                      style={{ border: '1px solid #b5b5b5', borderRadius: 6 }}
                    />
                  </Form.Item>
                </div>
                <Form.Item
                  label="得分"
                  name="score"
                  rules={[
                    {
                      required: true,
                      message: '请输入得分',
                    },
                  ]}
                >
                  <InputNumber min={0} max={100} step={1} />
                </Form.Item>
                <Form.Item
                  label="是否正确"
                  name="isRight"
                  rules={[{ required: true, message: '请选择是否正确' }]}
                >
                  <Radio.Group>
                    <Radio value={0}>正确</Radio>
                    <Radio value={1}>错误</Radio>
                  </Radio.Group>
                </Form.Item>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    style={{ marginRight: 10 }}
                    onClick={() => {
                      form.resetFields();
                    }}
                  >
                    重置
                  </Button>
                  <Button type="primary" onClick={() => submit()}>
                    提交
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={articleOpen}
        title="试题内容"
        footer={null}
        onCancel={() => {
          setArticleOpen(false);
        }}
      >
        <BraftEditor readOnly value={article} controls={[]} />
      </Modal>
    </PageContainer>
  );
}

export default QuesReview;
