import {post} from '@/utils/request'
// 获取项目组信息
export function getExpertGroup(params,messageList) {
    return post('/expertCompatibility/get_expert_group/',params,messageList)
  }