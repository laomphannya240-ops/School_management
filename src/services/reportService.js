import {endpoints} from '../api/endpoints.js'
import {createResourceService} from './resourceService.js'
export const reportService=createResourceService(endpoints.reports)
