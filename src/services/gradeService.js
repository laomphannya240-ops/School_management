import {endpoints} from '../api/endpoints.js'
import {createResourceService} from './resourceService.js'
export const gradeService=createResourceService(endpoints.grades)
