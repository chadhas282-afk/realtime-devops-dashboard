import React, { useEffect } from 'react';
import { useAppDispatch } from '../store/hooks';
import { fetchTasks } from '../store/slices/tasksSlice';
import { fetchActivities } from '../store/slices/activitiesSlice';
import { fetchUsers } from '../store/slices/usersSlice';
import { KanbanBoard } from '../components/Dashboard/KanbanBoard';
import { MetricsDashboard } from '../components/Dashboard/MetricsDashboard';
import { ActivityFeed } from '../components/ActivityFeed/ActivityFeed';
import { CreateTaskModal } from '../components/Modals/CreateTaskModal';
import { TaskDetailsModal } from '../components/Modals/TaskDetailsModal';
import { useAppSelector } from '../store/hooks';
import { setShowCreateModal } from '../store/slices/uiSlice';

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchActivities());
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-white">Kanban Board</h1>
          <button
            onClick={() => dispatch(setShowCreateModal(true))}
            className="btn-primary text-sm"
          >
            + New Task
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center flex-1 text-gray-500 text-sm">
            Loading tasks...
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto">
            <KanbanBoard />
          </div>
        )}
      </div>

      <div className="w-72 flex-shrink-0 border-l border-gray-800 flex flex-col overflow-hidden">
        <div className="flex-1 p-4 overflow-auto">
          <MetricsDashboard />
        </div>
        <div className="h-80 border-t border-gray-800 p-4 flex flex-col">
          <ActivityFeed />
        </div>
      </div>

      <CreateTaskModal />
      <TaskDetailsModal />
    </div>
  );
};

export default DashboardPage;
