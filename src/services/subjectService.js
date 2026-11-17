import {endpoints} from '../api/endpoints.js'
import {createResourceService} from './resourceService.js'
export const subjectService=createResourceService(endpoints.subjects)
