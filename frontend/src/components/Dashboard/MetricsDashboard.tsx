import React from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../store/hooks';
import { TaskStatus } from '../../types';

const statusColors: Record<TaskStatus, string> = {
  backlog: 'text-gray-400',
  'in-progress': 'text-blue-400',
  testing: 'text-yellow-400',
  deployed: 'text-green-400',
};

const STATUSES: TaskStatus[] = ['backlog', 'in-progress', 'testing', 'deployed'];

export const MetricsDashboard: React.FC = () => {
  const { byId, allIds } = useAppSelector((state) => state.tasks);
  const onlineUserIds = useAppSelector((state) => state.users.onlineUserIds);

  const taskCounts = STATUSES.reduce<Record<TaskStatus, number>>(
    (acc, status) => {
      acc[status] = allIds.filter((id) => byId[id]?.status === status).length;
      return acc;
    },
    { backlog: 0, 'in-progress': 0, testing: 0, deployed: 0 },
  );

  const totalTasks = allIds.length;

  const metrics = [
    { label: 'Total Tasks', value: totalTasks, icon: '📋', color: 'text-white' },
    { label: 'In Progress', value: taskCounts['in-progress'], icon: '⚡', color: 'text-blue-400' },
    { label: 'Testing', value: taskCounts['testing'], icon: '🧪', color: 'text-yellow-400' },
    { label: 'Deployed', value: taskCounts['deployed'], icon: '🚀', color: 'text-green-400' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg">{metric.icon}</span>
              <span className={`text-2xl font-bold ${metric.color}`}>{metric.value}</span>
            </div>
            <p className="text-xs text-gray-400">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="card">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Team Presence
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-gray-200">{onlineUserIds.length} online</span>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Task Distribution
        </h3>
        <div className="space-y-2">
          {STATUSES.map((status) => {
            const count = taskCounts[status];
            const pct = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
            return (
              <div key={status}>
                <div className="flex justify-between text-xs mb-1">
                  <span className={`capitalize ${statusColors[status]}`}>
                    {status.replace('-', ' ')}
                  </span>
                  <span className="text-gray-400">{count}</span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full rounded-full ${
                      status === 'deployed' ? 'bg-green-500' :
                      status === 'testing' ? 'bg-yellow-500' :
                      status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-500'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MetricsDashboard;
