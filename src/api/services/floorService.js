import { endpoints } from '../endpoints.js'
import { createApiResource } from './resourceService.js'

export const floorService = createApiResource(endpoints.floors)
