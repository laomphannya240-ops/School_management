import { endpoints } from '../endpoints.js'
import { createApiResource } from './resourceService.js'

export const attendanceService = createApiResource(endpoints.attendance)
