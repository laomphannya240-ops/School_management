import {endpoints} from '../api/endpoints.js'
import {createResourceService} from './resourceService.js'
export const teacherService=createResourceService(endpoints.teachers)
