import { Box, Group, Stack, Title } from '@mantine/core'
import { NotificationList } from './notification-list'

export function NotificationsRoutes() {
  return (
    <Stack>
      <Title size="h2">Notifications</Title>
      <Box sx={{ border: '1px solid red' }}>
        <NotificationList />
      </Box>
    </Stack>
  )
}
