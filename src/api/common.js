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
// 获取不同的测试数据
export function getTestType(url,params,messageList) {
    return post(url,params,messageList)
}

export function updateApplicationWorktime(params,messageList) {
    return post('/service/update_application_worktime/',params,messageList)
}

export function updateApplicationProcess(params,messageList) {
    return post('/service/update_application_process/',params,messageList)
}
// 手游专家兼容性
export function expertTestStart(params,messageList) {
    return post('/expertCompatibility/expert_test_start/',params,messageList)
}
// 端游专家兼容性
export function expertTestStartPc(params,messageList) {
    return post('/expertCompatibilityPC/expert_test_start/',params,messageList)
}
// 手游性能测试
export function mobilePerfTest(params,messageList) {
    return post('/mobilePerfTest/expert_test_start/',params,messageList)
}
// 端游性能测试
export function pcPerfTest(params,messageList) {
    return post('/pcPerfTest/expert_test_start/',params,messageList)
}
// 手游弱网测试
export function mobileWeaknetTest(params,messageList) {
    return post('/mobileWeaknetTest/expert_test_start/',params,messageList)
}
// 端游弱网测试
export function pcWeaknetTest(params,messageList) {
    return post('/pcWeaknetTest/expert_test_start/',params,messageList)
}
// 发送邮件
export function sendEmail(url,params,messageList) {
    return post(url,params,messageList,'formData')
}