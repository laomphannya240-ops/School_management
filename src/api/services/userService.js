import { endpoints } from '../endpoints.js'
import { createApiResource } from './resourceService.js'

export const userService = createApiResource(endpoints.users)
