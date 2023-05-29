import {post} from '@/utils/request'
export function editReminder(params,messageList) {
    return post('/service/edit_reminder/',params,messageList)
  }