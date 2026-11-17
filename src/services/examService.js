import {endpoints} from '../api/endpoints.js'
import {createResourceService} from './resourceService.js'
export const examService=createResourceService(endpoints.exams)
