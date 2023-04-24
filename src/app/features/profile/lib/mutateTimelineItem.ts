import { AppBskyFeedGetTimeline, AppBskyFeedDefs } from '@atproto/api'
import { InfiniteData } from '@tanstack/react-query'
import produce, { Draft } from 'immer'

export type TimelineInfiniteData = InfiniteData<AppBskyFeedGetTimeline.OutputSchema>
