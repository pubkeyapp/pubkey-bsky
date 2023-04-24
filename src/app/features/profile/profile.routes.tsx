import { Stack, Title } from '@mantine/core'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { useAtp } from '../../atp/atp-provider'

export function ProfileRoutes() {
  return (
    <Routes>
      <Route index element={<ProfileIndexFeature />} />
      <Route path=":handle" element={<ProfileDetailFeature />} />
    </Routes>
  )
}

export function ProfileIndexFeature() {
  const { profile } = useAtp()

  if (!profile?.handle) {
    return null
  }
  return <Navigate to={`/profile/${profile?.handle}`} replace />
}

export function ProfileDetailFeature() {
  const { handle } = useParams<{ handle: string }>()

  return (
    <Stack>
      <Title size="h2">Profile: {handle}</Title>
    </Stack>
  )
}
