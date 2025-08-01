'use client'

import { useEffect, useState } from 'react'

interface StatsCounterProps {
  end: number
  duration?: number
  start?: number
}

export function StatsCounter({ end, duration = 2000, start = 0 }: StatsCounterProps) {
  const [count, setCount] = useState(start)

  useEffect(() => {
    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      
      const currentCount = Math.floor(progress * (end - start) + start)
      setCount(currentCount)
      
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    
    window.requestAnimationFrame(step)
  }, [end, start, duration])

  return <span>{count.toLocaleString()}</span>
}