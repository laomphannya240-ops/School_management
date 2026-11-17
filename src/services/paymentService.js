import {endpoints} from '../api/endpoints.js'
import {createResourceService} from './resourceService.js'
export const paymentService=createResourceService(endpoints.payments)
