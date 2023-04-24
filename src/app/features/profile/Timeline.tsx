import type { AppBskyFeedDefs } from '@atproto/api'
import { FeedViewPost } from '@atproto/api/dist/client/types/app/bsky/feed/defs'
import { Button, Loader, Skeleton } from '@mantine/core'

import { type QueryFunction, type QueryKey, useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroller'
import { reloadTimelineForNewPosts } from '../../atp/lib/reloadTimelineForNewPosts'
import { queryKeys } from '../../atp/query-keys'
import { UiDebug } from '../../ui/ui-debug'
import { UiLoader } from '../../ui/ui-loader'

export function feedItemToUniqueKey(item: AppBskyFeedDefs.FeedViewPost): string {
  return `${item.post.cid}:${item.reason?.$type}:${(item.reason?.by as any)?.did}`
}

export type TimelineQueryFn<K extends QueryKey> = QueryFunction<
  {
    cursor?: string
    feed: FeedViewPost[]
  },
  K
>

type Props<K extends QueryKey> = {
  queryKey: K
  queryFn: TimelineQueryFn<K>
  fetchNewLatest: () => Promise<AppBskyFeedDefs.FeedViewPost | undefined>
  maxPages?: number
  filter?: (posts: AppBskyFeedDefs.FeedViewPost[]) => AppBskyFeedDefs.FeedViewPost[]
}

export function Timeline<K extends QueryKey>({
  queryKey,
  queryFn,
  fetchNewLatest,
  maxPages,
  filter = (posts) => posts,
}: Props<K>) {
  const { status, data, error, isFetchingNextPage, isFetching, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery(
    {
      queryKey,
      queryFn,
      getNextPageParam: (lastPage, allPages) => {
        if (maxPages && allPages.length >= maxPages) return undefined
        return lastPage.cursor ? { cursor: lastPage.cursor } : undefined
      },
      refetchOnMount: false,
    },
  )
  const queryClient = useQueryClient()

  const allItems = filter(data?.pages.flatMap((p) => p.feed) ?? [])
  const currentLatestUri = allItems.at(0)?.post.uri

  const { data: isNewAvailable } = useQuery(
    queryKeys.feed.new.$(queryKey, currentLatestUri, fetchNewLatest),
    async () => {
      const newLatest = await fetchNewLatest()
      console.log({ curr: currentLatestUri, new: newLatest?.post.uri })
      if (!newLatest) return false
      // FIXME: consider about reposts which share the same URI
      return newLatest.post.uri !== currentLatestUri
    },
    {
      refetchInterval: 15 * 1000, // 15 seconds; the same as the official web app
      refetchOnWindowFocus: false,
    },
  )

  const loadNewPosts = () => {
    reloadTimelineForNewPosts(queryClient, queryKey)
  }

  const revalidateOnPost = () => {
    queryClient.invalidateQueries(queryKey)
  }

  if (status === 'loading') {
    return <Skeleton />
  } else if (status === 'error') {
    return <span>Error: {(error as Error).message}</span>
  }

  return (
    <>
      <InfiniteScroll
        pageStart={0}
        loadMore={() => !isFetchingNextPage && fetchNextPage()}
        hasMore={hasNextPage}
        loader={<UiLoader />}
      >
        <>
          {allItems.map((item) => (
            <UiDebug
              data={item}
              key={feedItemToUniqueKey(item)}
              // revalidate={refetch}
              // mutatePostCache={mutatePostCache}
              // className={styles.post}
            />
          ))}
          {!hasNextPage && <div key="__noMore">nothing more to say...</div>}
        </>
      </InfiniteScroll>
      {isNewAvailable && (
        <Button size="sm" onClick={loadNewPosts} variant="soft" disabled={isFetching && !isFetchingNextPage}>
          {isFetching && !isFetchingNextPage ? <Loader size="sm" /> : 'Load new posts'}
        </Button>
      )}
      {/*<PostComposer revalidate={revalidateOnPost} />*/}
    </>
  )
}
