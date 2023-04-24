import type { AppBskyActorDefs } from '@atproto/api'
import { Alert, Box } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { type QueryFunction, type QueryKey, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroller'
import { UiLoader } from '../../ui/ui-loader'
import UserListItem from './UserListItem'

export type UserListQueryFn<K extends QueryKey> = QueryFunction<
  {
    cursor?: string
    users: AppBskyActorDefs.ProfileViewDetailed[]
  },
  K
>

type Props<K extends QueryKey> = {
  queryKey: K
  queryFn: UserListQueryFn<K>
  className?: string
}

export function UserList<K extends QueryKey>({ queryKey, queryFn, className }: Props<K>) {
  const { status, data, error, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey,
    queryFn,
    getNextPageParam: (lastPage) => {
      return lastPage.cursor ? { cursor: lastPage.cursor } : undefined
    },
    refetchOnMount: false,
  })
  const queryClient = useQueryClient()
  const revalidate = () => void queryClient.invalidateQueries(queryKey)

  const allItems = data?.pages.flatMap((p) => p.users) ?? []

  if (status === 'loading') {
    return (
      <Box p="md">
        <UiLoader />
      </Box>
    )
  } else if (status === 'error') {
    return <span>Error: {(error as Error).message}</span>
  }

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={() => !isFetchingNextPage && fetchNextPage()}
      hasMore={hasNextPage}
      loader={<UiLoader key="__loader" />}
      className={className}
    >
      <>
        {allItems.map((item) => (
          <UserListItem user={item} revalidate={revalidate} key={item.did} />
        ))}
        {!hasNextPage && (
          <Box p="md">
            <Alert icon={<IconAlertCircle size="1rem" />} title="That's it!">
              There is nothing more to show...
            </Alert>
          </Box>
        )}
      </>
    </InfiniteScroll>
  )
}
