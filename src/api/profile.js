import {get} from '@/utils/request'
import {post} from '@/utils/request'
// 获取用户邮箱
export function getUserEmail(params) {
  return get('/service/get_user_email/',params)
}
// 获取用户权限
export function getUserAuth(params) {
    return get('/service/get_user_auth/',params)
}

// 获取是否是接口人
export function judgeContact(params) {
    return get('/service/get_reminder/',params)
}

// 获取项目组信息
export function getExpertGroup(params,messageList) {
  return post('/expertCompatibility/get_expert_group/',params,messageList)
}
