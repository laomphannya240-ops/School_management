import { endpoints } from '../endpoints.js'
import { createApiResource } from './resourceService.js'

export const subjectService = createApiResource(endpoints.subjects)
