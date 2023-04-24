import { AtpAgent, AtpSessionData, BskyNS } from '@atproto/api'
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { atp, bsky, getAccount } from './atp-service'
import { storageKeys } from './storage'

export interface AtpProviderContext {
  atp: AtpAgent
  bsky: BskyNS
  authenticated: boolean
  loading: boolean
  error?: unknown | undefined
  profile?: ProfileViewDetailed | undefined
  session?: AtpSessionData | undefined
}

const AtpContext = createContext<AtpProviderContext>({} as AtpProviderContext)

export function AtpProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<unknown | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileViewDetailed | undefined>(undefined)
  const [session, setSession] = useState<AtpSessionData | undefined>(undefined)

  useEffect(() => {
    console.log(`AtpProvider: getting account`)
    getAccount()
      .then((res) => {
        console.log(`AtpProvider: got account`, res)
        if (res) {
          setProfile(res.profile)
          setSession(res.session)
        } else {
          setProfile(undefined)
          setSession(undefined)
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
      })
  }, [])

  const value: AtpProviderContext = {
    atp,
    authenticated: !!session && !!profile,
    bsky,
    error,
    loading,
    profile,
    session,
  }
  return <AtpContext.Provider value={value}>{children}</AtpContext.Provider>
}

export const useAtp = () => useContext(AtpContext)
