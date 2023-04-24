import { Box, Flex, Stack } from '@mantine/core'
import { PubKeyLogo } from '@pubkeyapp/logo'
import { ReactNode, Suspense } from 'react'
import { UiLoader } from '../../ui-loader'
import { UiHeader } from './ui-header'

export function UiLayout({ children }: { children: ReactNode }) {
  const logo = <PubKeyLogo size={32} />
  return (
    <Flex mih="100vh" h="100vh" direction="column" justify="space-between">
      <Stack sx={{ flexGrow: 1 }}>
        <UiHeader logo={logo} />
        <Box h="100%">
          <Suspense fallback={<UiLoader type="full" />}>{children}</Suspense>
        </Box>
      </Stack>
    </Flex>
  )
}
