import { Anchor, createStyles, Flex, Group, Header } from '@mantine/core'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAtp } from '../../../atp/atp-provider'
import { HeaderProfileButton } from './ui-header-profile'

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
  const { authenticated } = useAtp()
  const { classes } = useStyles()

  return (
    <Header height={60}>
      <Flex className={classes.header}>
        <Group spacing={12}>
          <Anchor component={Link} to="/" className={classes.logoLink}>
            {logo}
          </Anchor>
          {authenticated ? (
            <Group>
              <Anchor component={Link} to="/home">
                Home
              </Anchor>
              <Anchor component={Link} to="/search">
                Search
              </Anchor>
              <Anchor component={Link} to="/notifications">
                Notifications
              </Anchor>
              <Anchor component={Link} to="/profile">
                Profile
              </Anchor>
              <Anchor component={Link} to="/settings">
                Settings
              </Anchor>
              <Anchor component={Link} to="/dev">
                Dev
              </Anchor>
            </Group>
          ) : null}
        </Group>
        <Group>
          {/*<WalletMultiButton variant="default" />*/}
          <HeaderProfileButton />
        </Group>
      </Flex>
    </Header>
  )
}
