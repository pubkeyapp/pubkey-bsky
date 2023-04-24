import { atomWithStorage } from 'jotai/utils'
import { storageKeys } from '../storage'
import { TlFilterReply, TlFilterRepost } from './types'

export const tlFilterReplyAtom = atomWithStorage<TlFilterReply>(storageKeys.config.tlFilters.reply.$, 'following')
export const tlFilterRepostAtom = atomWithStorage<TlFilterRepost>(storageKeys.config.tlFilters.repost.$, 'latest')
