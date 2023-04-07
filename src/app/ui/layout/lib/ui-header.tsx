import { Anchor, createStyles, Flex, Group, Header } from '@mantine/core'
import { WalletMultiButton } from '@pubkeyapp/wallet-adapter-mantine-ui'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

const useStyles = createStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
  },
}))

interface UiHeaderProps {
  logo: ReactNode
}

export function UiHeader({ logo }: UiHeaderProps) {
  const { classes } = useStyles()

  return (
    <Header height={60}>
      <Flex className={classes.header}>
        <Group spacing={2}>
          <Anchor component={Link} to="/" className={classes.logoLink}>
            {logo}
          </Anchor>
        </Group>
        <Group>
          <WalletMultiButton variant="default" />
        </Group>
      </Flex>
    </Header>
  )
}
