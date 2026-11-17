import { endpoints } from '../endpoints.js'
import { createApiResource } from './resourceService.js'

export const reportService = createApiResource(endpoints.reports)
