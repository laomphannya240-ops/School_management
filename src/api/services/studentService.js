import { endpoints } from '../endpoints.js'
import { createApiResource } from './resourceService.js'

export const studentService = createApiResource(endpoints.students)
