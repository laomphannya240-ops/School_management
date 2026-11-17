import { api } from '../axios.js'

/**
 * Generic Laravel REST resource adapter.
 * Every module service is built from this factory so request/response handling
 * stays in one place and pages never call Axios directly.
 */
export function createApiResource(endpoint) {
  return {
    list: (params = {}) => api.get(endpoint, { params }),
    get: (id) => api.get(`${endpoint}/${id}`),
    create: (payload) => api.post(endpoint, payload),
    update: (id, payload) => api.put(`${endpoint}/${id}`, payload),
    remove: (id) => api.delete(`${endpoint}/${id}`),
  }
}
