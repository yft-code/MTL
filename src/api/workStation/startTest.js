import {post} from '@/utils/request'
export function getDeviceByNumber(params,messageList) {
    return post('/service/get_device_by_number/',params,messageList)
  }