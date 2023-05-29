import {post} from '@/utils/request'

export function getCpuLadder(params,messageList) {
    return post('/expertCompatibility/get_cpu_ladder/',params,messageList)
  }