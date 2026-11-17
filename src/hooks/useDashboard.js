import { useCallback, useEffect, useState } from 'react'
import { dataService } from '../services/dataService.js'

export function useDashboard(role) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    // eslint-disable-next-line react/set-state-in-effect
    setLoading(true)
    setError(null)
    try {
      setData(await dataService.dashboard(role))
    } catch (reason) {
      setError(reason)
    } finally {
      setLoading(false)
    }
  }, [role])

  // eslint-disable-next-line react/set-state-in-effect
  useEffect(() => { load() }, [load])
  return { data, loading, error, reload: load }
}
