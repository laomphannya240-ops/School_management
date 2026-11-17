import {
  createModuleRecord,
  deleteModuleRecord,
  getModuleRecords,
  getDashboardData,
  moduleIdentity,
  saveModuleRecords,
  updateModuleRecord,
} from './mockService.js'
import { apiModuleName, apiResources } from '../api/services/index.js'

/**
 * Single entry point used by hooks.
 * ---------------------------------------------------------------------------
 * VITE_USE_MOCK_API=true  (default) -> local demo data, no network calls.
 * VITE_USE_MOCK_API=false -> Laravel REST API through the Axios instance.
 *
 * Switching modes never requires touching a page component.
 */
const env = import.meta.env || {}
export const USE_MOCK_API = env.VITE_USE_MOCK_API !== 'false'
const LATENCY = Number(env.VITE_MOCK_LATENCY || 220)
const wait = () => (LATENCY ? new Promise((resolve) => setTimeout(resolve, LATENCY)) : Promise.resolve())

function unwrap(response) {
  // Axios response interceptor already returns response.data; support both
  // bare arrays and Laravel-style { data: [...] } payloads.
  return Array.isArray(response) ? response : (response?.data ?? [])
}

function apiFor(module) {
  return apiResources[apiModuleName(module)]
}

export const dataService = {
  async list(module, role = 'admin', params = {}) {
    if (USE_MOCK_API) {
      await wait()
      return getModuleRecords(module, role)
    }
    return unwrap(await apiFor(module)?.list(params))
  },

  async create(module, values, role = 'admin') {
    if (USE_MOCK_API) {
      await wait()
      return createModuleRecord(module, values, role)
    }
    return unwrap(await apiFor(module)?.create(values))
  },

  async update(module, id, values, role = 'admin') {
    if (USE_MOCK_API) {
      await wait()
      const idKey = moduleIdentity[module] || 'record_id'
      return updateModuleRecord(module, idKey, id, values, role)
    }
    return unwrap(await apiFor(module)?.update(id, values))
  },

  async remove(module, id, role = 'admin') {
    if (USE_MOCK_API) {
      await wait()
      const idKey = moduleIdentity[module] || 'record_id'
      return deleteModuleRecord(module, idKey, id, role)
    }
    return apiFor(module)?.remove(id)
  },

  async dashboard(role = 'admin') {
    if (USE_MOCK_API) {
      await wait()
      return getDashboardData(role)
    }
    const [students, teachers, classes, subjects, attendance, exams, payments, notifications] = await Promise.all([
      apiResources.students.list({ per_page: 5 }),
      apiResources.teachers.list({ per_page: 5 }),
      apiResources.classes.list({ per_page: 5 }),
      apiResources.subjects.list({ per_page: 5 }),
      apiResources.attendance.list(),
      apiResources.exams.list({ upcoming: 1 }),
      apiResources.payments.list({ per_page: 5 }),
      apiResources.notifications.list({ per_page: 4 }),
    ])
    return {
      ...getDashboardData(role),
      students: unwrap(students), teachers: unwrap(teachers), classes: unwrap(classes),
      subjects: unwrap(subjects), attendance: unwrap(attendance), exams: unwrap(exams),
      payments: unwrap(payments), notifications: unwrap(notifications),
    }
  },

  async saveAll(module, rows) {
    if (USE_MOCK_API) {
      await wait()
      return saveModuleRecords(module, rows)
    }
    // Real APIs normally expose bulk endpoints; fall back to sequential PUTs.
    return Promise.all(rows.map((row) => apiFor(module)?.update(row[moduleIdentity[module] || 'id'], row)))
  },
}
