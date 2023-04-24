import { Avatar, Button, createStyles, Group, Menu, rem, Text } from '@mantine/core'
import { PubKeyLogoRounded } from '@pubkeyapp/logo'
import {
  IconBell,
  IconChevronDown,
  IconHeart,
  IconLogout,
  IconMessage,
  IconSettings,
  IconStar,
  IconUserCircle,
} from '@tabler/icons-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAtp } from '../../../atp/atp-provider'

const useStyles = createStyles((theme) => ({
  user: {
    color: theme.white,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background!,
        0.1,
      ),
    },

    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  userActive: {
    backgroundColor: theme.fn.lighten(
      theme.fn.variant({ variant: 'filled', color: theme.primaryColor }).background!,
      0.1,
    ),
  },
}))

export function HeaderProfileButton() {
  const { loading, profile, logout } = useAtp()
  const { classes, theme, cx } = useStyles()
  const [userMenuOpened, setUserMenuOpened] = useState(false)

  if (!profile) {
    return (
      <Button component={Link} to="/login">
        Sign in
      </Button>
    )
  }

  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: 'pop-top-right' }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal
    >
      <Menu.Target>
        <Button loading={loading} py={0} className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
          {profile ? (
            <Group spacing={7}>
              {profile?.avatar ? (
                <Avatar src={profile?.avatar} alt={profile?.handle} radius="xl" size={20} />
              ) : (
                <PubKeyLogoRounded inverted size={20} />
              )}
              <Text weight={500} size="sm" sx={{ lineHeight: 1, color: theme.white }} mr={3}>
                {profile?.handle}
              </Text>
              <IconChevronDown size={rem(12)} stroke={1.5} />
            </Group>
          ) : (
            <div />
          )}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item disabled icon={<IconHeart size="0.9rem" stroke={1.5} color={theme.colors.red[6]} />}>
          Liked posts
        </Menu.Item>
        <Menu.Item disabled icon={<IconStar size="0.9rem" stroke={1.5} color={theme.colors.yellow[6]} />}>
          Saved posts
        </Menu.Item>
        <Menu.Item disabled icon={<IconMessage size="0.9rem" stroke={1.5} color={theme.colors.blue[6]} />}>
          Your comments
        </Menu.Item>
        <Menu.Item component={Link} to="/notifications" icon={<IconBell size="0.9rem" stroke={1.5} />}>
          Notifications
        </Menu.Item>
        <Menu.Label>Account</Menu.Label>
        <Menu.Item component={Link} to="/profile" icon={<IconUserCircle size="0.9rem" stroke={1.5} />}>
          Profile
        </Menu.Item>
        <Menu.Item component={Link} to="/settings" icon={<IconSettings size="0.9rem" stroke={1.5} />}>
          Settings
        </Menu.Item>
        <Menu.Item icon={<IconLogout size="0.9rem" stroke={1.5} />} onClick={logout}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
