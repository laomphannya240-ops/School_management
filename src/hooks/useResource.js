import { useCallback, useEffect, useState } from 'react'
import { dataService } from '../services/dataService.js'
import { moduleIdentity } from '../constants/moduleIdentity.js'

/**
 * Pages -> useResource -> dataService -> (mockService | Axios API services).
 * Handles loading, error state and optimistic local updates for every module.
 */
export function useResource(module, role = 'admin', params) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const reload = useCallback(async () => {
    // eslint-disable-next-line react/set-state-in-effect
    setLoading(true)
    setError(null)
    try {
      const data = await dataService.list(module, role, params)
      setRows(Array.isArray(data) ? data : [])
    } catch (reason) {
      setError(reason)
    } finally {
      setLoading(false)
    }
  }, [module, role, params])

  // eslint-disable-next-line react/set-state-in-effect
  useEffect(() => { reload() }, [reload])

  const refresh = useCallback((data) => setRows(data), [])

  const create = useCallback(async (values) => {
    const row = await dataService.create(module, values, role)
    await reload()
    return row
  }, [module, role, reload])

  const update = useCallback(async (id, values) => {
    const result = await dataService.update(module, id, values, role)
    await reload()
    return result
  }, [module, role, reload])

  const remove = useCallback(async (id) => {
    const result = await dataService.remove(module, id, role)
    await reload()
    return result
  }, [module, role, reload])

  const saveAll = useCallback(async (nextRows) => {
    const result = await dataService.saveAll(module, nextRows)
    setRows(nextRows)
    return result
  }, [module])

  const idOf = useCallback((row) => row?.[moduleIdentity[module] || 'record_id'], [module])

  return { rows, setRows: refresh, loading, error, reload, create, update, remove, saveAll, idOf }
}
