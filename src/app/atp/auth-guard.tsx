import { Alert } from '@mantine/core'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { UiFull, UiLoader } from '../ui/ui-loader'
import { useAtp } from './atp-provider'

export function AuthGuard({ redirectTo }: { redirectTo: string }) {
  const { error, loading, authenticated } = useAtp()
  const location = useLocation()

  if (loading) {
    return (
      <UiFull>
        <UiLoader />
      </UiFull>
    )
  }

  if (error) {
    return (
      <UiFull>
        <Alert>An error occurred: {error?.toString()}</Alert>
      </UiFull>
    )
  }

  return authenticated ? <Outlet /> : <Navigate replace to={redirectTo} state={{ from: location }} />
}
