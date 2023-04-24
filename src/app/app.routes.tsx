import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthGuard } from './atp/auth-guard'
import { DevFeature } from './features/dev-feature'
import { HomeFeature } from './features/home-feature'
import { LoginFeature } from './features/login/login-feature'
import { NotificationsRoutes } from './features/notification/notifications.routes'
import { ProfileRoutes } from './features/profile/profile.routes'
import { SearchFeature } from './features/search.feature'
import { SettingsFeature } from './features/settings-feature'
import { UiNotFound } from './ui/ui-not-found'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthGuard redirectTo="/login" />}>
        <Route index element={<Navigate to={'/home'} />} />
        <Route path="/home" element={<HomeFeature />} />
        <Route path="/dev" element={<DevFeature />} />
        <Route path="/notifications/*" element={<NotificationsRoutes />} />
        <Route path="/profile/*" element={<ProfileRoutes />} />
        <Route path="/search/*" element={<SearchFeature />} />
        <Route path="/settings/*" element={<SettingsFeature />} />
        <Route path="*" element={<UiNotFound />} />
      </Route>
      <Route path="/login" element={<LoginFeature />} />
      <Route path="*" element={<UiNotFound />} />
    </Routes>
  )
}
