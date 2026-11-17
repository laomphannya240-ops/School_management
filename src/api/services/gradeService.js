import { endpoints } from '../endpoints.js'
import { createApiResource } from './resourceService.js'

export const gradeService = createApiResource(endpoints.grades)
