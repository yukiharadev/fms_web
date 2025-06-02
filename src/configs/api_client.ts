import Constants from '@/utils/constant'
import axios from 'axios'

const api = axios.create({
  baseURL: Constants.API_BASE_URL,
  timeout: Constants.API_REQUEST_TIMEOUT || 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (!originalRequest._retry) {
            originalRequest._retry = true
            try {
              const refreshToken = localStorage.getItem('refresh_token')
              const xClientId = localStorage.getItem('user_id')
              if (!refreshToken || !xClientId) {
                throw new Error('No refresh token or client ID available')
              }

              const response = await axios.post(`${Constants.API_BASE_URL}/refresh-token`, {
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  'x-client-id': xClientId,
                  'x-refresh-token': refreshToken,
                },
              })

              const { access_token, refresh_token } = response.data

              localStorage.setItem('access_token', access_token)
              localStorage.setItem('refresh_token', refresh_token)

              originalRequest.headers.Authorization = `Bearer ${access_token}`

              return api(originalRequest)
            } catch (refreshError) {
              localStorage.removeItem('access_token')
              localStorage.removeItem('refresh_token')
              localStorage.removeItem('user_id')
              return Promise.reject(refreshError)
            }
          } else {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            localStorage.removeItem('user_id')
          }
          break

        case 403: // Forbidden
          console.warn('Access forbidden. Check permissions.')
          break

        case 404: // Not Found
          console.warn('Resource not found.')
          break

        case 500: // Server Error
          console.error('Server error occurred.')
          break

        default:
          console.error('Unexpected error:', error.response)
          break
      }
    } else if (error.request) {
      console.error('Network Error: Please check your internet connection.')
    }

    return Promise.reject(error)
  },
)

export default api
