import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('college-commerce-user') || 'null'));
  const [notifications, setNotifications] = useState([]);
  const [liveNotification, setLiveNotification] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const liveNotificationTimer = useRef(null);

  useEffect(() => {
    localStorage.setItem('college-commerce-user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (!user?.token) {
      setNotifications([]);
      setLiveNotification(null);
      if (liveNotificationTimer.current) {
        clearTimeout(liveNotificationTimer.current);
        liveNotificationTimer.current = null;
      }
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    refreshNotifications();

    const socketClient = io(import.meta.env.VITE_SOCKET_URL || '/_/backend');
    socketClient.emit('join_user', user._id);
    setSocket(socketClient);

    socketClient.on('notification', (payload) => {
      refreshNotifications();
      const nextNotification = payload && typeof payload === 'object'
        ? payload
        : {
            title: 'New notification',
            message: 'You have a new update.',
            link: '/',
            type: 'system',
          };

      setLiveNotification(nextNotification);
      if (liveNotificationTimer.current) {
        clearTimeout(liveNotificationTimer.current);
      }
      liveNotificationTimer.current = setTimeout(() => {
        setLiveNotification(null);
        liveNotificationTimer.current = null;
      }, 5000);
    });

    return () => {
      socketClient.disconnect();
    };
  }, [user?.token]);

  async function refreshNotifications() {
    if (!user?.token) return;

    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function login(payload) {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', payload);
      setUser(data);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  }

  async function register(payload) {
    setLoading(true);
    try {
      const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
      const { data } = await api.post('/auth/register', payload, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);
      setUser(data);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(payload) {
    try {
      const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
      const { data } = await api.put('/auth/profile', payload, isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined);
      setUser(data);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Profile update failed' };
    }
  }

  async function markNotificationRead(id) {
    try {
      await api.put(`/notifications/${id}/read`);
      await refreshNotifications();
    } catch (error) {
      console.error(error);
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('college-commerce-user');
    setLiveNotification(null);
  }

  function dismissLiveNotification() {
    setLiveNotification(null);
    if (liveNotificationTimer.current) {
      clearTimeout(liveNotificationTimer.current);
      liveNotificationTimer.current = null;
    }
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      notifications,
      liveNotification,
      unreadCount: notifications.filter((item) => !item.read).length,
      socket,
      login,
      register,
      logout,
      updateProfile,
      refreshNotifications,
      markNotificationRead,
      dismissLiveNotification,
    }),
    [user, loading, notifications, liveNotification, socket]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
