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
  logout: () => void
  error?: unknown | undefined
  profile?: ProfileViewDetailed | undefined
  refresh: () => Promise<void>
  session?: AtpSessionData | undefined
}

const AtpContext = createContext<AtpProviderContext>({} as AtpProviderContext)

export function AtpProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<unknown | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileViewDetailed | undefined>(undefined)
  const [session, setSession] = useState<AtpSessionData | undefined>(undefined)

  function refresh() {
    console.log(`AtpProvider refresh: getting account`)
    return getAccount()
      .then((res) => {
        console.log(`AtpProvider refresh: got account`, res)
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
        console.error(`AtpProvider refresh: error`, err)
        setError(err)
      })
  }

  useEffect(() => {
    refresh()
  }, [])

  const value: AtpProviderContext = {
    atp,
    authenticated: !!session && !!profile,
    bsky,
    error,
    loading,
    logout: () => {
      localStorage.removeItem(storageKeys.session.$)
      window.location.reload()
    },
    profile,
    refresh,
    session,
  }
  return <AtpContext.Provider value={value}>{children}</AtpContext.Provider>
}

export const useAtp = () => useContext(AtpContext)
