'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { usePackStore } from '@/stores/pack-store';

export type WebSocketEventType =
  | 'MOON_PHASE_CHANGE'
  | 'TRANSFORMATION_START'
  | 'TRANSFORMATION_END'
  | 'PACK_UPDATE'
  | 'MEMBER_JOINED'
  | 'MEMBER_LEFT'
  | 'TERRITORY_CLAIMED'
  | 'TERRITORY_LOST'
  | 'INVITATION_RECEIVED'
  | 'USER_STATUS_CHANGE';

export interface WebSocketMessage {
  type: WebSocketEventType;
  payload: any;
  timestamp: string;
  userId?: string;
  packId?: string;
}

export interface MoonPhaseUpdate {
  phase: string;
  luminosity: number;
  nextFullMoon: string;
  timeUntilTransformation: number;
  isTransformationTime: boolean;
}

export interface TransformationEvent {
  userId: string;
  username: string;
  packId?: string;
  phase: 'START' | 'END';
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface PackUpdateEvent {
  packId: string;
  type: 'MEMBER_COUNT' | 'TERRITORY' | 'REPUTATION' | 'STATUS';
  data: any;
}

export interface UseWebSocketOptions {
  url?: string;
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
}

export interface UseWebSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastMessage: WebSocketMessage | null;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (type: string, payload: any) => void;
  subscribeToMoonPhase: () => () => void;
  subscribeToPackUpdates: (packId: string) => () => void;
  subscribeToUserUpdates: () => () => void;
}

const DEFAULT_OPTIONS: Required<UseWebSocketOptions> = {
  url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
  autoConnect: true,
  reconnectInterval: 3000,
  maxReconnectAttempts: 5,
  onConnect: () => {},
  onDisconnect: () => {},
  onError: () => {},
  onMessage: () => {},
};

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const subscriptions = useRef<Set<string>>(new Set());

  const { tokens, user } = useAuthStore();
  const { handlePackUpdate } = usePackStore();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || isConnecting) {
      return;
    }

    if (!tokens) {
      setError('Authentication required for WebSocket connection');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const wsUrl = `${opts.url}?token=${tokens.accessToken}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttempts.current = 0;
        opts.onConnect();

        // Re-subscribe to previous subscriptions
        subscriptions.current.forEach(subscription => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(
              JSON.stringify({
                type: 'SUBSCRIBE',
                payload: { subscription },
              })
            );
          }
        });
      };

      wsRef.current.onclose = event => {
        setIsConnected(false);
        setIsConnecting(false);
        opts.onDisconnect();

        // Attempt to reconnect if connection was not closed intentionally
        if (event.code !== 1000 && reconnectAttempts.current < opts.maxReconnectAttempts) {
          reconnectAttempts.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, opts.reconnectInterval);
        } else if (reconnectAttempts.current >= opts.maxReconnectAttempts) {
          setError('Max reconnection attempts reached');
        }
      };

      wsRef.current.onerror = event => {
        setError('WebSocket connection error');
        setIsConnecting(false);
        opts.onError(event);
      };

      wsRef.current.onmessage = event => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          // eslint-disable-next-line react-hooks/exhaustive-deps
          handleMessage(message);
          opts.onMessage(message);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Failed to parse WebSocket message:', err);
        }
      };
    } catch (err) {
      setIsConnecting(false);
      setError('Failed to create WebSocket connection');
    }
  }, [tokens, opts, isConnecting, handleMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Intentional disconnect');
      wsRef.current = null;
    }

    setIsConnected(false);
    setIsConnecting(false);
    reconnectAttempts.current = 0;
    subscriptions.current.clear();
  }, []);

  const sendMessage = useCallback((type: string, payload: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type,
          payload,
          timestamp: new Date().toISOString(),
        })
      );
    } else {
      // eslint-disable-next-line no-console
      console.warn('WebSocket is not connected. Message not sent:', { type, payload });
    }
  }, []);

  const handleMessage = useCallback(
    (message: WebSocketMessage) => {
      switch (message.type) {
        case 'MOON_PHASE_CHANGE':
          // Handle moon phase updates - could trigger UI updates, notifications, etc.
          const moonPhaseData = message.payload as MoonPhaseUpdate;

          // You could dispatch this to a moon phase store or handle it directly
          // eslint-disable-next-line no-console
          console.log('Moon phase updated:', moonPhaseData);

          // If transformation time, show urgent notifications
          if (moonPhaseData.isTransformationTime) {
            // Trigger transformation warnings in UI
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('🌕 Transformation Time!', {
                body: 'The full moon rises. Seek safety immediately!',
                icon: '/icons/moon.png',
                badge: '/icons/werewolf.png',
              });
            }
          }
          break;

        case 'TRANSFORMATION_START':
        case 'TRANSFORMATION_END':
          const transformationData = message.payload as TransformationEvent;

          // Handle transformation events - update user status, show notifications
          if (transformationData.userId === user?.id) {
            // User is transforming
            // eslint-disable-next-line no-console
            console.log(`User transformation ${transformationData.phase.toLowerCase()}`);
          } else {
            // Another user is transforming
            // eslint-disable-next-line no-console
            console.log(
              `${transformationData.username} transformation ${transformationData.phase.toLowerCase()}`
            );
          }
          break;

        case 'PACK_UPDATE':
          const packUpdateData = message.payload as PackUpdateEvent;

          // Delegate to pack store for handling
          handlePackUpdate({
            type: 'PACK_UPDATED',
            packId: packUpdateData.packId,
            data: packUpdateData.data,
          });
          break;

        case 'MEMBER_JOINED':
        case 'MEMBER_LEFT':
          // Handle pack membership changes
          if (message.packId) {
            handlePackUpdate({
              type: message.type,
              packId: message.packId,
              data: message.payload,
            });
          }
          break;

        case 'TERRITORY_CLAIMED':
        case 'TERRITORY_LOST':
          // Handle territory changes
          if (message.packId) {
            handlePackUpdate({
              type: 'TERRITORY_CHANGED',
              packId: message.packId,
              data: message.payload,
            });
          }
          break;

        case 'INVITATION_RECEIVED':
          // Handle pack invitations
          // eslint-disable-next-line no-console
          console.log('New pack invitation received:', message.payload);

          // Show notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('🐺 Pack Invitation', {
              body: `You've been invited to join ${message.payload.packName}`,
              icon: '/icons/pack.png',
            });
          }
          break;

        case 'USER_STATUS_CHANGE':
          // Handle user status changes (online/offline, role changes, etc.)
          // eslint-disable-next-line no-console
          console.log('User status changed:', message.payload);
          break;

        default:
          // eslint-disable-next-line no-console
          console.log('Unhandled WebSocket message:', message);
      }
    },
    [user?.id, handlePackUpdate]
  );

  const subscribeToMoonPhase = useCallback(() => {
    const subscription = 'moon-phase';
    subscriptions.current.add(subscription);

    sendMessage('SUBSCRIBE', { subscription });

    return () => {
      subscriptions.current.delete(subscription);
      sendMessage('UNSUBSCRIBE', { subscription });
    };
  }, [sendMessage]);

  const subscribeToPackUpdates = useCallback(
    (packId: string) => {
      const subscription = `pack-${packId}`;
      subscriptions.current.add(subscription);

      sendMessage('SUBSCRIBE', { subscription });

      return () => {
        subscriptions.current.delete(subscription);
        sendMessage('UNSUBSCRIBE', { subscription });
      };
    },
    [sendMessage]
  );

  const subscribeToUserUpdates = useCallback(() => {
    if (!user?.id) return () => {};

    const subscription = `user-${user.id}`;
    subscriptions.current.add(subscription);

    sendMessage('SUBSCRIBE', { subscription });

    return () => {
      subscriptions.current.delete(subscription);
      sendMessage('UNSUBSCRIBE', { subscription });
    };
  }, [sendMessage, user?.id]);

  // Auto-connect on mount if enabled and authenticated
  useEffect(() => {
    if (opts.autoConnect && tokens && !isConnected && !isConnecting) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [opts.autoConnect, tokens, connect, disconnect, isConnected, isConnecting]);

  // Handle authentication state changes
  useEffect(() => {
    if (!tokens && isConnected) {
      disconnect();
    } else if (tokens && !isConnected && !isConnecting && opts.autoConnect) {
      connect();
    }
  }, [tokens, isConnected, isConnecting, connect, disconnect, opts.autoConnect]);

  // Request notification permission on first load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {
    isConnected,
    isConnecting,
    error,
    lastMessage,
    connect,
    disconnect,
    sendMessage,
    subscribeToMoonPhase,
    subscribeToPackUpdates,
    subscribeToUserUpdates,
  };
}
