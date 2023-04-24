import { bsky } from './atp-service'

export async function followUser({ repo, did }: { repo: string; did: string }) {
  return bsky.graph.follow.create(
    { repo },
    {
      subject: did,
      createdAt: new Date().toISOString(),
    },
  )
}
