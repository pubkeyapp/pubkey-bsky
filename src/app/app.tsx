import { Container } from '@mantine/core'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './app.routes'
import { AtpProvider } from './atp/atp-provider'
import { queryClient } from './atp/query-client'
import { SolanaProvider } from './solana-provider'
import { UiLayout } from './ui/layout'
import { UiThemeProvider } from './ui/theme'

export function App() {
  return (
    <BrowserRouter>
      <UiThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AtpProvider>
            <SolanaProvider>
              <UiLayout>
                <Container h="100%">
                  <AppRoutes />
                </Container>
              </UiLayout>
            </SolanaProvider>
          </AtpProvider>
        </QueryClientProvider>
      </UiThemeProvider>
    </BrowserRouter>
  )
}
