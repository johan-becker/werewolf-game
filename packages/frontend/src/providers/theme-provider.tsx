'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuthStore } from '@/stores/auth-store'

type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isTransforming: boolean
  moonPhaseIntensity: number
  setMoonPhaseIntensity: (intensity: number) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
  enableTransformationMode?: boolean
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'werewolf-theme',
  enableTransformationMode = true,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light')
  const [isTransforming, setIsTransforming] = useState(false)
  const [moonPhaseIntensity, setMoonPhaseIntensity] = useState(0)
  const [mounted, setMounted] = useState(false)
  
  const { user, updatePreferences } = useAuthStore()

  // System theme detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? 'dark' : 'light'
        setResolvedTheme(systemTheme)
        updateDocumentTheme(systemTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    handleChange() // Initial call

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  // Initialize theme from storage or user preferences
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(storageKey)
      const userPreferredTheme = user?.preferences?.theme
      
      const initialTheme = userPreferredTheme || storedTheme || defaultTheme
      setThemeState(initialTheme as Theme)
    } catch {
      // localStorage might not be available
      setThemeState(defaultTheme)
    }
    
    setMounted(true)
  }, [storageKey, defaultTheme, user?.preferences?.theme])

  // Apply theme to document
  const updateDocumentTheme = (resolvedTheme: ResolvedTheme) => {
    const root = document.documentElement
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark', 'transforming')
    
    // Add new theme class
    root.classList.add(resolvedTheme)
    
    // Add transformation mode if active
    if (isTransforming && enableTransformationMode) {
      root.classList.add('transforming')
    }

    // Update CSS custom properties for smooth transitions
    root.style.setProperty('--moon-intensity', moonPhaseIntensity.toString())
    
    // Apply werewolf-specific theme adjustments
    if (resolvedTheme === 'dark') {
      root.style.setProperty('--background', 'var(--shadow-950)')
      root.style.setProperty('--foreground', 'var(--moonlight-50)')
      root.style.setProperty('--card', 'var(--shadow-900)')
      root.style.setProperty('--card-foreground', 'var(--moonlight-100)')
      root.style.setProperty('--primary', 'var(--blood-600)')
      root.style.setProperty('--primary-foreground', 'var(--moonlight-50)')
      root.style.setProperty('--secondary', 'var(--forest-800)')
      root.style.setProperty('--secondary-foreground', 'var(--forest-100)')
      root.style.setProperty('--muted', 'var(--shadow-800)')
      root.style.setProperty('--muted-foreground', 'var(--moonlight-400)')
      root.style.setProperty('--accent', 'var(--moonlight-800)')
      root.style.setProperty('--accent-foreground', 'var(--moonlight-100)')
      root.style.setProperty('--border', 'var(--shadow-700)')
      root.style.setProperty('--input', 'var(--shadow-800)')
      root.style.setProperty('--ring', 'var(--blood-500)')
    } else {
      root.style.setProperty('--background', 'var(--moonlight-50)')
      root.style.setProperty('--foreground', 'var(--shadow-900)')
      root.style.setProperty('--card', 'var(--moonlight-100)')
      root.style.setProperty('--card-foreground', 'var(--shadow-800)')
      root.style.setProperty('--primary', 'var(--blood-700)')
      root.style.setProperty('--primary-foreground', 'var(--moonlight-50)')
      root.style.setProperty('--secondary', 'var(--forest-100)')
      root.style.setProperty('--secondary-foreground', 'var(--forest-800)')
      root.style.setProperty('--muted', 'var(--moonlight-200)')
      root.style.setProperty('--muted-foreground', 'var(--shadow-600)')
      root.style.setProperty('--accent', 'var(--moonlight-200)')
      root.style.setProperty('--accent-foreground', 'var(--shadow-800)')
      root.style.setProperty('--border', 'var(--moonlight-300)')
      root.style.setProperty('--input', 'var(--moonlight-200)')
      root.style.setProperty('--ring', 'var(--blood-600)')
    }

    // Transformation mode overrides
    if (isTransforming && enableTransformationMode) {
      const intensity = Math.min(moonPhaseIntensity / 100, 1)
      
      if (resolvedTheme === 'dark') {
        // During transformation, intensify blood colors
        root.style.setProperty('--primary', `color-mix(in srgb, var(--blood-500) ${50 + intensity * 50}%, var(--blood-700))`)
        root.style.setProperty('--ring', `color-mix(in srgb, var(--blood-400) ${30 + intensity * 70}%, var(--blood-600))`)
        root.style.setProperty('--background', `color-mix(in srgb, var(--shadow-950) ${100 - intensity * 10}%, var(--blood-950))`)
      } else {
        // Light mode transformation effects
        root.style.setProperty('--primary', `color-mix(in srgb, var(--blood-600) ${60 + intensity * 40}%, var(--blood-800))`)
        root.style.setProperty('--ring', `color-mix(in srgb, var(--blood-500) ${40 + intensity * 60}%, var(--blood-700))`)
        root.style.setProperty('--background', `color-mix(in srgb, var(--moonlight-50) ${100 - intensity * 5}%, var(--blood-50))`)
      }
    }
  }

  // Update resolved theme when theme changes
  useEffect(() => {
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      setResolvedTheme(systemTheme)
    } else {
      setResolvedTheme(theme as ResolvedTheme)
    }
  }, [theme])

  // Apply theme when resolved theme changes
  useEffect(() => {
    if (mounted) {
      updateDocumentTheme(resolvedTheme)
    }
  }, [resolvedTheme, isTransforming, moonPhaseIntensity, mounted, enableTransformationMode])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    
    try {
      localStorage.setItem(storageKey, newTheme)
    } catch {
      // localStorage might not be available
    }

    // Update user preferences if logged in
    if (user) {
      updatePreferences({ theme: newTheme })
    }
  }

  const toggleTheme = () => {
    if (theme === 'system') {
      setTheme('light')
    } else if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  // Auto dark mode during full moon (optional enhancement)
  useEffect(() => {
    if (!enableTransformationMode) return

    // This could be connected to actual moon phase data
    const checkMoonPhase = () => {
      const now = new Date()
      const lunarCycle = 29.53059 // days
      const knownNewMoon = new Date('2000-01-06')
      const daysSinceKnownNewMoon = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24)
      const cyclePosition = (daysSinceKnownNewMoon % lunarCycle) / lunarCycle
      
      // Full moon is around 0.5 in the cycle
      const distanceFromFullMoon = Math.abs(cyclePosition - 0.5)
      const fullMoonIntensity = Math.max(0, 100 - (distanceFromFullMoon * 200))
      
      setMoonPhaseIntensity(fullMoonIntensity)
      
      // Auto-enable transformation mode during full moon
      if (fullMoonIntensity > 80 && theme !== 'dark') {
        setIsTransforming(true)
      } else if (fullMoonIntensity < 30) {
        setIsTransforming(false)
      }
    }

    checkMoonPhase()
    const interval = setInterval(checkMoonPhase, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [theme, enableTransformationMode])

  if (!mounted) {
    // Prevent hydration mismatch by not rendering until mounted
    return <>{children}</>
  }

  const contextValue: ThemeContextValue = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isTransforming,
    moonPhaseIntensity,
    setMoonPhaseIntensity,
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  return context
}

// Enhanced theme transitions for werewolf transformations
export function useTransformationTheme() {
  const { isTransforming, moonPhaseIntensity, setMoonPhaseIntensity } = useTheme()
  
  const triggerTransformation = () => {
    setMoonPhaseIntensity(100)
    // Could trigger additional effects like screen shake, color pulses, etc.
  }

  const endTransformation = () => {
    setMoonPhaseIntensity(0)
  }

  return {
    isTransforming,
    moonPhaseIntensity,
    triggerTransformation,
    endTransformation,
  }
}