import { Navigate, Route, Routes } from 'react-router-dom'
import { useAtp } from '../../atp/atp-provider'
import { ProfileDetailFeature } from './profile-detail.feature'

export function ProfileRoutes() {
  return (
    <Routes>
      <Route index element={<ProfileIndexFeature />} />
      <Route
        path=":handle/*"
        element={
          <Routes>
            <Route path="*" element={<ProfileDetailFeature />} />
          </Routes>
        }
      />
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
