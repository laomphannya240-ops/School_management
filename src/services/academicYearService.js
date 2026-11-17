import { endpoints } from '../api/endpoints.js'
import { createApiResource } from './resourceService.js'

export const academicYearService = createApiResource(endpoints.academicyears)
