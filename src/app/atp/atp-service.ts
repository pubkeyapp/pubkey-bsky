import { AtpAgent, AtpSessionData, RichText } from '@atproto/api'
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs'
import { storageKeys } from './storage'
import { AtUri } from '@atproto/uri'

export const buildPostUrl = (params: { handle: string; uri: string }) =>
  `/${params.handle}/posts/${new AtUri(params.uri).rkey}`

export const atp = new AtpAgent({
  service: 'https://bsky.social',
  persistSession: (e, session) => {
    switch (e) {
      case 'create':
      case 'update':
        localStorage.setItem(storageKeys.session.$, JSON.stringify(session))
        break
      case 'expired':
      case 'create-failed':
        localStorage.removeItem(storageKeys.session.$)
        break
    }
  },
})

export async function getAccount(): Promise<{ profile: ProfileViewDetailed; session: AtpSessionData } | undefined> {
  let session = atp.session
  if (!session) {
    const sessionString = localStorage.getItem(storageKeys.session.$)
    if (!sessionString) return undefined
    session = JSON.parse(sessionString) as AtpSessionData
    await atp.resumeSession(session)
  }
  const resp = await bsky.actor.getProfile({
    actor: session.handle,
  })
  return {
    profile: resp.data,
    session,
  }
}

export const bsky = atp.api.app.bsky

export function isRichTextValid(rt: RichText) {
  return rt.length <= 3000 && rt.graphemeLength <= 300
}

export function isPostValid(rt: RichText, imageLen: number) {
  return isRichTextValid(rt) && (rt.graphemeLength > 0 || imageLen > 0)
}

export type AtpError = {
  error: 'NotFound'
  message: string
}

export function isAtpError(err: unknown): err is AtpError {
  if (typeof err !== 'object' || err === null) return false
  return 'error' in err && 'message' in err
}
