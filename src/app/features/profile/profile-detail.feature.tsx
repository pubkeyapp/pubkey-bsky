import { RichText } from '@atproto/api'
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs'
import { Avatar, Box, Group, Image, Paper, Stack, Text, useMantineTheme } from '@mantine/core'
import { IconVolumeOff } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { Link, useLoaderData, useNavigate, useParams, useRevalidator } from 'react-router-dom'
import { atp, bsky } from '../../atp/atp-service'
import { followUser } from '../../atp/followUser'
import { useTimelineFilter } from '../../atp/lib/useTimelineFilter'
import { queryKeys } from '../../atp/query-keys'
import { unfollowUser } from '../../atp/unfollowUser'
import { UiDebug, UiDebugModal } from '../../ui/ui-debug'
import { UiFull, UiLoader } from '../../ui/ui-loader'
import { UiTabRoutes } from '../../ui/ui-tab-routes'
import { ProfileDetailFollowersFeature } from './profile-detail-followers.feature'
import { ProfileDetailFollowsFeature } from './profile-detail-follows.feature'
import { RichTextRenderer } from './rich-text.renderer'
import { Timeline, TimelineQueryFn } from './Timeline'
import { TimelineFilter } from './TimelineFilter'

export async function loadProfile({ handle }: { handle: string }) {
  const resp = await bsky.actor.getProfile({
    actor: handle,
  })
  const profile = resp.data
  const richText = new RichText({ text: profile.description ?? '' })
  await richText.detectFacets(atp)
  return { profile: resp.data, richText }
}

export function ProfileDetailFeature() {
  const { handle } = useParams<{ handle: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<ProfileViewDetailed | null>(null)
  const [richText, setRichText] = useState<RichText | null>(null)
  useEffect(() => {
    if (!handle) {
      throw new Error('Invalid params')
    }
    setLoading(true)
    loadProfile({ handle }).then((res) => {
      if (handle.startsWith('did:') && res.profile?.handle !== handle) {
        console.log('Redirecting to profile', res.profile?.handle)
        navigate(`/profile/${res.profile?.handle}`, { replace: true })
      }
      setProfile(res.profile as ProfileViewDetailed)
      setRichText(res.richText)
      setLoading(false)
    })
  }, [handle])
  const theme = useMantineTheme()

  if (!profile || loading) {
    return (
      <UiFull>
        <UiLoader />
      </UiFull>
    )
  }

  return (
    <Stack align="center">
      {/*<Title size="h2">Profile: {handle}</Title>*/}
      <Paper withBorder w={600} p={0} radius={0}>
        <Box>
          {profile?.banner ? <Image src={profile?.banner} alt="Banner" /> : null}
          <Box px="md" mt={profile?.banner ? -50 : 'md'}>
            <Avatar
              src={profile?.avatar}
              alt="Avatar"
              size="xl"
              radius={50}
              sx={{ border: '2px solid ' + theme.black }}
            />
          </Box>
          <Box px="md">
            <Text size={32} weight="bold">
              {profile?.displayName}
            </Text>
            <Text color="dimmed">@{profile?.handle}</Text>
          </Box>
          <Box px="md" mt="md">
            <Group spacing={4}>
              <Group spacing={2}>
                <Text weight="semibold">{profile?.followsCount}</Text>
                <Text component={Link} to={`/profile/${profile.handle}/follows`} color="dimmed">
                  following
                </Text>
              </Group>
              <Group spacing={2}>
                <Text weight="semibold">{profile?.followersCount}</Text>
                <Text component={Link} to={`/profile/${profile.handle}/followers`} color="dimmed">
                  followers
                </Text>
              </Group>
              <Group spacing={2}>
                <Text weight="semibold">{profile?.postsCount}</Text>
                <Text component={Link} to={`/profile/${profile.handle}/posts`} color="dimmed">
                  posts
                </Text>
              </Group>
            </Group>
          </Box>
          <Box px="md" py="md">
            <RichTextRenderer facets={richText?.facets} text={richText?.text ?? ''} />
          </Box>
        </Box>
        <UiTabRoutes
          grow={false}
          tabs={[
            {
              value: 'posts',
              label: 'Posts',
              component: <ProfileDetailsPostsFeature profile={profile} />,
            },
            {
              value: 'replies',
              label: 'Posts & replies',
              component: (
                <Stack p="md">
                  <UiDebug data={'REPLIES'} open />
                </Stack>
              ),
            },
            { value: 'follows', label: 'Following', component: <ProfileDetailFollowsFeature profile={profile} /> },
            { value: 'followers', label: 'Followers', component: <ProfileDetailFollowersFeature profile={profile} /> },
          ]}
        />
        <UiDebugModal data={profile} />
      </Paper>
    </Stack>
  )
}

export function ProfileDetailsPostsFeature({ profile }: { profile: ProfileViewDetailed }) {
  const queryKey = queryKeys.feed.author.$(profile.handle)
  const queryFn: TimelineQueryFn<typeof queryKey> = async ({ queryKey, pageParam }) => {
    const resp = await bsky.feed.getAuthorFeed({
      actor: queryKey[1].authorId,
      limit: 30,
      // passing `undefined` breaks the query somehow
      ...(pageParam ? { cursor: pageParam.cursor } : {}),
    })
    // TODO: ?????
    if (!resp.success) throw new Error('Fetch error')
    return resp.data
  }
  const { timelineFilter } = useTimelineFilter()
  const fetchLatest = React.useCallback(
    async () =>
      timelineFilter(
        (
          await bsky.feed.getAuthorFeed({
            actor: profile.handle,
            limit: 1,
          })
        ).data.feed,
      ).at(0),
    [profile.handle, timelineFilter],
  )

  const muted = !!profile.viewer?.muted

  return (
    <Box>
      <div>
        {muted ? (
          <p>
            <IconVolumeOff aria-hidden />
            Muted
          </p>
        ) : (
          <div hidden={muted}>
            <TimelineFilter />
            <Timeline queryKey={queryKey} queryFn={queryFn} fetchNewLatest={fetchLatest} filter={timelineFilter} />
          </div>
        )}
      </div>
    </Box>
  )
}

const UNFOLLOW_DESCRIBE_ID = 'unfollow-describe' as const
