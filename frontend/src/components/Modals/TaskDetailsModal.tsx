import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectTask, setShowTaskDetailsModal, addToast } from '../../store/slices/uiSlice';
import { updateTask, deleteTask } from '../../store/slices/tasksSlice';
import { TaskStatus, TaskPriority } from '../../types';
import { getSocket } from '../../services/socket';

export const TaskDetailsModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedTaskId, showTaskDetailsModal } = useAppSelector((state) => state.ui);
  const task = useAppSelector((state) =>
    selectedTaskId ? state.tasks.byId[selectedTaskId] : null,
  );

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('backlog');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assignee, setAssignee] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setAssignee(task.assignee || '');
    }
  }, [task]);

  const handleClose = () => {
    dispatch(selectTask(null));
    dispatch(setShowTaskDetailsModal(false));
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!task) return;
    const updates = { title, description, status, priority, assignee };
    await dispatch(updateTask({ id: task._id, updates })).unwrap();

    const socket = getSocket();
    socket.emit('task:update', { id: task._id, ...updates });

    dispatch(addToast({ type: 'success', message: 'Task updated' }));
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!task || !confirm('Delete this task?')) return;
    await dispatch(deleteTask(task._id)).unwrap();

    const socket = getSocket();
    socket.emit('task:delete', { id: task._id });

    dispatch(addToast({ type: 'warning', message: 'Task deleted' }));
    handleClose();
  };

  if (!task) return null;

  return (
    <AnimatePresence>
      {showTaskDetailsModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-white">Task Details</h2>
              <div className="flex items-center gap-2">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-800"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-300 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {isEditing ? (
                <>
                  <input
                    className="input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <textarea
                    className="input resize-none"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description..."
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Status</label>
                      <select
                        className="input"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as TaskStatus)}
                      >
                        <option value="backlog">Backlog</option>
                        <option value="in-progress">In Progress</option>
                        <option value="testing">Testing</option>
                        <option value="deployed">Deployed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Priority</label>
                      <select
                        className="input"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as TaskPriority)}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  </div>
                  <input
                    className="input"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    placeholder="Assignee..."
                  />
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setIsEditing(false)} className="btn-secondary flex-1">
                      Cancel
                    </button>
                    <button onClick={handleSave} className="btn-primary flex-1">
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                  {task.description && (
                    <p className="text-sm text-gray-300">{task.description}</p>
                  )}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500 text-xs">Status</span>
                      <p className="text-gray-200 capitalize">{task.status.replace('-', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">Priority</span>
                      <p className="text-gray-200 capitalize">{task.priority}</p>
                    </div>
                    {task.assignee && (
                      <div>
                        <span className="text-gray-500 text-xs">Assignee</span>
                        <p className="text-gray-200">{task.assignee}</p>
                      </div>
                    )}
                    {task.dueDate && (
                      <div>
                        <span className="text-gray-500 text-xs">Due Date</span>
                        <p className="text-gray-200">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="pt-2 border-t border-gray-800">
                    <button
                      onClick={handleDelete}
                      className="btn-danger w-full text-sm"
                    >
                      Delete Task
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskDetailsModal;
