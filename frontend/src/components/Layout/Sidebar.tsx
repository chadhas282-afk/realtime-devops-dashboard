import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../store/hooks';
import { UserPresence } from '../Common/UserPresence';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '⬛' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const onlineUserIds = useAppSelector((state) => state.users.onlineUserIds);
  const usersById = useAppSelector((state) => state.users.byId);

  return (
    <aside className="w-56 h-screen bg-gray-900 border-r border-gray-800 flex flex-col py-4 px-3 flex-shrink-0">
      <div className="mb-8 px-2">
        <h1 className="text-lg font-bold text-white tracking-tight">DevOps</h1>
        <p className="text-xs text-gray-500 mt-0.5">Dashboard</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {onlineUserIds.length > 0 && (
        <div className="border-t border-gray-800 pt-4">
          <p className="text-xs text-gray-500 px-2 mb-2 uppercase tracking-wider">
            Online ({onlineUserIds.length})
          </p>
          <div className="space-y-1">
            {onlineUserIds.slice(0, 5).map((userId) => {
              const user = usersById[userId];
              if (!user) return null;
              return (
                <div key={userId} className="flex items-center gap-2 px-2 py-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {user.name[0]?.toUpperCase()}
                  </div>
                  <span className="text-xs text-gray-300 truncate flex-1">{user.name}</span>
                  <UserPresence status={user.status} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
