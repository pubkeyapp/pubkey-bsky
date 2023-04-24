import { AppBskyNotificationListNotifications } from '@atproto/api'
import { Anchor, Card, Stack } from '@mantine/core'
import { IconHeart, IconQuote, IconShare, IconUser } from '@tabler/icons-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { usePostThreadQuery } from '../../atp/usePostThreadQuery'
import { UiDebug } from '../../ui/ui-debug'

export function NotificationItem({
  notification,
}: {
  notification: AppBskyNotificationListNotifications.Notification
}) {
  const reason = notification.reason
  const shouldFetchPost = reason === 'reply' || reason === 'repost' || reason === 'like'
  const col2 = reason === 'follow' || reason === 'repost' || reason === 'like'

  return (
    <Stack>
      <div>
        {col2 && <div>{reasonToIcon[notification.reason]}</div>}
        <div>
          {col2 && (
            <>
              <div>
                <ProfileAvatar profile={notification.author} isLink />
              </div>
              <div>
                <Anchor component={Link} to={`/${notification.author.handle}`}>
                  {notification.author.displayName ?? notification.author.handle}
                </Anchor>{' '}
                <span>{reasonToLabel[notification.reason]}</span>
              </div>
            </>
          )}
          {shouldFetchPost && notification.reasonSubject && (
            <NotificationPost uri={notification.reasonSubject} reason={notification.reason} isSubject />
          )}
          {(reason === 'mention' || reason === 'reply' || reason === 'quote') && (
            <NotificationPost uri={notification.uri} reason={notification.reason} isSubject={false} />
          )}
        </div>
      </div>

      <Card>
        <UiDebug data={notification} open />
      </Card>
    </Stack>
  )
}

export function NotificationPost({
  uri,
  reason,
  isSubject,
}: {
  uri: string
  reason: AppBskyNotificationListNotifications.Notification['reason']
  isSubject?: boolean
}) {
  const { data, isLoading, refetch } = usePostThreadQuery({ uri: uri })

  return <div>{uri}</div>
}

export function ProfileAvatar({
  profile,
  isLink,
}: {
  profile: AppBskyNotificationListNotifications.Notification['author']
  isLink?: boolean
}) {
  return (
    <div
      style={{
        backgroundImage: `url(${profile.avatarUrl})`,
      }}
    />
  )
}

const reasonToIcon: Record<AppBskyNotificationListNotifications.Notification['reason'], React.ReactNode> = {
  follow: <IconUser />,
  invite: null,
  mention: null,
  reply: null,
  repost: <IconShare />,
  like: <IconHeart color="red" />,
  quote: <IconQuote />, // TODO: color
}

const reasonToLabel: Record<AppBskyNotificationListNotifications.Notification['reason'], string> = {
  follow: `followed by`,
  invite: ``,
  mention: `mention from`,
  reply: `replied by`,
  repost: `reported by`,
  like: `liked your post`,
  quote: `quoted by`,
}
