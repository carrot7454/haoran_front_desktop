/*
 * @Author: Luoxiangyu
 * @LastEditors: Luoxiangyu
 */
import { addQues, queryKnowledgeSelect, upload } from '@/services/api';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  message,
  Rate,
  Row,
  Select,
  Upload,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import style from './index.less';

type ImageItem = { page: number; dataUrl: string };

export default function PdfToImages(): JSX.Element {
  const [status, setStatus] = useState<string>('');
  const [items, setItems] = useState<ImageItem[]>([]);
  const [viewpic, setViewPic] = useState<boolean>(false);
  const scaleRef = useRef<number>(1.5);
  const [knowledgeList, setKnowledgeList] = useState<any[]>([]);

  const workerUrlRef = useRef<string | null>(null);
  const [file, setFile] = useState<string>('');
  const [form] = Form.useForm();

  useEffect(() => {
    queryKnowledgeSelect({}).then((res) => {
      if (res.code === 200) {
        setKnowledgeList(res.data.data);
      }
    });
    return () => {
      if (workerUrlRef.current) {
        URL.revokeObjectURL(workerUrlRef.current);
        workerUrlRef.current = null;
      }
    };
  }, []);

  async function ensureWorker(pdfjsLib: any) {
    // Prefer loading the worker via the npm package so bundlers handle asset URLs.
    // This avoids CORS issues and doesn't require copying files to public/.
    try {
      // Recommended entry that many bundlers expose
      // @ts-ignore
      const workerModule: any = await import(
        'pdfjs-dist/legacy/build/pdf.worker.entry'
      );
      const workerSrc = (workerModule &&
        (workerModule.default || workerModule)) as string | undefined;
      if (workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
        return;
      }
    } catch (e) {
      // try alternate import name some setups use
      try {
        // @ts-ignore
        const workerModuleAlt: any = await import(
          'pdfjs-dist/legacy/build/pdf.worker'
        );
        const workerSrcAlt = (workerModuleAlt &&
          (workerModuleAlt.default || workerModuleAlt)) as string | undefined;
        if (workerSrcAlt) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrcAlt;
          return;
        }
      } catch (e2) {
        // fall through
      }
    }

    // If bundler imports fail, fall back to CDN but warn about potential CORS.
    console.warn(
      'Could not load pdf.worker from npm package; falling back to CDN (may be CORS blocked).',
    );
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://unpkg.com/pdfjs-dist@3.11.338/build/pdf.worker.min.js';
  }

  const fileUpload = async (base64: string, name: string) => {
    const uploadUrl = await upload({
      base64: base64,
      name: name + '_image_' + new Date().getTime() + '.png',
    });
    console.log('Upload success:', uploadUrl);
    return 'https://img2.zhishiliu.top/' + uploadUrl.data.key;
  };

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    console.log('Selected file:', e);
    const { file } = e;
    if (!file) return;
    setItems([]);
    setStatus('读取文件...');

    try {
      const arrayBuffer = await file.originFileObj.arrayBuffer();
      setStatus('加载 pdfjs...');
      const pdfjsLib: any = await import('pdfjs-dist/legacy/build/pdf');

      await ensureWorker(pdfjsLib);

      setStatus('解析 PDF...');
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setStatus(`共 ${pdf.numPages} 页，开始渲染...`);

      const results: ImageItem[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        setStatus(`渲染第 ${i} / ${pdf.numPages} 页...`);
        const page = await pdf.getPage(i);
        const scale = Number(scaleRef.current) || 1.5;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('无法获取 canvas 上下文');
        await page.render({ canvasContext: ctx, viewport }).promise;
        let dataUrl = canvas.toDataURL('image/png');
        // console.log('Canvas data URL:', dataUrl);
        const uploadUrl = await fileUpload(dataUrl, file.name + '_' + i);
        console.log('Upload success:', uploadUrl);
        results.push({
          page: i,
          dataUrl: uploadUrl,
        });
        await new Promise((r) => setTimeout(r, 30));
      }
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj); // Reads file as Data URL (Base64)
      reader.onload = async () => {
        const fileDataUrl = reader.result as string;
        console.log('File as Data URL:', fileDataUrl);
        const fpdf = await fileUpload(fileDataUrl, file.name);
        setFile(fpdf);
      };

      setItems(results);

      setStatus('全部完成');
    } catch (err: any) {
      console.error(err);
      setStatus('错误: ' + (err?.message || String(err)));
    }
  }

  const onDragEnd = (result: any) => {
    console.log('Drag ended:', result);
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [moved] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, moved);
    setItems(newItems);
  };

  const openPic = () => {
    console.log('Opening picture preview');
    setViewPic(true);
  };

  const submit = () => {
    if (!file) {
      message.error('请先上传PDF文件');
      return;
    }
    if (items.length === 0) {
      message.error('请先上传习题');
      return;
    }
    form.validateFields().then((values) => {
      console.log('Form values:', values, items, file);
      const data = {
        ...values,
        pics: items.map((it) => it.dataUrl),
        pdf: file,
      };
      addQues(data).then((res) => {
        console.log('API response:', res);
        if (res.code === 200) {
          message.success('上传成功');
          form.resetFields();
          setItems([]);
          setFile('');
          setStatus('');
        } else {
          message.error(res.message || '上传失败');
        }
      });
    });
  };

  return (
    <PageContainer title="上传试题">
      <div
        className={style.container}
        style={{
          fontFamily: 'Segoe UI, Arial',
          margin: 16,
          padding: 20,
          backgroundColor: '#fff',
          borderRadius: 20,
        }}
      >
        <Form form={form}>
          <Row>
            <Col span={6}>
              <Form.Item
                label="输入试卷名称"
                name={'name'}
                rules={[{ required: true, message: '请输入试卷名称' }]}
              >
                <Input
                  type="text"
                  placeholder="请输入试卷名称"
                  style={{ width: 200 }}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="选择知识领域"
                name={'knowledgeId'}
                required
                rules={[{ required: true, message: '请选择知识领域' }]}
              >
                <Select
                  options={knowledgeList}
                  fieldNames={{
                    label: 'name',
                    value: 'id',
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Form.Item label="选择PDF习题" required>
                <Upload
                  fileList={
                    items.length === 0
                      ? []
                      : items.map((it) => {
                          let i = it.dataUrl.lastIndexOf('/') + 1;
                          return { url: it.dataUrl, name: it.dataUrl.slice(i) };
                        })
                  }
                  type="file"
                  accept="application/pdf"
                  onChange={handleFile}
                >
                  <Button type="primary">点击选择文件</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="缩放">
                <input
                  type="number"
                  defaultValue={1.5}
                  step={0.1}
                  min={0.1}
                  onChange={(e) => (scaleRef.current = Number(e.target.value))}
                  style={{ width: 80, marginLeft: 6 }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Form.Item
                name={'difficulty'}
                label={'试题难度'}
                rules={[{ required: true, message: '请选择试题难度' }]}
              >
                <Rate allowHalf></Rate>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div style={{ marginTop: 12, color: '#333' }}>{status}</div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ marginTop: 12 }}>
            <Droppable droppableId="droppable-1" key={'droppable-1'}>
              {(provided) => (
                <div
                  className={style.testcontainer}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {items.map((it, index) => (
                    <Draggable
                      draggableId={'ques' + index}
                      index={index}
                      key={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className={style.item}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            backgroundColor: snapshot.isDragging
                              ? '#dadada'
                              : 'white',
                            fontSize: 18,
                            ...provided.draggableProps.style,
                          }}
                        >
                          <div className="item" onClick={() => openPic()}>
                            <img
                              src={it.dataUrl}
                              alt={`page-${it.page}`}
                              style={{
                                maxWidth: '100%',
                                border: '1px solid #ddd',
                              }}
                            />
                            <div>
                              <a
                                href={it.dataUrl}
                                download={`page-${it.page}.png`}
                              >
                                下载第 {it.page} 页（PNG）
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
        <div style={{ marginTop: 12, color: '#333' }}>
          <Button onClick={() => submit()} type="primary">
            提交
          </Button>
        </div>
      </div>
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup
          preview={{
            visible: viewpic,
            onVisibleChange: (vis) => setViewPic(vis),
          }}
        >
          {items.map((it, index) => (
            <Image
              width={200}
              key={index}
              src={it.dataUrl}
              alt={`page-${it.page}`}
            />
          ))}
        </Image.PreviewGroup>
      </div>
    </PageContainer>
  );
}
