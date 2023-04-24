import { RichText, RichTextProps, RichTextSegment } from '@atproto/api'
import { Anchor, TypographyStylesProvider } from '@mantine/core'
import React from 'react'
import { Link } from 'react-router-dom'

type TruncateOptions = {
  max: number
  ellipsis?: boolean
}

export function truncate(postText: string, { max, ellipsis = true }: TruncateOptions) {
  return postText.slice(0, max) + (postText.length > max && ellipsis ? '…' : '')
}

export type Props = RichTextProps & {
  className?: string
}

export function RichTextRenderer({ text, facets, className }: Props) {
  const content = React.useMemo(() => {
    let rt: RichText
    try {
      rt = new RichText({ text, facets })
    } catch (e) {
      console.error(e)
      return <span>Could&apos;nt parse RichText</span>
    }
    return (
      <>
        {Array.from(rt.segments()).map((seg) => (
          <SegmentToElement
            key={
              seg.facet ? `${seg.facet.index.byteStart}-${seg.facet.index.byteEnd}` : seg.text // FIXME: whitespace are easily duplicated
            }
            segment={seg}
          />
        ))}
      </>
    )
  }, [facets, text])

  return <TypographyStylesProvider className={className}>{content}</TypographyStylesProvider>
}

function SegmentToElement({ segment }: { segment: RichTextSegment }): React.ReactElement {
  if (segment.isLink() && segment.link) {
    return (
      <Anchor
        href={segment.link.uri}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => void e.stopPropagation()}
      >
        {/* Strip URL scheme and truncate */}
        {truncate(segment.text.replace(/^.*:\/\//, ''), { max: 28 })}
      </Anchor>
    )
  } else if (segment.isMention() && segment.mention) {
    return (
      <Anchor component={Link} to={`/profile/${segment.mention.did}`} onClick={(e) => void e.stopPropagation()}>
        {segment.text}
      </Anchor>
    )
  } else {
    return <>{segment.text}</>
  }
}
