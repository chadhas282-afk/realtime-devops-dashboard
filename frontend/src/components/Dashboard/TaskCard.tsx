import React from 'react';
import { motion } from 'framer-motion';
import { Task, TaskPriority } from '../../types';
import { useAppDispatch } from '../../store/hooks';
import { selectTask } from '../../store/slices/uiSlice';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
}

const priorityBadge: Record<TaskPriority, string> = {
  low: 'badge-priority-low',
  medium: 'badge-priority-medium',
  high: 'badge-priority-high',
  critical: 'badge-priority-critical',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const dispatch = useAppDispatch();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = () => {
    dispatch(selectTask(task._id));
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      onClick={handleClick}
      className={`bg-gray-800 border rounded-xl p-3 cursor-pointer select-none shadow-sm hover:shadow-md transition-shadow ${
        isDragging
          ? 'border-blue-500 shadow-blue-500/20'
          : 'border-gray-700 hover:border-gray-600'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-medium text-gray-100 leading-snug line-clamp-2 flex-1">
          {task.title}
        </h4>
        <span className={`flex-shrink-0 ${priorityBadge[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-gray-400 mb-2 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between">
        {task.assignee ? (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
              {task.assignee[0]?.toUpperCase()}
            </div>
            <span className="text-xs text-gray-400 truncate max-w-[80px]">{task.assignee}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-600">Unassigned</span>
        )}

        {task.dueDate && (
          <span className="text-xs text-gray-500">
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;
