import {post} from '@/utils/request'

export function getCpuLadder(params,messageList) {
    return post('/expertCompatibility/get_cpu_ladder/',params,messageList)
  }

export function updateExpertTestPicture(params,messageList) {
    return post('/expertCompatibilityPC/update_expert_test_picture/',params,messageList,'formData')
}

export function updatePicture(params,messageList) {
    return post('/protocolTest/update_picture/',params,messageList,'formData')
}
// 获取历史包体数据
export function getTestInclusions(params,messageList) {
    return post('/expertCompatibility/get_test_inclusions/',params,messageList)
}