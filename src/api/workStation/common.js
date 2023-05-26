import {post} from '@/utils/request'
// 获取是否是接口人
  export function getReminder(params,messageList) {
    return post('/service/get_reminder/',params,messageList)
  }
// 获取QA列表  
export function getQaList(params,messageList) {
    return post('/service/get_qa_list/',params,messageList)
  }