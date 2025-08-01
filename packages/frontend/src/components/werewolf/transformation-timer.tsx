'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Moon, Clock, AlertTriangle, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TransformationPhase = 'SAFE' | 'WARNING' | 'CRITICAL' | 'TRANSFORMING'

interface TransformationTimerProps {
  nextFullMoon?: Date
  currentMoonPhase?: string
  transformationDuration?: number // in seconds
  showWarnings?: boolean
  size?: 'compact' | 'normal' | 'detailed'
  className?: string
  onTransformationStart?: () => void
  onTransformationEnd?: () => void
  onPhaseChange?: (phase: TransformationPhase) => void
}

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

const phaseColors: Record<TransformationPhase, string> = {
  SAFE: 'text-forest-600 bg-forest-100',
  WARNING: 'text-amber-600 bg-amber-100',
  CRITICAL: 'text-blood-600 bg-blood-100',
  TRANSFORMING: 'text-purple-600 bg-purple-100',
}

export function TransformationTimer({
  nextFullMoon,
  currentMoonPhase = 'waxing-crescent',
  transformationDuration = 180, // 3 minutes default
  showWarnings = true,
  size = 'normal',
  className,
  onTransformationStart,
  onTransformationEnd,
  onPhaseChange,
}: TransformationTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  })
  const [currentPhase, setCurrentPhase] = useState<TransformationPhase>('SAFE')
  const [isTransforming, setIsTransforming] = useState(false)
  const [transformProgress, setTransformProgress] = useState(0)

  // Calculate time until next full moon
  const calculateTimeRemaining = useCallback(() => {
    const now = new Date()
    let targetDate = nextFullMoon

    // If no specific date provided, calculate next full moon
    if (!targetDate) {
      const lunarCycle = 29.53059 * 24 * 60 * 60 * 1000 // milliseconds
      const knownFullMoon = new Date('2000-01-21') // Known full moon date
      const timeSinceKnown = now.getTime() - knownFullMoon.getTime()
      const cyclesSinceKnown = Math.floor(timeSinceKnown / lunarCycle)
      const nextCycle = cyclesSinceKnown + 1
      targetDate = new Date(knownFullMoon.getTime() + (nextCycle * lunarCycle))
    }

    const difference = targetDate.getTime() - now.getTime()

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0,
      }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      total: difference,
    }
  }, [nextFullMoon])

  // Determine transformation phase based on time remaining
  const getTransformationPhase = useCallback((timeLeft: TimeRemaining): TransformationPhase => {
    if (isTransforming) return 'TRANSFORMING'
    
    const totalMinutes = timeLeft.days * 24 * 60 + timeLeft.hours * 60 + timeLeft.minutes
    
    if (totalMinutes <= 0) return 'CRITICAL'
    if (totalMinutes <= 60) return 'CRITICAL' // 1 hour
    if (totalMinutes <= 360) return 'WARNING' // 6 hours
    return 'SAFE'
  }, [isTransforming])

  // Handle transformation sequence
  useEffect(() => {
    if (timeRemaining.total <= 0 && !isTransforming) {
      setIsTransforming(true)
      onTransformationStart?.()
      
      let progress = 0
      const interval = setInterval(() => {
        progress += (100 / transformationDuration)
        setTransformProgress(progress)
        
        if (progress >= 100) {
          clearInterval(interval)
          setIsTransforming(false)
          setTransformProgress(0)
          onTransformationEnd?.()
          
          // Reset timer for next lunar cycle
          setTimeout(() => {
            setTimeRemaining(calculateTimeRemaining())
          }, 1000)
        }
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [timeRemaining.total, isTransforming, transformationDuration, onTransformationStart, onTransformationEnd, calculateTimeRemaining])

  // Update timer every second
  useEffect(() => {
    const updateTimer = () => {
      const newTimeRemaining = calculateTimeRemaining()
      setTimeRemaining(newTimeRemaining)
      
      const newPhase = getTransformationPhase(newTimeRemaining)
      if (newPhase !== currentPhase) {
        setCurrentPhase(newPhase)
        onPhaseChange?.(newPhase)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [calculateTimeRemaining, getTransformationPhase, currentPhase, onPhaseChange])

  const getPhaseIcon = (phase: TransformationPhase) => {
    switch (phase) {
      case 'SAFE': return <Moon className="w-4 h-4" />
      case 'WARNING': return <Clock className="w-4 h-4" />
      case 'CRITICAL': return <AlertTriangle className="w-4 h-4" />
      case 'TRANSFORMING': return <Zap className="w-4 h-4 animate-pulse" />
    }
  }

  const formatTime = (time: TimeRemaining) => {
    if (size === 'compact') {
      if (time.days > 0) return `${time.days}d ${time.hours}h`
      if (time.hours > 0) return `${time.hours}h ${time.minutes}m`
      return `${time.minutes}m ${time.seconds}s`
    }
    
    return {
      days: time.days,
      hours: time.hours.toString().padStart(2, '0'),
      minutes: time.minutes.toString().padStart(2, '0'),
      seconds: time.seconds.toString().padStart(2, '0'),
    }
  }

  if (size === 'compact') {
    return (
      <Card className={cn('card-werewolf', className)}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className={cn('p-2 rounded-full', phaseColors[currentPhase])}>
              {getPhaseIcon(currentPhase)}
            </div>
            <div>
              <p className="text-sm font-medium">Next Full Moon</p>
              <p className="text-lg font-mono">
                {isTransforming ? 'TRANSFORMING' : formatTime(timeRemaining)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formattedTime = formatTime(timeRemaining)

  return (
    <Card className={cn('card-werewolf', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="font-display">Lunar Transformation</span>
          <Badge className={phaseColors[currentPhase]}>
            {getPhaseIcon(currentPhase)}
            {currentPhase.toLowerCase()}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {isTransforming ? (
          <div className="space-y-3">
            <Alert className="border-purple-200 bg-purple-50">
              <Zap className="w-4 h-4 text-purple-600" />
              <AlertDescription className="text-purple-800">
                Transformation in progress... Stay calm and embrace the change.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Transformation Progress</span>
                <span>{Math.round(transformProgress)}%</span>
              </div>
              <Progress value={transformProgress} className="h-3" />
            </div>
            
            <div className="text-center">
              <div className="animate-pulse text-2xl font-mono text-purple-600">
                🌕 TRANSFORMING 🐺
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Countdown Display */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Time until full moon</p>
              
              {size === 'detailed' ? (
                <div className="grid grid-cols-4 gap-2">
                  {['days', 'hours', 'minutes', 'seconds'].map((unit, index) => {
                    const values = [formattedTime.days, formattedTime.hours, formattedTime.minutes, formattedTime.seconds]
                    return (
                      <div key={unit} className="text-center">
                        <div className="text-2xl font-mono font-bold">{values[index]}</div>
                        <div className="text-xs text-muted-foreground uppercase">{unit}</div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-3xl font-mono font-bold">
                  {formattedTime.days > 0 && `${formattedTime.days}d `}
                  {formattedTime.hours}:{formattedTime.minutes}:{formattedTime.seconds}
                </div>
              )}
            </div>

            {/* Phase Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Phase: {currentMoonPhase}</span>
                <span>Danger Level</span>
              </div>
              <Progress
                value={currentPhase === 'SAFE' ? 10 : currentPhase === 'WARNING' ? 50 : currentPhase === 'CRITICAL' ? 90 : 100}
                className={cn(
                  'h-2',
                  currentPhase === 'CRITICAL' && 'bg-blood-200 [&>div]:bg-blood-600',
                  currentPhase === 'WARNING' && 'bg-amber-200 [&>div]:bg-amber-600'
                )}
              />
            </div>

            {/* Warnings */}
            {showWarnings && currentPhase !== 'SAFE' && (
              <Alert className={cn(
                currentPhase === 'CRITICAL' ? 'border-blood-200 bg-blood-50' : 'border-amber-200 bg-amber-50'
              )}>
                <AlertTriangle className={cn(
                  'w-4 h-4',
                  currentPhase === 'CRITICAL' ? 'text-blood-600' : 'text-amber-600'
                )} />
                <AlertDescription className={cn(
                  currentPhase === 'CRITICAL' ? 'text-blood-800' : 'text-amber-800'
                )}>
                  {currentPhase === 'CRITICAL' 
                    ? 'CRITICAL: Transformation imminent! Seek secure location immediately.'
                    : 'WARNING: Full moon approaching. Prepare for transformation.'
                  }
                </AlertDescription>
              </Alert>
            )}

            {/* Preparation Checklist (detailed mode only) */}
            {size === 'detailed' && currentPhase !== 'SAFE' && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Preparation Checklist:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Secure safe transformation location</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Notify pack members</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Stock emergency supplies</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span>Set protective barriers</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}