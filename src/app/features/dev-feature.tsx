import { Avatar, Badge, Box, Button, Card, Stack, Text, Title } from '@mantine/core'
import { useWallet } from '@solana/wallet-adapter-react'

export function DevFeature() {
  const { wallets } = useWallet()
  return (
    <Stack>
      <Title size="h2">Wallets:</Title>
      {wallets.map((wallet) => (
        <Card key={wallet.adapter.name}>
          <Stack>
            <Box>
              <Badge
                size="xl"
                variant="dot"
                rightSection={<Avatar src={wallet.adapter.icon} size="xs" />}
                color={wallet.adapter.connected ? 'green' : 'gray'}
              >
                {wallet.adapter.name}
              </Badge>
            </Box>
            {wallet.adapter.connected ? (
              <Box>
                <Text ff="monospace" color="dimmed">
                  {wallet.adapter.publicKey?.toString() ?? 'Public key unknown'}
                </Text>
                <Button onClick={() => wallet.adapter.disconnect()}>Disconnect</Button>
              </Box>
            ) : (
              <Box>
                <Button
                  onClick={() => {
                    console.log('wallet', wallet.adapter)
                    return wallet.adapter.connect()
                  }}
                >
                  Connect
                </Button>
              </Box>
            )}
            <Box>
              <Button
                onClick={() => {
                  console.log(`wallet.readyState ${wallet.adapter.name} => ${wallet.readyState}`)
                  console.log('wallet', wallet.adapter)
                }}
              >
                Debug
              </Button>
            </Box>
          </Stack>
        </Card>
      ))}
    </Stack>
  )
}
