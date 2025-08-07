'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useAuthStore } from './auth-store';

export type WerewolfRole = 'ALPHA' | 'BETA' | 'OMEGA' | 'HUNTER' | 'HEALER' | 'SCOUT' | 'GUARDIAN';
export type PackStatus = 'ACTIVE' | 'DORMANT' | 'DISBANDED' | 'RECRUITING';
export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface PackMember {
  id: string;
  userId: string;
  packId: string;
  role: WerewolfRole;
  joinedAt: string;
  isOnline: boolean;
  transformationCount: number;
  reputation: number;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    status: string;
  };
}

export interface Territory {
  id: string;
  name: string;
  size: number;
  terrain: string;
  status: 'CONTROLLED' | 'CONTESTED' | 'NEUTRAL' | 'ENEMY';
  packId?: string;
  strategicValue: number;
  defenseBonus: number;
  huntingBonus: number;
  population: number;
  resources: number;
  position: { x: number; y: number };
  shape: string;
}

export interface Pack {
  id: string;
  name: string;
  description?: string;
  status: PackStatus;
  alphaId: string;
  memberLimit: number;
  reputation: number;
  createdAt: string;
  updatedAt: string;
  alpha: PackMember;
  members: PackMember[];
  territories: Territory[];
  statistics: {
    totalTransformations: number;
    territoryCount: number;
    totalSize: number;
    averageReputation: number;
    onlineMembers: number;
  };
}

export interface PackInvitation {
  id: string;
  packId: string;
  inviterId: string;
  inviteeId: string;
  role: WerewolfRole;
  status: InvitationStatus;
  message?: string;
  expiresAt: string;
  createdAt: string;
  pack: Pick<Pack, 'id' | 'name' | 'reputation' | 'alpha'>;
  inviter: Pick<PackMember['user'], 'id' | 'username' | 'firstName' | 'lastName'>;
}

export interface PackActivity {
  id: string;
  packId: string;
  userId: string;
  type:
    | 'MEMBER_JOINED'
    | 'MEMBER_LEFT'
    | 'TERRITORY_CLAIMED'
    | 'TERRITORY_LOST'
    | 'ROLE_CHANGED'
    | 'TRANSFORMATION'
    | 'PACK_CREATED';
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  user: Pick<PackMember['user'], 'id' | 'username' | 'avatar'>;
}

export interface PackState {
  // Pack data
  packs: Pack[];
  currentPack: Pack | null;
  userPack: Pack | null;

  // UI state
  isLoading: boolean;
  error: string | null;
  selectedPackId: string | null;

  // Invitations
  pendingInvitations: PackInvitation[];
  sentInvitations: PackInvitation[];

  // Activity feed
  activities: PackActivity[];

  // Optimistic updates tracking
  optimisticUpdates: Map<string, () => void>;

  // Pack management methods
  createPack: (packData: CreatePackData) => Promise<Pack>;
  updatePack: (packId: string, updates: Partial<Pack>) => Promise<void>;
  deletePack: (packId: string) => Promise<void>;
  joinPack: (packId: string) => Promise<void>;
  leavePack: (packId: string) => Promise<void>;

  // Member management
  inviteMember: (
    packId: string,
    userId: string,
    role: WerewolfRole,
    message?: string
  ) => Promise<void>;
  removeMember: (packId: string, userId: string) => Promise<void>;
  updateMemberRole: (packId: string, userId: string, role: WerewolfRole) => Promise<void>;
  transferAlpha: (packId: string, newAlphaId: string) => Promise<void>;

  // Invitation management
  acceptInvitation: (invitationId: string) => Promise<void>;
  rejectInvitation: (invitationId: string) => Promise<void>;
  cancelInvitation: (invitationId: string) => Promise<void>;

  // Territory management
  claimTerritory: (territoryId: string) => Promise<void>;
  abandonTerritory: (territoryId: string) => Promise<void>;
  defendTerritory: (territoryId: string) => Promise<void>;
  attackTerritory: (territoryId: string) => Promise<void>;

  // Data fetching
  fetchPacks: (filters?: PackFilters) => Promise<void>;
  fetchPack: (packId: string) => Promise<void>;
  fetchUserPack: () => Promise<void>;
  fetchInvitations: () => Promise<void>;
  fetchActivities: (packId: string) => Promise<void>;

  // Real-time updates
  subscribeToPackUpdates: (packId: string) => () => void;
  handlePackUpdate: (update: PackUpdate) => void;

  // Utility methods
  clearError: () => void;
  setSelectedPack: (packId: string | null) => void;
  optimisticUpdate: <T>(key: string, data: T, revert?: () => void) => void;
  clearOptimisticUpdate: (key: string) => void;
}

export interface CreatePackData {
  name: string;
  description?: string;
  memberLimit?: number;
}

export interface PackFilters {
  status?: PackStatus;
  search?: string;
  minReputation?: number;
  maxMembers?: number;
  hasOpenSlots?: boolean;
  sortBy?: 'name' | 'reputation' | 'members' | 'created';
  sortOrder?: 'asc' | 'desc';
}

export interface PackUpdate {
  type: 'MEMBER_JOINED' | 'MEMBER_LEFT' | 'TERRITORY_CHANGED' | 'PACK_UPDATED' | 'ROLE_CHANGED';
  packId: string;
  data: unknown;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// API utility functions
const authenticatedApiCall = async (endpoint: string, options: RequestInit = {}) => {
  const { tokens } = useAuthStore.getState();
  if (!tokens) throw new Error('Not authenticated');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokens.accessToken}`,
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

export const usePackStore = create<PackState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      packs: [],
      currentPack: null,
      userPack: null,
      isLoading: false,
      error: null,
      selectedPackId: null,
      pendingInvitations: [],
      sentInvitations: [],
      activities: [],
      optimisticUpdates: new Map(),

      // Pack management methods
      createPack: async (packData: CreatePackData) => {
        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await authenticatedApiCall('/packs', {
            method: 'POST',
            body: JSON.stringify(packData),
          });

          const newPack = response.pack;

          set(state => {
            state.isLoading = false;
            state.packs.unshift(newPack);
            state.userPack = newPack;
            state.currentPack = newPack;
          });

          return newPack;
        } catch (error) {
          set(state => {
            state.isLoading = false;
            state.error = error instanceof Error ? error.message : 'Failed to create pack';
          });
          throw error;
        }
      },

      updatePack: async (packId: string, updates: Partial<Pack>) => {
        // Optimistic update
        const updateKey = `pack-update-${packId}`;
        const originalPack = get().packs.find(p => p.id === packId);

        get().optimisticUpdate(updateKey, updates, () => {
          if (originalPack) {
            set(state => {
              const index = state.packs.findIndex(p => p.id === packId);
              if (index !== -1) {
                state.packs[index] = originalPack;
              }
              if (state.currentPack?.id === packId) {
                state.currentPack = originalPack;
              }
              if (state.userPack?.id === packId) {
                state.userPack = originalPack;
              }
            });
          }
        });

        set(state => {
          const index = state.packs.findIndex(p => p.id === packId);
          if (index !== -1 && state.packs[index]) {
            Object.assign(state.packs[index], updates);
          }
          if (state.currentPack?.id === packId && state.currentPack) {
            Object.assign(state.currentPack, updates);
          }
          if (state.userPack?.id === packId && state.userPack) {
            Object.assign(state.userPack, updates);
          }
        });

        try {
          const response = await authenticatedApiCall(`/packs/${packId}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
          });

          set(state => {
            const index = state.packs.findIndex(p => p.id === packId);
            if (index !== -1) {
              state.packs[index] = response.pack;
            }
            if (state.currentPack?.id === packId) {
              state.currentPack = response.pack;
            }
            if (state.userPack?.id === packId) {
              state.userPack = response.pack;
            }
          });

          get().clearOptimisticUpdate(updateKey);
        } catch (error) {
          // Revert optimistic update
          const revert = get().optimisticUpdates.get(updateKey);
          if (revert) revert();
          get().clearOptimisticUpdate(updateKey);

          set(state => {
            state.error = error instanceof Error ? error.message : 'Failed to update pack';
          });
          throw error;
        }
      },

      deletePack: async (packId: string) => {
        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          await authenticatedApiCall(`/packs/${packId}`, {
            method: 'DELETE',
          });

          set(state => {
            state.isLoading = false;
            state.packs = state.packs.filter(p => p.id !== packId);
            if (state.currentPack?.id === packId) {
              state.currentPack = null;
            }
            if (state.userPack?.id === packId) {
              state.userPack = null;
            }
          });
        } catch (error) {
          set(state => {
            state.isLoading = false;
            state.error = error instanceof Error ? error.message : 'Failed to delete pack';
          });
          throw error;
        }
      },

      joinPack: async (packId: string) => {
        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await authenticatedApiCall(`/packs/${packId}/join`, {
            method: 'POST',
          });

          set(state => {
            state.isLoading = false;
            state.userPack = response.pack;

            // Update pack member count optimistically
            const packIndex = state.packs.findIndex(p => p.id === packId);
            if (packIndex !== -1 && state.packs[packIndex]) {
              state.packs[packIndex].members.push(response.member);
              if (state.packs[packIndex].statistics) {
                state.packs[packIndex].statistics.onlineMembers++;
              }
            }
          });

          // Update auth store pack info
          useAuthStore.getState().updatePackRole(response.member.role);
        } catch (error) {
          set(state => {
            state.isLoading = false;
            state.error = error instanceof Error ? error.message : 'Failed to join pack';
          });
          throw error;
        }
      },

      leavePack: async (packId: string) => {
        const { user } = useAuthStore.getState();
        if (!user) throw new Error('Not authenticated');

        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          await authenticatedApiCall(`/packs/${packId}/leave`, {
            method: 'POST',
          });

          set(state => {
            state.isLoading = false;
            state.userPack = null;

            // Update pack member count optimistically
            const packIndex = state.packs.findIndex(p => p.id === packId);
            if (packIndex !== -1 && state.packs[packIndex]) {
              state.packs[packIndex].members = state.packs[packIndex].members.filter(
                m => m.userId !== user.id
              );
              if (state.packs[packIndex].statistics) {
                state.packs[packIndex].statistics.onlineMembers--;
              }
            }
          });

          // Update auth store
          useAuthStore.getState().updatePackRole(undefined);
        } catch (error) {
          set(state => {
            state.isLoading = false;
            state.error = error instanceof Error ? error.message : 'Failed to leave pack';
          });
          throw error;
        }
      },

      // Member management
      inviteMember: async (
        packId: string,
        userId: string,
        role: WerewolfRole,
        message?: string
      ) => {
        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await authenticatedApiCall(`/packs/${packId}/invite`, {
            method: 'POST',
            body: JSON.stringify({ userId, role, message }),
          });

          set(state => {
            state.isLoading = false;
            state.sentInvitations.push(response.invitation);
          });
        } catch (error) {
          set(state => {
            state.isLoading = false;
            state.error = error instanceof Error ? error.message : 'Failed to send invitation';
          });
          throw error;
        }
      },

      removeMember: async (packId: string, userId: string) => {
        // Optimistic update
        const updateKey = `remove-member-${packId}-${userId}`;
        let originalMember: PackMember | null = null;

        set(state => {
          const packIndex = state.packs.findIndex(p => p.id === packId);
          if (packIndex !== -1 && state.packs[packIndex]) {
            const memberIndex = state.packs[packIndex].members.findIndex(m => m.userId === userId);
            if (memberIndex !== -1 && state.packs[packIndex].members[memberIndex]) {
              originalMember = state.packs[packIndex].members[memberIndex];
              state.packs[packIndex].members.splice(memberIndex, 1);
              if (state.packs[packIndex].statistics) {
                state.packs[packIndex].statistics.onlineMembers--;
              }
            }
          }
        });

        get().optimisticUpdate(updateKey, null, () => {
          if (originalMember) {
            set(state => {
              const packIndex = state.packs.findIndex(p => p.id === packId);
              if (packIndex !== -1 && state.packs[packIndex]) {
                state.packs[packIndex].members.push(originalMember!);
                if (state.packs[packIndex].statistics) {
                  state.packs[packIndex].statistics.onlineMembers++;
                }
              }
            });
          }
        });

        try {
          await authenticatedApiCall(`/packs/${packId}/members/${userId}`, {
            method: 'DELETE',
          });

          get().clearOptimisticUpdate(updateKey);
        } catch (error) {
          // Revert optimistic update
          const revert = get().optimisticUpdates.get(updateKey);
          if (revert) revert();
          get().clearOptimisticUpdate(updateKey);

          set(state => {
            state.error = error instanceof Error ? error.message : 'Failed to remove member';
          });
          throw error;
        }
      },

      updateMemberRole: async (packId: string, userId: string, role: WerewolfRole) => {
        // Optimistic update
        const updateKey = `role-update-${packId}-${userId}`;
        let originalRole: WerewolfRole | null = null;

        set(state => {
          const packIndex = state.packs.findIndex(p => p.id === packId);
          if (packIndex !== -1 && state.packs[packIndex]) {
            const memberIndex = state.packs[packIndex].members.findIndex(m => m.userId === userId);
            if (memberIndex !== -1 && state.packs[packIndex].members[memberIndex]) {
              originalRole = state.packs[packIndex].members[memberIndex].role;
              state.packs[packIndex].members[memberIndex].role = role;
            }
          }
        });

        get().optimisticUpdate(updateKey, role, () => {
          if (originalRole) {
            set(state => {
              const packIndex = state.packs.findIndex(p => p.id === packId);
              if (packIndex !== -1 && state.packs[packIndex]) {
                const memberIndex = state.packs[packIndex].members.findIndex(
                  m => m.userId === userId
                );
                if (memberIndex !== -1 && state.packs[packIndex].members[memberIndex]) {
                  state.packs[packIndex].members[memberIndex].role = originalRole!;
                }
              }
            });
          }
        });

        try {
          await authenticatedApiCall(`/packs/${packId}/members/${userId}/role`, {
            method: 'PATCH',
            body: JSON.stringify({ role }),
          });

          get().clearOptimisticUpdate(updateKey);
        } catch (error) {
          // Revert optimistic update
          const revert = get().optimisticUpdates.get(updateKey);
          if (revert) revert();
          get().clearOptimisticUpdate(updateKey);

          set(state => {
            state.error = error instanceof Error ? error.message : 'Failed to update member role';
          });
          throw error;
        }
      },

      transferAlpha: async (packId: string, newAlphaId: string) => {
        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await authenticatedApiCall(`/packs/${packId}/transfer-alpha`, {
            method: 'POST',
            body: JSON.stringify({ newAlphaId }),
          });

          set(state => {
            state.isLoading = false;
            const packIndex = state.packs.findIndex(p => p.id === packId);
            if (packIndex !== -1) {
              state.packs[packIndex] = response.pack;
            }
            if (state.currentPack?.id === packId) {
              state.currentPack = response.pack;
            }
            if (state.userPack?.id === packId) {
              state.userPack = response.pack;
            }
          });
        } catch (error) {
          set(state => {
            state.isLoading = false;
            state.error = error instanceof Error ? error.message : 'Failed to transfer alpha role';
          });
          throw error;
        }
      },

      // Invitation management
      acceptInvitation: async (invitationId: string) => {
        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await authenticatedApiCall(`/packs/invitations/${invitationId}/accept`, {
            method: 'POST',
          });

          set(state => {
            state.isLoading = false;
            state.userPack = response.pack;
            state.pendingInvitations = state.pendingInvitations.filter(
              inv => inv.id !== invitationId
            );
          });

          // Update auth store pack info
          useAuthStore.getState().updatePackRole(response.member.role);
        } catch (error) {
          set(state => {
            state.isLoading = false;
            state.error = error instanceof Error ? error.message : 'Failed to accept invitation';
          });
          throw error;
        }
      },

      rejectInvitation: async (invitationId: string) => {
        try {
          await authenticatedApiCall(`/packs/invitations/${invitationId}/reject`, {
            method: 'POST',
          });

          set(state => {
            state.pendingInvitations = state.pendingInvitations.filter(
              inv => inv.id !== invitationId
            );
          });
        } catch (error) {
          set(state => {
            state.error = error instanceof Error ? error.message : 'Failed to reject invitation';
          });
          throw error;
        }
      },

      cancelInvitation: async (invitationId: string) => {
        try {
          await authenticatedApiCall(`/packs/invitations/${invitationId}`, {
            method: 'DELETE',
          });

          set(state => {
            state.sentInvitations = state.sentInvitations.filter(inv => inv.id !== invitationId);
          });
        } catch (error) {
          set(state => {
            state.error = error instanceof Error ? error.message : 'Failed to cancel invitation';
          });
          throw error;
        }
      },

      // Territory management (simplified for this implementation)
      claimTerritory: async (territoryId: string) => {
        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await authenticatedApiCall(`/territories/${territoryId}/claim`, {
            method: 'POST',
          });

          set(state => {
            state.isLoading = false;
            if (state.userPack) {
              state.userPack.territories.push(response.territory);
              state.userPack.statistics.territoryCount++;
              state.userPack.statistics.totalSize += response.territory.size;
            }
          });
        } catch (error) {
          set(state => {
            state.isLoading = false;
            state.error = error instanceof Error ? error.message : 'Failed to claim territory';
          });
          throw error;
        }
      },

      abandonTerritory: async (territoryId: string) => {
        try {
          await authenticatedApiCall(`/territories/${territoryId}/abandon`, {
            method: 'POST',
          });

          set(state => {
            if (state.userPack) {
              const territory = state.userPack.territories.find(t => t.id === territoryId);
              if (territory) {
                state.userPack.territories = state.userPack.territories.filter(
                  t => t.id !== territoryId
                );
                state.userPack.statistics.territoryCount--;
                state.userPack.statistics.totalSize -= territory.size;
              }
            }
          });
        } catch (error) {
          set(state => {
            state.error = error instanceof Error ? error.message : 'Failed to abandon territory';
          });
          throw error;
        }
      },

      defendTerritory: async (_territoryId: string) => {
        // This would be implemented based on game mechanics
        throw new Error('Not implemented');
      },

      attackTerritory: async (_territoryId: string) => {
        // This would be implemented based on game mechanics
        throw new Error('Not implemented');
      },

      // Data fetching
      fetchPacks: async (filters?: PackFilters) => {
        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const queryParams = new URLSearchParams();
          if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
              if (value !== undefined) {
                queryParams.append(key, String(value));
              }
            });
          }

          const response = await authenticatedApiCall(`/packs?${queryParams}`);

          set(state => {
            state.isLoading = false;
            state.packs = response.packs;
          });
        } catch (error) {
          set(state => {
            state.isLoading = false;
            state.error = error instanceof Error ? error.message : 'Failed to fetch packs';
          });
          throw error;
        }
      },

      fetchPack: async (packId: string) => {
        set(state => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await authenticatedApiCall(`/packs/${packId}`);

          set(state => {
            state.isLoading = false;
            state.currentPack = response.pack;

            // Update pack in packs array if it exists
            const index = state.packs.findIndex(p => p.id === packId);
            if (index !== -1) {
              state.packs[index] = response.pack;
            } else {
              state.packs.push(response.pack);
            }
          });
        } catch (error) {
          set(state => {
            state.isLoading = false;
            state.error = error instanceof Error ? error.message : 'Failed to fetch pack';
          });
          throw error;
        }
      },

      fetchUserPack: async () => {
        try {
          const response = await authenticatedApiCall('/packs/me');

          set(state => {
            state.userPack = response.pack;
          });
        } catch (error) {
          // User might not be in a pack, which is okay
          set(state => {
            state.userPack = null;
          });
        }
      },

      fetchInvitations: async () => {
        try {
          const response = await authenticatedApiCall('/packs/invitations');

          set(state => {
            state.pendingInvitations = response.received;
            state.sentInvitations = response.sent;
          });
        } catch (error) {
          set(state => {
            state.error = error instanceof Error ? error.message : 'Failed to fetch invitations';
          });
        }
      },

      fetchActivities: async (packId: string) => {
        try {
          const response = await authenticatedApiCall(`/packs/${packId}/activities`);

          set(state => {
            state.activities = response.activities;
          });
        } catch (error) {
          set(state => {
            state.error = error instanceof Error ? error.message : 'Failed to fetch activities';
          });
        }
      },

      // Real-time updates (WebSocket integration would be implemented here)
      subscribeToPackUpdates: (_packId: string) => {
        // This would set up WebSocket subscription for real-time pack updates
        // Return unsubscribe function
        return () => {};
      },

      handlePackUpdate: (update: PackUpdate) => {
        // Handle real-time pack updates from WebSocket
        set(_state => {
          switch (update.type) {
            case 'MEMBER_JOINED':
              // Handle member joining
              break;
            case 'MEMBER_LEFT':
              // Handle member leaving
              break;
            case 'TERRITORY_CHANGED':
              // Handle territory changes
              break;
            case 'PACK_UPDATED':
              // Handle pack updates
              break;
            case 'ROLE_CHANGED':
              // Handle role changes
              break;
          }
        });
      },

      // Utility methods
      clearError: () => {
        set(state => {
          state.error = null;
        });
      },

      setSelectedPack: (packId: string | null) => {
        set(state => {
          state.selectedPackId = packId;
        });
      },

      optimisticUpdate: <T>(key: string, data: T, revert?: () => void) => {
        set(state => {
          if (revert) {
            state.optimisticUpdates.set(key, revert);
          }
        });
      },

      clearOptimisticUpdate: (key: string) => {
        set(state => {
          state.optimisticUpdates.delete(key);
        });
      },
    })),
    {
      name: 'werewolf-pack',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        userPack: state.userPack,
        selectedPackId: state.selectedPackId,
      }),
    }
  )
);
