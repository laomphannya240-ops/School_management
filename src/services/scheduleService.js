import {endpoints} from '../api/endpoints.js'
import {createResourceService} from './resourceService.js'

export const scheduleService=createResourceService(endpoints.schedules)
