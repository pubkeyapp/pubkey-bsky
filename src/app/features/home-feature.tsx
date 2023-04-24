import { Stack, Title } from '@mantine/core'
import { useEffect } from 'react'
import { useAtp } from '../atp/atp-provider'

export function HomeFeature() {
  const { atp } = useAtp()

  useEffect(() => {
    if (atp.hasSession) {
      console.log(`Welcome back, ${atp.session?.handle} ${atp.session?.did} !`)
    } else {
      console.log(`Welcome to the app!`)

      // atp
      //   .login({
      //     password: 'Moeilijk123!',
      //     identifier: 'beeman.dev',
      //   })
      //   .then((res) => {
      //     console.log('Login result', res)
      //   })
    }
  }, [])
  return (
    <Stack spacing={64}>
      <Title>Hi.</Title>
    </Stack>
  )
}
