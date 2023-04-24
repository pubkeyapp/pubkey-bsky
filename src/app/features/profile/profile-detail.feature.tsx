import { RichText, RichTextProps, RichTextSegment } from '@atproto/api'
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs'
import {
  Anchor,
  Avatar,
  Box,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  TypographyStylesProvider,
  useMantineTheme,
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { Link, Route, useNavigate, useParams } from 'react-router-dom'
import { atp, bsky } from '../../atp/atp-service'
import { UiDebug } from '../../ui/ui-debug'
import { UiFull, UiLoader } from '../../ui/ui-loader'
import { UiTabRoutes } from '../../ui/ui-tab-routes'
import { ProfileDetailFollowersFeature } from './profile-detail-followers.feature'
import { ProfileDetailFollowsFeature } from './profile-detail-follows.feature'

type TruncateOptions = {
  max: number
  ellipsis?: boolean
}

export function truncate(postText: string, { max, ellipsis = true }: TruncateOptions) {
  return postText.slice(0, max) + (postText.length > max && ellipsis ? '…' : '')
}

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
            { value: 'posts', label: 'Posts', component: <UiDebug data={'POSTS'} open /> },
            { value: 'replies', label: 'Posts & replies', component: <UiDebug data={'REPLIES'} open /> },
            { value: 'follows', label: 'Following', component: <ProfileDetailFollowsFeature /> },
            { value: 'followers', label: 'Followers', component: <ProfileDetailFollowersFeature /> },
          ]}
        />
      </Paper>
    </Stack>
  )
}

type Props = RichTextProps & {
  className?: string
}

export function RichTextRenderer({ text, facets, className }: Props) {
  const content = React.useMemo(() => {
    let rt: RichText
    try {
      rt = new RichText({ text, facets })
    } catch (e) {
      console.error(e)
      return <span>Could&apos;nt parse RichText</span>
    }
    return (
      <>
        {Array.from(rt.segments()).map((seg) => (
          <SegmentToElement
            key={
              seg.facet ? `${seg.facet.index.byteStart}-${seg.facet.index.byteEnd}` : seg.text // FIXME: whitespace are easily duplicated
            }
            segment={seg}
          />
        ))}
      </>
    )
  }, [facets, text])

  return <TypographyStylesProvider className={className}>{content}</TypographyStylesProvider>
}

function SegmentToElement({ segment }: { segment: RichTextSegment }): React.ReactElement {
  if (segment.isLink() && segment.link) {
    return (
      <Anchor
        href={segment.link.uri}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => void e.stopPropagation()}
      >
        {/* Strip URL scheme and truncate */}
        {truncate(segment.text.replace(/^.*:\/\//, ''), { max: 28 })}
      </Anchor>
    )
  } else if (segment.isMention() && segment.mention) {
    return (
      <Anchor component={Link} to={`/profile/${segment.mention.did}`} onClick={(e) => void e.stopPropagation()}>
        {segment.text}
      </Anchor>
    )
  } else {
    return <>{segment.text}</>
  }
}
