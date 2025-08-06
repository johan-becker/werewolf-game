'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useWebSocket, UseWebSocketReturn } from '@/hooks/use-websocket';
import { useAuthStore } from '@/stores/auth-store';
import { usePackStore } from '@/stores/pack-store';

interface WebSocketContextValue extends UseWebSocketReturn {
  // Context-specific methods can be added here when needed
  isProviderReady: boolean;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
  url?: string;
  autoConnect?: boolean;
}

export function WebSocketProvider({ children, url, autoConnect = true }: WebSocketProviderProps) {
  const { isAuthenticated, user } = useAuthStore();
  const { userPack } = usePackStore();

  const websocket = useWebSocket({
    url: url || '',
    autoConnect: autoConnect && isAuthenticated && !!url,
    onConnect: () => {
      // eslint-disable-next-line no-console
      console.log('🔌 WebSocket connected');
    },
    onDisconnect: () => {
      // eslint-disable-next-line no-console
      console.log('🔌 WebSocket disconnected');
    },
    onError: error => {
      // eslint-disable-next-line no-console
      console.error('🔌 WebSocket error:', error);
    },
  });

  // Subscribe to moon phase updates for all authenticated users
  useEffect(() => {
    if (websocket.isConnected && isAuthenticated) {
      const unsubscribe = websocket.subscribeToMoonPhase();
      return unsubscribe;
    }
    return undefined;
  }, [websocket.isConnected, isAuthenticated, websocket]);

  // Subscribe to user-specific updates
  useEffect(() => {
    if (websocket.isConnected && user) {
      const unsubscribe = websocket.subscribeToUserUpdates();
      return unsubscribe;
    }
    return undefined;
  }, [websocket.isConnected, user, websocket]);

  // Subscribe to pack updates if user is in a pack
  useEffect(() => {
    if (websocket.isConnected && userPack) {
      const unsubscribe = websocket.subscribeToPackUpdates(userPack.id);
      return unsubscribe;
    }
    return undefined;
  }, [websocket.isConnected, userPack, websocket]);

  const contextValue: WebSocketContextValue = {
    ...websocket,
    isProviderReady: isAuthenticated && !!url,
  };

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>;
}

export function useWebSocketContext(): WebSocketContextValue {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }

  return context;
}

// Convenience hook for moon phase updates
export function useMoonPhaseUpdates() {
  const websocket = useWebSocketContext();

  useEffect(() => {
    if (websocket.isConnected) {
      const unsubscribe = websocket.subscribeToMoonPhase();
      return unsubscribe;
    }
    return undefined;
  }, [websocket.isConnected, websocket]);

  return {
    isConnected: websocket.isConnected,
    lastMoonPhaseUpdate:
      websocket.lastMessage?.type === 'MOON_PHASE_CHANGE' ? websocket.lastMessage.payload : null,
  };
}

// Convenience hook for pack-specific real-time updates
export function usePackRealTimeUpdates(packId?: string) {
  const websocket = useWebSocketContext();

  useEffect(() => {
    if (websocket.isConnected && packId) {
      const unsubscribe = websocket.subscribeToPackUpdates(packId);
      return unsubscribe;
    }
    return undefined;
  }, [websocket.isConnected, packId, websocket]);

  return {
    isConnected: websocket.isConnected,
    lastPackUpdate: websocket.lastMessage?.packId === packId ? websocket.lastMessage : null,
  };
}

// Convenience hook for transformation alerts
export function useTransformationAlerts() {
  const websocket = useWebSocketContext();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!websocket.lastMessage) return;

    const { type, payload } = websocket.lastMessage;

    if (type === 'TRANSFORMATION_START' && payload.userId === user?.id) {
      // User is starting transformation
      // eslint-disable-next-line no-console
      console.log('🐺 Your transformation is beginning...');

      // You could trigger UI changes, sounds, vibrations, etc.
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200]);
      }
    } else if (type === 'TRANSFORMATION_END' && payload.userId === user?.id) {
      // User transformation ended
      // eslint-disable-next-line no-console
      console.log('🌅 Your transformation has ended.');
    }
  }, [websocket.lastMessage, user?.id]);

  return {
    isConnected: websocket.isConnected,
    isTransforming:
      websocket.lastMessage?.type === 'TRANSFORMATION_START' &&
      websocket.lastMessage.payload.userId === user?.id,
  };
}
