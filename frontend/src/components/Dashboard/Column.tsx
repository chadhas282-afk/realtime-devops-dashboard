import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { useAppDispatch } from '../../store/hooks';
import { setShowCreateModal } from '../../store/slices/uiSlice';

interface ColumnProps {
  id: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
}

export const Column: React.FC<ColumnProps> = ({ id, title, color, tasks }) => {
  const dispatch = useAppDispatch();
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col w-72 flex-shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${color}`} />
          <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
          <span className="text-xs bg-gray-700 text-gray-400 rounded-full px-2 py-0.5">
            {tasks.length}
          </span>
        </div>
        {id === 'backlog' && (
          <button
            onClick={() => dispatch(setShowCreateModal(true))}
            className="text-gray-500 hover:text-gray-300 transition-colors text-lg leading-none"
            title="Add task"
          >
            +
          </button>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[200px] rounded-xl p-2 transition-colors ${
          isOver ? 'bg-gray-800/80 ring-1 ring-blue-500/50' : 'bg-gray-900/50'
        }`}
      >
        <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence>
            <div className="flex flex-col gap-2">
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </AnimatePresence>
        </SortableContext>

        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-20 text-gray-600 text-sm"
          >
            No tasks
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Column;
