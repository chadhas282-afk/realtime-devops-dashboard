import React from 'react';
import { UserStatus } from '../../types';

interface UserPresenceProps {
  status: UserStatus;
  size?: 'sm' | 'md';
}

const statusColors: Record<UserStatus, string> = {
  online: 'bg-green-400',
  away: 'bg-yellow-400',
  busy: 'bg-red-400',
  offline: 'bg-gray-500',
};

export const UserPresence: React.FC<UserPresenceProps> = ({ status, size = 'sm' }) => {
  const sizeClass = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3';
  return (
    <span
      className={`${sizeClass} rounded-full ${statusColors[status]} ring-1 ring-gray-900 flex-shrink-0`}
      title={status}
    />
  );
};

export default UserPresence;
