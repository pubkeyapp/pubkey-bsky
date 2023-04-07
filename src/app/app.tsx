import { Container } from '@mantine/core'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DevFeature } from './features/dev-feature'
import { HomeFeature } from './features/home-feature'
import { SolanaProvider } from './solana-provider'
import { UiLayout } from './ui/layout'
import { UiThemeProvider } from './ui/theme'
import { UiNotFound } from './ui/ui-not-found'

export function App() {
  return (
    <BrowserRouter>
      <UiThemeProvider>
        <SolanaProvider>
          <UiLayout>
            <Container>
              <Routes>
                <Route path="/" element={<HomeFeature />} />
                <Route path="/dev" element={<DevFeature />} />
                <Route path="*" element={<UiNotFound />} />
              </Routes>
            </Container>
          </UiLayout>
        </SolanaProvider>
      </UiThemeProvider>
    </BrowserRouter>
  )
}
