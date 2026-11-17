import { endpoints } from '../api/endpoints.js'
import { createApiResource } from './resourceService.js'

export const settingService = createApiResource(endpoints.settings)
