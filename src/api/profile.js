import {get} from '@/utils/request'
// 获取用户邮箱
export function getUserEmail(param) {
  return get('/service/get_user_email/',param)
}
// 获取用户权限
export function getUserAuth(param) {
    return get('/service/get_user_auth/',param)
}

// 获取是否是接口人
export function judgeContact(param) {
    return get('/service/get_reminder/',param)
}