import { useAtomValue } from 'jotai'
import { atp } from '../atp-service'
import { TlFilterFn, tlFiltersToFn } from './timelineFilters'
import { tlFilterReplyAtom, tlFilterRepostAtom } from './tlFilterAtoms'

export function useTimelineFilter() {
  const tlFilterReply = useAtomValue(tlFilterReplyAtom)
  const tlFilterRepost = useAtomValue(tlFilterRepostAtom)
  const timelineFilter: TlFilterFn = atp.session
    ? tlFiltersToFn({ reply: tlFilterReply, repost: tlFilterRepost }, atp.session.did)
    : (posts) => posts
  return {
    timelineFilter,
  }
}
