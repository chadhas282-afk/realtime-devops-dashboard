import React from 'react';
import { Activity, ActivityType } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItemProps {
  activity: Activity;
}

const activityIcons: Record<ActivityType, string> = {
  task_created: '✨',
  task_updated: '✏️',
  task_moved: '➡️',
  task_deleted: '🗑️',
  task_completed: '✅',
  task_deployed: '🚀',
  user_joined: '👋',
  user_left: '👋',
  deployment_started: '⚡',
  deployment_completed: '✅',
  deployment_failed: '❌',
};

const activityColors: Record<ActivityType, string> = {
  task_created: 'text-blue-400',
  task_updated: 'text-gray-400',
  task_moved: 'text-yellow-400',
  task_deleted: 'text-red-400',
  task_completed: 'text-green-400',
  task_deployed: 'text-purple-400',
  user_joined: 'text-teal-400',
  user_left: 'text-gray-500',
  deployment_started: 'text-blue-400',
  deployment_completed: 'text-green-400',
  deployment_failed: 'text-red-400',
};

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const icon = activityIcons[activity.type] || '📌';
  const colorClass = activityColors[activity.type] || 'text-gray-400';

  const timeAgo = formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true });

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-800 last:border-0">
      <span className="text-sm mt-0.5 flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-xs ${colorClass} leading-relaxed`}>{activity.description}</p>
        <p className="text-xs text-gray-600 mt-0.5">{timeAgo}</p>
      </div>
    </div>
  );
};

export default ActivityItem;
