// context/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // Check if we're in production (HTTPS) or development (HTTP)
  const isProduction = window.location.protocol === 'https:';
  
  // Cookie options - secure only in production
  const cookieOptions = {
    expires: 7, // 7 days
    path: '/',
    sameSite: 'lax',
    secure: isProduction // Only secure in production
  };

  const sessionCookieOptions = {
    path: '/',
    sameSite: 'lax',
    secure: isProduction // Only secure in production
  };

  // Fetch user profile with caching
  const fetchUserProfile = useCallback(async (authToken) => {
    if (!authToken) return null;
    
    try {
      setIsProfileLoading(true);
      
      // Check cache first (sessionStorage)
      const cacheKey = `user_profile_${authToken.substring(0, 10)}`;
      const cachedProfile = sessionStorage.getItem(cacheKey);
      
      if (cachedProfile) {
        const parsedProfile = JSON.parse(cachedProfile);
        const cacheAge = Date.now() - (parsedProfile.timestamp || 0);
        
        // Use cache if less than 5 minutes old
        if (cacheAge < 5 * 60 * 1000) {
          setUser(parsedProfile.data);
          setIsProfileLoading(false);
          return parsedProfile.data;
        }
      }
      
      // Fetch fresh profile
      const profileResponse = await api.get('/profile', {
        headers: { Authorization: `${authToken}` },
        params: { cb: Date.now() }
      });
      
      const profileData = {
        id: profileResponse.data.user_id,
        username: profileResponse.data.username,
        email: profileResponse.data.email,
        full_name: profileResponse.data.full_name,
        company: profileResponse.data.company,
        sector: profileResponse.data.sector,
        country: profileResponse.data.country,
      };
      
      // Cache the profile
      const cacheData = {
        data: profileData,
        timestamp: Date.now()
      };
      sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
      
      setUser(profileData);
      setIsProfileLoading(false);
      return profileData;
      
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setIsProfileLoading(false);
      return null;
    }
  }, []);

  // Initialize auth - only validate token, lazy load profile later
  const initializeAuth = useCallback(async () => {
    try {
      // Get token from cookie
      const storedToken = Cookies.get('auth_token');
      
      if (storedToken) {
        setToken(storedToken);
        
        // Validate token first (quick check)
        const validateResponse = await api.post('/auth/validate', {}, {
          headers: { Authorization: `${storedToken}` }
        });
        
        if (validateResponse.data.valid) {
          // Token is valid, set minimal user data from validation
          setUser(prev => ({
            ...prev,
            username: validateResponse.data.username || null,
            // We'll fetch full profile lazily when needed
          }));
          
          // Lazy load profile in background (non-blocking)
          setTimeout(() => {
            fetchUserProfile(storedToken);
          }, 100);
        } else {
          // Invalid token - clear everything
          Cookies.remove('auth_token');
          setToken(null);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      // Invalid token - clear cookie
      Cookies.remove('auth_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Enhanced login function
  const login = async (newToken, userData, remember = false) => {
    // Clean token
    const cleanToken = newToken.replace('', '');
    
    setToken(cleanToken);
    
    // Set basic user data immediately
    setUser({
      username: userData?.username || null,
      // We'll fetch full profile in background
    });

    // Store token in cookie
    if (remember) {
      Cookies.set('auth_token', cleanToken, cookieOptions);
    } else {
      // Session cookie
      Cookies.set('auth_token', cleanToken, sessionCookieOptions);
    }
    
    // Fetch full profile in background
    setTimeout(() => {
      fetchUserProfile(cleanToken);
    }, 500);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    
    // Clear cache
    const cacheKeys = Object.keys(sessionStorage);
    cacheKeys.forEach(key => {
      if (key.startsWith('user_profile_')) {
        sessionStorage.removeItem(key);
      }
    });
    
    Cookies.remove('auth_token');
    window.location.href = '/login';
  };

  const getAuthHeader = () => {
    return token ? `${token}` : '';
  };

  // Function to force refresh user profile
  const refreshUserProfile = async () => {
    if (token) {
      return await fetchUserProfile(token);
    }
    return null;
  };

  // Function to ensure user email is available
  const ensureUserEmail = async () => {
    if (user?.email) {
      return user.email;
    }
    
    if (token) {
      const profile = await fetchUserProfile(token);
      return profile?.email || null;
    }
    
    return null;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      getAuthHeader,
      isLoading,
      isProfileLoading,
      refreshUserProfile,
      ensureUserEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};