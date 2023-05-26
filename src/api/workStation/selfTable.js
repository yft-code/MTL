import {post} from '@/utils/request'
// 获取table表格数据的公共方法
export function getListData(url,params,messageList) {
    return post(url,params,messageList)
  }
// 获取状态数组
export function getExpertTestStatus(params,messageList) {
  return post('/expertCompatibility/get_expert_test_status/',params,messageList)
}