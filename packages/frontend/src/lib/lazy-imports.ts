/**
 * Lazy Imports for Route-Level Code Splitting
 * Dynamic imports with loading states for better performance
 */

import React, { lazy } from 'react'

// Dashboard Components (temporarily disabled until components are created)
// export const DashboardOverview = lazy(() => import('@/components/dashboard/dashboard-overview'))
// export const PackManager = lazy(() => import('@/components/pack/pack-manager'))
// export const TerritoryManager = lazy(() => import('@/components/territory/territory-manager'))
// export const MoonCalendar = lazy(() => import('@/components/moon/moon-calendar'))
// export const ProfileSettings = lazy(() => import('@/components/profile/profile-settings'))

// Game Components (temporarily disabled)
// export const GameLobby = lazy(() => import('@/components/game/game-lobby'))
// export const GameBoard = lazy(() => import('@/components/game/game-board'))
// export const GameResults = lazy(() => import('@/components/game/game-results'))

// Werewolf Components
export const PackCard = lazy(() => import('@/components/werewolf/pack-card').then(module => ({ default: module.PackCard })))
export const TerritoryMap = lazy(() => import('@/components/werewolf/territory-map').then(module => ({ default: module.TerritoryMap })))
export const TransformationTimer = lazy(() => import('@/components/werewolf/transformation-timer').then(module => ({ default: module.TransformationTimer })))
export const MoonPhaseIndicator = lazy(() => import('@/components/werewolf/moon-phase-indicator').then(module => ({ default: module.MoonPhaseIndicator })))

// Auth Components (temporarily disabled)
// export const LoginForm = lazy(() => import('@/components/auth/login-form'))
// export const RegisterForm = lazy(() => import('@/components/auth/register-form')) 
// export const ForgotPasswordForm = lazy(() => import('@/components/auth/forgot-password-form'))

// Admin Components (temporarily disabled)
// export const AdminDashboard = lazy(() => import('@/components/admin/admin-dashboard'))
// export const UserManagement = lazy(() => import('@/components/admin/user-management'))
// export const GameManagement = lazy(() => import('@/components/admin/game-management'))

// Landing Page Components
export const HeroSection = lazy(() => import('@/components/landing/hero-section').then(module => ({ default: module.HeroSection })))
export const FeaturesSection = lazy(() => import('@/components/landing/features-section').then(module => ({ default: module.FeaturesSection })))
// export const TestimonialsSection = lazy(() => import('@/components/landing/testimonials-section'))

// Utility Components (temporarily disabled)
// export const Charts = lazy(() => import('@/components/charts/charts'))
// export const DataTable = lazy(() => import('@/components/ui/data-table'))
// export const FileUpload = lazy(() => import('@/components/ui/file-upload'))

// Chat Components (temporarily disabled)
// export const ChatInterface = lazy(() => import('@/components/chat/chat-interface'))
// export const ChatWindow = lazy(() => import('@/components/chat/chat-window'))

// Settings Components (temporarily disabled)
// export const SecuritySettings = lazy(() => import('@/components/settings/security-settings'))
// export const NotificationSettings = lazy(() => import('@/components/settings/notification-settings'))
// export const ThemeSettings = lazy(() => import('@/components/settings/theme-settings'))

// Helper function for creating lazy components with error boundaries  
export const withLazyLoading = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = lazy(importFn)
  
  return function LazyWrapper(props: any) {
    return React.createElement(LazyComponent, props)
  }
}

// Preload functions for critical components
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be used soon
  // import('@/components/dashboard/dashboard-overview')
  import('@/components/werewolf/moon-phase-indicator')
  import('@/components/werewolf/pack-card')
}

// Route-based preloading
export const preloadRouteComponents = (route: string) => {
  switch (route) {
    case '/dashboard':
      // import('@/components/dashboard/dashboard-overview')
      import('@/components/werewolf/moon-phase-indicator')
      break
    case '/pack':
      // import('@/components/pack/pack-manager')
      import('@/components/werewolf/pack-card')
      break
    case '/territories':
      // import('@/components/territory/territory-manager')
      import('@/components/werewolf/territory-map')
      break
    case '/moon':
      // import('@/components/moon/moon-calendar')
      import('@/components/werewolf/moon-phase-indicator')
      import('@/components/werewolf/transformation-timer')
      break
    case '/game':
      // import('@/components/game/game-lobby')
      // import('@/components/game/game-board')
      break
    default:
      break
  }
}