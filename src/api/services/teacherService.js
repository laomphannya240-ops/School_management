import { endpoints } from '../endpoints.js'
import { createApiResource } from './resourceService.js'

export const teacherService = createApiResource(endpoints.teachers)
