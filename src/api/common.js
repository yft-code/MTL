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
// 获取文件的url 
export function getDriverFile(params,messageList) {
    return post('/service/get_driver_file/',params,messageList)
}
// 删除用例问题
export function deleteExpertTestQuestion(params,messageList) {
    return post('/expertCompatibility/delete_expert_test_question/',params,messageList)
}
// 删除用例问题PC
export function deleteExpertTestQuestionPc(params,messageList) {
    return post('/expertCompatibilityPC/delete_expert_test_question/',params,messageList)
}