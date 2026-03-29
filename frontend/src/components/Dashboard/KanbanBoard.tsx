import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from '@dnd-kit/core';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { taskMoved, updateTask } from '../../store/slices/tasksSlice';
import { addToast } from '../../store/slices/uiSlice';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import { Task, TaskStatus } from '../../types';
import { getSocket } from '../../services/socket';

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'backlog', title: 'Backlog', color: 'bg-gray-400' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-400' },
  { id: 'testing', title: 'Testing', color: 'bg-yellow-400' },
  { id: 'deployed', title: 'Deployed', color: 'bg-green-400' },
];

export const KanbanBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { byId, allIds } = useAppSelector((state) => state.tasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const getTasksByStatus = (status: TaskStatus) =>
    allIds.map((id) => byId[id]).filter((t) => t && t.status === status);

  const handleDragStart = (event: DragStartEvent) => {
    const task = byId[event.active.id as string];
    if (task) setActiveTask(task);
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // Handled in dragEnd for simplicity
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const task = byId[taskId];
    if (!task) return;

    const newStatus = COLUMNS.find((c) => c.id === overId)?.id
      ?? byId[overId]?.status;

    if (newStatus && newStatus !== task.status) {
      dispatch(taskMoved({ id: taskId, status: newStatus }));
      dispatch(updateTask({ id: taskId, updates: { status: newStatus } }));

      const socket = getSocket();
      socket.emit('task:update', { id: taskId, status: newStatus });

      if (newStatus === 'deployed') {
        dispatch(addToast({ type: 'success', message: `"${task.title}" deployed! 🚀` }));
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 h-full px-1">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            id={col.id}
            title={col.title}
            color={col.color}
            tasks={getTasksByStatus(col.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-90 rotate-2 shadow-2xl">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
