'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export type WerewolfRole = 'ALPHA' | 'BETA' | 'OMEGA' | 'HUNTER' | 'HEALER' | 'SCOUT' | 'GUARDIAN'
export type UserStatus = 'ACTIVE' | 'DORMANT' | 'TRANSFORMED' | 'BANISHED'

export interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  avatar?: string
  role: WerewolfRole
  status: UserStatus
  packId?: string
  packRole?: WerewolfRole
  transformationCount: number
  reputation: number
  joinedAt: string
  lastLogin: string
  isOnline: boolean
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    notifications: {
      moonPhase: boolean
      packActivity: boolean
      territoryChanges: boolean
      transformations: boolean
    }
    privacy: {
      showOnlineStatus: boolean
      allowPackInvites: boolean
      showTransformationHistory: boolean
    }
  }
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export interface AuthState {
  // Authentication state
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // User data
  user: User | null
  tokens: AuthTokens | null
  
  // Authentication methods
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  refreshTokens: () => Promise<void>
  
  // User profile methods
  updateProfile: (updates: Partial<User>) => Promise<void>
  updatePreferences: (preferences: Partial<User['preferences']>) => void
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  
  // Pack-related methods
  joinPack: (packId: string) => Promise<void>
  leavePack: () => Promise<void>
  updatePackRole: (role: WerewolfRole) => void
  
  // Utility methods
  clearError: () => void
  setLoading: (loading: boolean) => void
  initialize: () => Promise<void>
}

export interface RegisterData {
  email: string
  password: string
  username: string
  firstName: string
  lastName: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// API utility functions
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

const authenticatedApiCall = async (endpoint: string, tokens: AuthTokens, options: RequestInit = {}) => {
  return apiCall(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${tokens.accessToken}`,
    },
  })
}

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      isAuthenticated: false,
      isLoading: false,
      error: null,
      user: null,
      tokens: null,

      // Authentication methods
      login: async (email: string, password: string) => {
        set((state) => {
          state.isLoading = true
          state.error = null
        })

        try {
          const response = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          })

          set((state) => {
            state.isAuthenticated = true
            state.isLoading = false
            state.user = response.user
            state.tokens = {
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              expiresAt: Date.now() + response.expiresIn * 1000,
            }
          })

          // Set auth cookie for SSR
          document.cookie = `auth-token=${response.accessToken}; path=/; secure; samesite=lax`
        } catch (error) {
          set((state) => {
            state.isLoading = false
            state.error = error instanceof Error ? error.message : 'Login failed'
          })
          throw error
        }
      },

      register: async (userData: RegisterData) => {
        set((state) => {
          state.isLoading = true
          state.error = null
        })

        try {
          const response = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
          })

          set((state) => {
            state.isAuthenticated = true
            state.isLoading = false
            state.user = response.user
            state.tokens = {
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              expiresAt: Date.now() + response.expiresIn * 1000,
            }
          })

          // Set auth cookie for SSR
          document.cookie = `auth-token=${response.accessToken}; path=/; secure; samesite=lax`
        } catch (error) {
          set((state) => {
            state.isLoading = false
            state.error = error instanceof Error ? error.message : 'Registration failed'
          })
          throw error
        }
      },

      logout: () => {
        set((state) => {
          state.isAuthenticated = false
          state.user = null
          state.tokens = null
          state.error = null
        })

        // Clear auth cookie
        document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'

        // Call logout endpoint to invalidate tokens
        const { tokens } = get()
        if (tokens) {
          apiCall('/auth/logout', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          }).catch(() => {
            // Ignore logout errors - user is already logged out locally
          })
        }
      },

      refreshTokens: async () => {
        const { tokens } = get()
        if (!tokens) throw new Error('No refresh token available')

        try {
          const response = await apiCall('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refreshToken: tokens.refreshToken }),
          })

          set((state) => {
            state.tokens = {
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              expiresAt: Date.now() + response.expiresIn * 1000,
            }
          })

          // Update auth cookie
          document.cookie = `auth-token=${response.accessToken}; path=/; secure; samesite=lax`
        } catch (error) {
          // Refresh failed, logout user
          get().logout()
          throw error
        }
      },

      // User profile methods
      updateProfile: async (updates: Partial<User>) => {
        const { tokens } = get()
        if (!tokens) throw new Error('Not authenticated')

        set((state) => {
          state.isLoading = true
          state.error = null
        })

        try {
          const response = await authenticatedApiCall('/users/profile', tokens, {
            method: 'PATCH',
            body: JSON.stringify(updates),
          })

          set((state) => {
            state.isLoading = false
            state.user = { ...state.user!, ...response.user }
          })
        } catch (error) {
          set((state) => {
            state.isLoading = false
            state.error = error instanceof Error ? error.message : 'Profile update failed'
          })
          throw error
        }
      },

      updatePreferences: (preferences: Partial<User['preferences']>) => {
        set((state) => {
          if (state.user) {
            state.user.preferences = { ...state.user.preferences, ...preferences }
          }
        })

        // Persist preferences to backend
        const { tokens } = get()
        if (tokens) {
          authenticatedApiCall('/users/preferences', tokens, {
            method: 'PATCH',
            body: JSON.stringify(preferences),
          }).catch(() => {
            // Revert on error
            set((state) => {
              if (state.user) {
                // This would need the previous state to revert properly
                // For now, we'll just ignore the error
              }
            })
          })
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        const { tokens } = get()
        if (!tokens) throw new Error('Not authenticated')

        set((state) => {
          state.isLoading = true
          state.error = null
        })

        try {
          await authenticatedApiCall('/auth/change-password', tokens, {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword }),
          })

          set((state) => {
            state.isLoading = false
          })
        } catch (error) {
          set((state) => {
            state.isLoading = false
            state.error = error instanceof Error ? error.message : 'Password change failed'
          })
          throw error
        }
      },

      // Pack-related methods
      joinPack: async (packId: string) => {
        const { tokens } = get()
        if (!tokens) throw new Error('Not authenticated')

        set((state) => {
          state.isLoading = true
          state.error = null
        })

        try {
          const response = await authenticatedApiCall(`/packs/${packId}/join`, tokens, {
            method: 'POST',
          })

          set((state) => {
            state.isLoading = false
            if (state.user) {
              state.user.packId = packId
              state.user.packRole = response.packRole
            }
          })
        } catch (error) {
          set((state) => {
            state.isLoading = false
            state.error = error instanceof Error ? error.message : 'Failed to join pack'
          })
          throw error
        }
      },

      leavePack: async () => {
        const { tokens, user } = get()
        if (!tokens || !user?.packId) throw new Error('Not authenticated or not in a pack')

        set((state) => {
          state.isLoading = true
          state.error = null
        })

        try {
          await authenticatedApiCall(`/packs/${user.packId}/leave`, tokens, {
            method: 'POST',
          })

          set((state) => {
            state.isLoading = false
            if (state.user) {
              delete state.user.packId
              delete state.user.packRole
            }
          })
        } catch (error) {
          set((state) => {
            state.isLoading = false
            state.error = error instanceof Error ? error.message : 'Failed to leave pack'
          })
          throw error
        }
      },

      updatePackRole: (role: WerewolfRole) => {
        set((state) => {
          if (state.user) {
            state.user.packRole = role
          }
        })
      },

      // Utility methods
      clearError: () => {
        set((state) => {
          state.error = null
        })
      },

      setLoading: (loading: boolean) => {
        set((state) => {
          state.isLoading = loading
        })
      },

      initialize: async () => {
        const { tokens } = get()
        
        if (!tokens) {
          return
        }

        // Check if token is expired
        if (Date.now() >= tokens.expiresAt) {
          try {
            await get().refreshTokens()
          } catch {
            get().logout()
            return
          }
        }

        // Fetch current user data
        try {
          const response = await authenticatedApiCall('/users/me', get().tokens!)
          
          set((state) => {
            state.isAuthenticated = true
            state.user = response.user
          })

          // Update auth cookie
          document.cookie = `auth-token=${get().tokens!.accessToken}; path=/; secure; samesite=lax`
        } catch {
          get().logout()
        }
      },
    })),
    {
      name: 'werewolf-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Auto-refresh tokens before they expire
setInterval(() => {
  const { tokens, refreshTokens } = useAuthStore.getState()
  
  if (tokens && Date.now() >= tokens.expiresAt - 5 * 60 * 1000) { // 5 minutes before expiry
    refreshTokens().catch(() => {
      // Refresh failed, will be handled by the logout in refreshTokens
    })
  }
}, 60 * 1000) // Check every minute