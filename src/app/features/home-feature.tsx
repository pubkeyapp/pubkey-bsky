import { Stack, Title } from '@mantine/core'
import { WalletDisconnectButton, WalletMultiButton } from '@pubkeyapp/wallet-adapter-mantine-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { UiFull, UiLoader } from '../ui/ui-loader'

export function HomeFeature() {
  const { connected, connecting } = useWallet()
  if (connecting) {
    return <UiLoader type="full" />
  }

  return connected ? <HomeConnected /> : <HomeNotConnected />
}

export function HomeNotConnected() {
  return (
    <UiFull>
      <Stack spacing={64}>
        <Title>Connect a Solana wallet.</Title>
        <WalletMultiButton />
      </Stack>
    </UiFull>
  )
}

export function HomeConnected() {
  const { publicKey } = useWallet()
  return (
    <UiFull>
      <Stack spacing={64}>
        <Title>Connected as {ellipsify(`${publicKey}`)}.</Title>
        <WalletDisconnectButton />
      </Stack>
    </UiFull>
  )
}

export function ellipsify(str = '', len = 4) {
  if (str.length > 30) {
    return str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
  }
  return str
}
