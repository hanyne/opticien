import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Notification = ({ notifications, onClose }) => {
  return (
    <AnimatePresence>
      {notifications.map((notification) => (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 right-4 z-50 bg-indigo-500 text-white p-4 rounded-lg shadow-lg max-w-sm"
        >
          <div className="flex justify-between items-center">
            <span>{notification.message}</span>
            <button
              onClick={() => onClose(notification.id)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
          <small className="block mt-2 text-gray-200">
            {new Date(notification.timestamp).toLocaleTimeString()}
          </small>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default Notification;