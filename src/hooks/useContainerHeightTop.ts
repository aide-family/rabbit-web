import { useEffect, useState } from 'react'

export function useContainerHeightTop(
  ref: React.RefObject<HTMLElement>,
  datasource: unknown[],
  isFullscreen?: boolean
): number {
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const updateHeight = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        setHeight(rect.top)
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)

    return () => {
      window.removeEventListener('resize', updateHeight)
    }
  }, [ref, datasource, isFullscreen])

  return height
}

