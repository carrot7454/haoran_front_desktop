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

export const queryclass = async (data: any) => {
  return await http('/knowladge/classlist', 'POST', data);
};

export const addKnowledge = async (data: any) => {
  return await http('/knowladge/add', 'POST', data);
};
