import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs'
import { Stack } from '@mantine/core'
import { bsky } from '../../atp/atp-service'
import { queryKeys } from '../../atp/query-keys'
import { UserList, UserListQueryFn } from './UserList'

export function ProfileDetailFollowsFeature({ profile }: { profile: ProfileViewDetailed }) {
  const queryKey = queryKeys.users.following.$({ user: profile.handle })
  const queryFn: UserListQueryFn<typeof queryKey> = async ({ pageParam }) => {
    const resp = await bsky.graph.getFollows({
      actor: profile.handle,
      limit: 25,
      ...(pageParam ? { cursor: pageParam.cursor } : {}),
    })
    // TODO: ?????
    if (!resp.success) throw new Error('Fetch error')
    return {
      users: resp.data.follows,
      cursor: resp.data.cursor,
    }
  }

  return (
    <Stack>
      <UserList queryKey={queryKey} queryFn={queryFn} />
    </Stack>
  )
}
