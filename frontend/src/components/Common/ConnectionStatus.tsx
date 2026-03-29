import React from 'react';
import { useAppSelector } from '../../store/hooks';

export const ConnectionStatus: React.FC = () => {
  const isConnected = useAppSelector((state) => state.ui.isConnected);

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${
          isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
        }`}
      />
      <span className="text-xs text-gray-400">
        {isConnected ? 'Live' : 'Disconnected'}
      </span>
    </div>
  );
};

export default ConnectionStatus;
