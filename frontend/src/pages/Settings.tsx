import React from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleTheme } from '../store/slices/uiSlice';

export const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-bold text-white mb-6">Settings</h1>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-200">Theme</h3>
              <p className="text-xs text-gray-500 mt-0.5">Toggle light/dark mode</p>
            </div>
            <button
              onClick={() => dispatch(toggleTheme())}
              className="btn-secondary text-sm"
            >
              {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <h3 className="text-sm font-medium text-gray-200 mb-3">Backend Connection</h3>
          <div className="space-y-2 text-xs text-gray-400">
            <p>API URL: <span className="text-gray-300">{import.meta.env.VITE_API_URL || 'http://localhost:5000'}</span></p>
            <p>WebSocket URL: <span className="text-gray-300">{import.meta.env.VITE_WS_URL || 'http://localhost:5000'}</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;
