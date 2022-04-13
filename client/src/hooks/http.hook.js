import {useState, useCallback} from 'react'

export const useHttp = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
    setLoading(true)
    try {
      if (body) {       
        headers['Content-Type'] = 'application/json'
      }
      const response = await fetch(url, {method, body, headers});  
      if (!response.ok) {
        throw new Error( 'Something went wrong :(')
      }
      setLoading(false);
      if(method === 'GET'){
        const data = await response.json();
        return data
      } 
    } catch (e) {
      setLoading(false)
      setError(e.message)
      throw e
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { loading, request, error, clearError }
}