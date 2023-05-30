import {post} from '@/utils/request'
export function getTaskProject(params,messageList) {
    return post('/service/get_create_task_project/',params,messageList)
}

export function getTestApplyById(params,messageList) {
    return post('/PerformancePCTest/get_test_apply_by_id/',params,messageList)
}
// 提交申请表单
export function submitApplication(url,params,messageList) {
    return post(url,params,messageList,'formData')
}