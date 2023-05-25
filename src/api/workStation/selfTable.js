import {post} from '@/utils/request'
// 获取table表格数据的公共方法
export function getListData(url,params,messageList) {
    return post(url,params,messageList)
  }