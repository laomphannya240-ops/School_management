import { endpoints } from '../endpoints.js'
import { createApiResource } from './resourceService.js'

export const examService = createApiResource(endpoints.exams)
