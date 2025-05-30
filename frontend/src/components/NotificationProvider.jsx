import React, { createContext, useState, useEffect } from 'react';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [dismissedIds, setDismissedIds] = useState(() => {
    // Load dismissed IDs from localStorage on mount
    const saved = localStorage.getItem('dismissedNotifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5000/api/notifications/stream');

    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      // Only add notification if it hasn't been dismissed
      if (!dismissedIds.includes(newNotification.id)) {
        setNotifications((prev) => [newNotification, ...prev].slice(0, 5)); // Limit to 5
      }
    };

    eventSource.onerror = (err) => {
      console.error('EventSource failed:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [dismissedIds]);

  // Update localStorage when dismissedIds changes
  useEffect(() => {
    localStorage.setItem('dismissedNotifications', JSON.stringify(dismissedIds));
  }, [dismissedIds]);

  const handleCloseNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setDismissedIds((prev) => [...prev, id]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, handleCloseNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};