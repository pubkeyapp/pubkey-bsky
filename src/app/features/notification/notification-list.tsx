import { Container } from '@mantine/core'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import InfiniteScroll from 'react-infinite-scroller'

import { useAtp } from '../../atp/atp-provider'
import { queryKeys } from '../../atp/query-keys'
import { RevalidateOnPost } from '../../atp/types'
import { UiLoader } from '../../ui/ui-loader'
import { NotificationItem } from './notification.item'

export function NotificationList() {
  const { bsky } = useAtp()
  const mounted = React.useRef(false)
  const queryClient = useQueryClient()
  const { data, status, error, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: queryKeys.notifications.$,
    async queryFn({ pageParam }) {
      const resp = await bsky.notification.listNotifications({
        limit: 20,
        // passing `undefined` breaks the query somehow
        ...(pageParam ? { cursor: pageParam.cursor } : {}),
      })
      return resp.data
    },
    getNextPageParam(lastPage) {
      return lastPage.cursor ? { cursor: lastPage.cursor } : undefined
    },
  })
  const allItems = (data?.pages.flatMap((p) => p.notifications) ?? []).filter((n) => !n.author.viewer?.muted)
  const revalidateOnPost: RevalidateOnPost = ({ replyTarget }) => {
    if (replyTarget) {
      queryClient.refetchQueries(queryKeys.posts.single.$({ uri: replyTarget.post.uri }))
    }
  }

  React.useEffect(() => {
    if (!mounted.current) {
      bsky.notification.updateSeen({
        seenAt: new Date().toISOString(),
      })
      queryClient.setQueryData(queryKeys.notifications.count.$, () => 0)
    }
    mounted.current = true
  }, [queryClient])

  if (status === 'loading') {
    return <UiLoader />
  } else if (status === 'error') {
    return <span>Error: {(error as Error).message}</span>
  }

  return (
    <Container size="lg" sx={{ border: '1px solid red' }}>
      <InfiniteScroll
        pageStart={0}
        loadMore={() => !isFetchingNextPage && fetchNextPage()}
        hasMore={hasNextPage}
        loader={<UiLoader />}
      >
        <>
          {allItems.map((item) => (
            <NotificationItem key={`${item.uri}:${item.reason}:${item.isRead}`} notification={item} />
          ))}
        </>
        {!hasNextPage && <div key="__noMore">nothing more to say...</div>}
      </InfiniteScroll>
      {/* used when reply */}
      {/*<PostComposer revalidate={revalidateOnPost} showButton={false} />*/}
    </Container>
  )
}
