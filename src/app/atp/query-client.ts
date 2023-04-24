import { QueryClient } from '@tanstack/react-query'
import { showNotificationError } from '../ui/notifications'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
    mutations: {
      onError(error) {
        showNotificationError(`An error occurred: ${error}`)
      },
    },
  },
})
