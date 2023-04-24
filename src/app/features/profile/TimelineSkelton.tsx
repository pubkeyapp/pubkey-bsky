import { Skeleton } from '@mantine/core'
import styles from './TimelineSkelton.module.scss'

type Props = {
  count: number
}

export function TimelineSkelton({ count = 10 }: Props) {
  return (
    <div>
      {[...Array(count).keys()].map((k) => (
        <Skeleton key={k} className={styles.post} />
      ))}
    </div>
  )
}
