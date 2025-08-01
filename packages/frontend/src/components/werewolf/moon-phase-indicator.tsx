'use client'

import { useEffect, useState } from 'react'
import { Moon, MoonIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type MoonPhase = 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' | 'full' | 'waning-gibbous' | 'last-quarter' | 'waning-crescent'

interface MoonPhaseIndicatorProps {
  phase?: MoonPhase
  size?: 'small' | 'medium' | 'large'
  showLabel?: boolean
  animated?: boolean
  className?: string
}

const moonPhases: Record<MoonPhase, { name: string; icon: string; luminosity: number }> = {
  'new': { name: 'New Moon', icon: '🌑', luminosity: 0 },
  'waxing-crescent': { name: 'Waxing Crescent', icon: '🌒', luminosity: 25 },
  'first-quarter': { name: 'First Quarter', icon: '🌓', luminosity: 50 },
  'waxing-gibbous': { name: 'Waxing Gibbous', icon: '🌔', luminosity: 75 },
  'full': { name: 'Full Moon', icon: '🌕', luminosity: 100 },
  'waning-gibbous': { name: 'Waning Gibbous', icon: '🌖', luminosity: 75 },
  'last-quarter': { name: 'Last Quarter', icon: '🌗', luminosity: 50 },
  'waning-crescent': { name: 'Waning Crescent', icon: '🌘', luminosity: 25 },
}

const sizeClasses = {
  small: 'w-8 h-8 text-lg',
  medium: 'w-16 h-16 text-3xl',
  large: 'w-24 h-24 text-5xl',
}

export function MoonPhaseIndicator({
  phase,
  size = 'medium',
  showLabel = true,
  animated = true,
  className,
}: MoonPhaseIndicatorProps) {
  const [currentPhase, setCurrentPhase] = useState<MoonPhase>('new')
  const [isGlowing, setIsGlowing] = useState(false)

  // Calculate current moon phase if not provided
  useEffect(() => {
    if (phase) {
      setCurrentPhase(phase)
      return
    }

    // Calculate moon phase based on current date
    const now = new Date()
    const lunarCycle = 29.53059 // days
    const knownNewMoon = new Date('2000-01-06') // Known new moon date
    const daysSinceKnownNewMoon = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24)
    const cyclePosition = (daysSinceKnownNewMoon % lunarCycle) / lunarCycle

    let calculatedPhase: MoonPhase
    if (cyclePosition < 0.0625) calculatedPhase = 'new'
    else if (cyclePosition < 0.1875) calculatedPhase = 'waxing-crescent'
    else if (cyclePosition < 0.3125) calculatedPhase = 'first-quarter'
    else if (cyclePosition < 0.4375) calculatedPhase = 'waxing-gibbous'
    else if (cyclePosition < 0.5625) calculatedPhase = 'full'
    else if (cyclePosition < 0.6875) calculatedPhase = 'waning-gibbous'
    else if (cyclePosition < 0.8125) calculatedPhase = 'last-quarter'
    else calculatedPhase = 'waning-crescent'

    setCurrentPhase(calculatedPhase)
  }, [phase])

  // Glow effect for full moon
  useEffect(() => {
    if (currentPhase === 'full' && animated) {
      const interval = setInterval(() => {
        setIsGlowing(prev => !prev)
      }, 2000)
      return () => clearInterval(interval)
    }
    return undefined
  }, [currentPhase, animated])

  const phaseData = moonPhases[currentPhase]
  const isFullMoon = currentPhase === 'full'

  return (
    <div className={cn('flex flex-col items-center space-y-2', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full border-2 transition-all duration-500',
          sizeClasses[size],
          isFullMoon
            ? 'border-red-400 bg-gradient-to-br from-gray-100 to-gray-300'
            : 'border-gray-600 bg-gradient-to-br from-gray-800 to-gray-900',
          animated && isFullMoon && isGlowing && 'shadow-lg shadow-red-400/50 scale-105',
          animated && 'hover:scale-110'
        )}
      >
        <span className="select-none filter drop-shadow-sm">
          {phaseData.icon}
        </span>
        
        {/* Transformation danger indicator for full moon */}
        {isFullMoon && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </div>

      {showLabel && (
        <div className="text-center space-y-1">
          <p className={cn(
            'font-medium',
            size === 'small' ? 'text-xs' : size === 'medium' ? 'text-sm' : 'text-base',
            isFullMoon ? 'text-red-600' : 'text-foreground'
          )}>
            {phaseData.name}
          </p>
          <div className="flex items-center space-x-2">
            <div className={cn(
              'h-1 rounded-full bg-gray-200',
              size === 'small' ? 'w-16' : size === 'medium' ? 'w-20' : 'w-24'
            )}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-gray-400 to-red-400 transition-all duration-1000"
                style={{ width: `${phaseData.luminosity}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {phaseData.luminosity}%
            </span>
          </div>
        </div>
      )}
    </div>
  )
}