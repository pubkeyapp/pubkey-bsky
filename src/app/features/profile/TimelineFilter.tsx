import { Radio } from '@mantine/core'

import { IconFilter } from '@tabler/icons-react'
import { useAtom } from 'jotai'
import React from 'react'
import { tlFilterReplyAtom, tlFilterRepostAtom } from '../../atp/lib/tlFilterAtoms'
import { TlFilterReply, TlFilterRepost } from '../../atp/lib/types'

type Register = (
  name: 'reply' | 'repost',
  value: TlFilterReply | TlFilterRepost,
) => {
  name: string
  value: string
  checked: boolean
  onChange: React.FormEventHandler<HTMLInputElement>
}

export function TimelineFilter() {
  const [reply, setReply] = useAtom(tlFilterReplyAtom)
  const [repost, setRepost] = useAtom(tlFilterRepostAtom)
  const register: Register = (name: 'reply' | 'repost', value: TlFilterReply | TlFilterRepost) => {
    return {
      name,
      value,
      checked: (name === 'reply' ? reply : repost) === value,
      onChange: (e) => {
        if (e.currentTarget.checked) {
          if (e.currentTarget.name === 'reply') {
            setReply(e.currentTarget.value as TlFilterReply)
          } else {
            setRepost(e.currentTarget.value as TlFilterRepost)
          }
        }
      },
    }
  }

  return (
    <details>
      <summary>
        <IconFilter />
        <span>Filters</span>
      </summary>
      <div>
        <Radio.Group label="Reply" aria-required>
          <Radio label="All" size={RADIO_SIZE} {...register('reply', 'all')} />
          <Radio label="Following" size={RADIO_SIZE} {...register('reply', 'following')} />
          <Radio label="None" size={RADIO_SIZE} {...register('reply', 'none')} />
        </Radio.Group>
        <Radio.Group label="Repost" aria-required>
          <Radio label="All" size={RADIO_SIZE} {...register('repost', 'all')} />
          <Radio label="Latest" size={RADIO_SIZE} {...register('repost', 'latest')} />
          <Radio label="None" size={RADIO_SIZE} {...register('repost', 'none')} />
        </Radio.Group>
      </div>
    </details>
  )
}

const RADIO_SIZE = 'sm' as const
