import {post} from '@/utils/request'

  export function getReminder(params,messageList) {
    return post('/service/get_reminder/',params,messageList)
  }