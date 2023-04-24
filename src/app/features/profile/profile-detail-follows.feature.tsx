import { useAtp } from '../../atp/atp-provider'
import { UiDebug } from '../../ui/ui-debug'

export function ProfileDetailFollowsFeature() {
  const { profile } = useAtp()
  if (!profile) {
    return null
  }
  return <UiDebug data={profile} />
}
