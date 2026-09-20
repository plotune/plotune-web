// hooks/useStreamWebSocket.js - FIXED VERSION
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';

const useStreamWebSocket = (stream, isShared, user, streamToken, mode = 'consumer') => {
  const [messageMap, setMessageMap] = useState({}); // key -> array of messages
  const [uniqueKeys, setUniqueKeys] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [loading, setLoading] = useState(false);
  const wsRef = useRef(null);
  const isConnectingRef = useRef(false);
  const errorOccurredRef = useRef(false);

  // Build WebSocket URL
  const buildWebSocketUrl = useCallback(() => {
    if (!stream || !user || !streamToken) return null;

    const ownerUsername = isShared 
      ? stream.owner_email?.split('@')[0] 
      : user.username;
    
    const groupName = user.username + '-' + Math.random().toString(36).substring(2, 8);
    
    if (mode === 'consumer') {
      return `wss://stream.plotune.net/ws/consumer/${ownerUsername}/${stream.name}/${groupName}?token=${encodeURIComponent(streamToken)}`;
    }
    
    return null;
  }, [stream, isShared, user, streamToken, mode]);

  // Connect to WebSocket
  const connect = useCallback(async () => {
    if (isConnectingRef.current) {
      console.log('Already connecting, skipping...');
      return;
    }

    if (!streamToken || !user?.username) {
      toast.error('Authentication required');
      return;
    }

    const url = buildWebSocketUrl();
    if (!url) {
      toast.error('Invalid stream configuration');
      return;
    }

    // Clean up any existing connection first
    if (wsRef.current) {
      try { wsRef.current.close(); } catch {}
      wsRef.current = null;
    }

    isConnectingRef.current = true;
    setConnectionStatus('connecting');
    setLoading(true);

    try {
      console.log('Connecting to WebSocket:', url);
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log('✅ WebSocket connected');
        errorOccurredRef.current = false;
        setConnectionStatus('connected');
        setLoading(false);
        isConnectingRef.current = false;
        toast.success(`Connected to ${stream.name}`);
      };

      // FIXED: Log all messages and handle any data type
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 RAW MESSAGE RECEIVED:', data); // Log everything

          // Only require 'key' field, value can be anything
          if (mode === 'consumer' && data && data.key) {
            const newMessage = {
              id: `${Date.now()}-${Math.random()}`,
              key: data.key,
              timestamp: data.timestamp || Date.now() / 1000,
              value: data.value, // Allow any type
              receivedAt: new Date().toISOString()
            };

            console.log('💾 PROCESSING MESSAGE:', newMessage); // Log processed message

            setMessageMap(prev => {
              const key = data.key;
              const existingMessages = prev[key] || [];
              
              // Add new message and keep only last 2000
              const updatedMessages = [newMessage, ...existingMessages].slice(0, 2000);
              
              return {
                ...prev,
                [key]: updatedMessages
              };
            });

            // Update unique keys
            setUniqueKeys(prev => {
              if (!prev.includes(data.key)) {
                return [...prev, data.key];
              }
              return prev;
            });
          } else {
            console.log('❌ Message rejected - no key field:', data);
          }
        } catch (err) {
          console.error('❌ Error parsing WebSocket message:', err, event.data);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        errorOccurredRef.current = true;
        setConnectionStatus('error');
        setLoading(false);
        isConnectingRef.current = false;
        toast.error('Connection failed. Check your network and try again.');
      };

      wsRef.current.onclose = (event) => {
        console.log('🔌 WebSocket closed:', event.code, event.reason);
        // Surface failure truthfully: if an error preceded the close, stay in
        // the 'error' state instead of reporting a clean disconnect.
        setConnectionStatus(errorOccurredRef.current ? 'error' : 'disconnected');
        setLoading(false);
        isConnectingRef.current = false;
        wsRef.current = null;
      };

    } catch (err) {
      console.error('❌ Connection failed:', err);
      toast.error('Failed to connect');
      setConnectionStatus('error');
      setLoading(false);
      isConnectingRef.current = false;
    }
  }, [streamToken, user, buildWebSocketUrl, stream, mode]);

  const disconnect = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
      toast.info('Disconnected from stream');
    }
    setConnectionStatus('disconnected');
    wsRef.current = null;
  }, []);

  const clearMessages = useCallback(() => {
    setMessageMap({});
    setUniqueKeys([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return {
    connectionStatus,
    messageMap,
    uniqueKeys,
    loading,
    connect,
    disconnect,
    clearMessages
  };
};

export default useStreamWebSocket;