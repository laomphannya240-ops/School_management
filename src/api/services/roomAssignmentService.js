import { endpoints } from '../endpoints.js'
import { createApiResource } from './resourceService.js'

export const roomAssignmentService = createApiResource(endpoints['room-assignments'])
