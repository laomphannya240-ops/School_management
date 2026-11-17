import {endpoints} from '../api/endpoints.js'
import {createResourceService} from './resourceService.js'
export const studentService=createResourceService(endpoints.students)
