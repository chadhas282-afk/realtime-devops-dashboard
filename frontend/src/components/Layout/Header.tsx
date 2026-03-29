import React from 'react';
import { ConnectionStatus } from '../Common/ConnectionStatus';
import { UserPresence } from '../Common/UserPresence';

interface HeaderProps {
  user: { id: string; email: string; name: string } | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-semibold text-gray-200">Real-Time DevOps Dashboard</h2>
        <ConnectionStatus />
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                {user.name[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-gray-300">{user.name}</span>
              <UserPresence status="online" />
            </div>
            <button
              onClick={onLogout}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded hover:bg-gray-800"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
