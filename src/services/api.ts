/*
 * @Author: Luoxiangyu
 * @LastEditors: Luoxiangyu
 */
import http from '@/utils/http';

export const addQues = async (data: any) => {
  return await http('/questions/add', 'POST', data);
};

export const getQuesList = async (data: any) => {
  return await http('/questions/queryQuestions', 'POST', data);
};

export const upload = async (data: any) => {
  return await http('/upload/file', 'POST', data);
};

export const uploadclass = async (data: any) => {
  return await http('/knowladge/muti-upload', 'POST', data);
};

export const queryclass = async (data: any) => {
  return await http('/knowladge/get-muti', 'POST', data);
};

export const queryKnowledge = async (data: any) => {
  return await http('/knowladge/knowledgelist', 'POST', data);
};

export const addKnowledge = async (data: any) => {
  return await http('/knowladge/add', 'POST', data);
};

export const queryKnowledgeSelect = async (data: any) => {
  return await http('/knowladge/simpleKnowledge', 'POST', data);
};

export const addClassGroup = async (data: any) => {
  return await http('/funcs/addClassSeries', 'POST', data);
};

export const getClassGroup = async (data: any) => {
  return await http('/funcs/getClassSeries', 'POST', data);
};

export const addNewQues = async (data: any) => {
  return await http('/questions/newAddQues', 'POST', data);
};

export const getNewQuesList = async (data: any) => {
  return await http('/questions/getNewQuesList', 'POST', data);
};

export const pairClassKnowledge = async (data: any) => {
  return await http('/funcs/pairClassKnowledge', 'POST', data);
};

export const getUserList = async (data: any) => {
  return await http('/user/list', 'POST', data);
};

export const getExamList = async (data: any) => {
  return await http('/questions/getUserQuesList', 'POST', data);
};

export const getExamDetail = async (data: any) => {
  return await http('/questions/getQuesDetail', 'POST', data);
};

export const finishQuesUser = async (data: any) => {
  return await http('/questions/newFinishUserQues', 'POST', data);
};
