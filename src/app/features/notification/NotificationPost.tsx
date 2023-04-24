import { AppBskyFeedDefs, AppBskyFeedPost, AppBskyNotificationListNotifications } from '@atproto/api'
import { Skeleton, Text } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { buildPostUrl } from '../../atp/atp-service'
import { usePostThreadQuery } from '../../atp/usePostThreadQuery'
import { UiDebug } from '../../ui/ui-debug'

// import Post from "@/src/app/post/components/Post";
// import { PostSkelton } from "@/src/app/post/components/PostSkelton";
// import { usePostThreadQuery } from "@/src/app/post/hooks/usePostThreadQuery";
// import { buildPostUrl } from "@/src/app/post/lib/buildPostUrl";
// import { MutatePostCache } from "@/src/app/post/lib/types";
// import { queryKeys } from "@/src/app/root/lib/queryKeys";
// import Prose from "@/src/components/Prose";
import styles from './NotificationPost.module.scss'

type NotificationReason = AppBskyNotificationListNotifications.Notification['reason']

type Props = {
  uri: string
  reason: NotificationReason
  isSubject: boolean
}

export function NotificationPost({ uri, reason, isSubject }: Props) {
  const { data, isLoading, refetch } = usePostThreadQuery({ uri: uri })

  const postElem = <NonSubjectPost view={data} isLoading={isLoading} revalidate={refetch} />
  const simplePostElm = <SubjectPost view={data} isLoading={isLoading} />

  switch (reason) {
    case 'mention':
      return isSubject ? simplePostElm : postElem
    case 'reply':
      return isSubject ? <div className={styles.replySubject}>{simplePostElm}</div> : postElem
    case 'repost':
    case 'like':
      // always subject
      return simplePostElm
    case 'quote':
      return postElem
    default:
      return null
  }
}

type PostProps = {
  view?: AppBskyFeedDefs.FeedViewPost | null
  isLoading: boolean
}

function SubjectPost({ view, isLoading }: PostProps) {
  if (isLoading) return <p className={styles.loading}>投稿を取得中...</p>
  if (!view) return <article className={styles.notFound}>削除済みの投稿</article>
  if (!AppBskyFeedPost.isRecord(view.post.record)) return null

  return (
    <article className={styles.subject}>
      <Link
        to={buildPostUrl({
          handle: view.post.author.handle,
          uri: view.post.uri,
        })}
      >
        <Text>{view.post.record.text}</Text>
      </Link>
    </article>
  )
}

// FIXME: better name?
function NonSubjectPost({
  view,
  isLoading,
  revalidate,
}: PostProps & {
  revalidate: () => void
}) {
  const queryClient = useQueryClient()

  if (isLoading) return <Skeleton />
  if (!view) return <article className={styles.notFound}>Not Found</article>
  if (!AppBskyFeedPost.isRecord(view.post.record)) return null

  return <UiDebug data={view} />
}
