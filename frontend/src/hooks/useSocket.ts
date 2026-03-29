import { useEffect, useRef } from 'react';
import { useAppDispatch } from '../store/hooks';
import { getSocket, connectSocket } from '../services/socket';
import { taskAdded, taskUpdated, taskDeleted } from '../store/slices/tasksSlice';
import { activityAdded } from '../store/slices/activitiesSlice';
import { userOnline, userOffline, presenceUpdated } from '../store/slices/usersSlice';
import { setConnected, addToast } from '../store/slices/uiSlice';
import type { Task, Activity, User } from '../types';
import type { AuthUser } from '../types';

export function useSocket(authUser: AuthUser | null): void {
  const dispatch = useAppDispatch();
  const registeredRef = useRef(false);

  useEffect(() => {
    if (!authUser) return;

    const socket = getSocket();
    connectSocket();

    if (registeredRef.current) return;
    registeredRef.current = true;

    socket.on('connect', () => {
      dispatch(setConnected(true));
      socket.emit('user:join', {
        userId: authUser.id,
        name: authUser.name,
        email: authUser.email,
      });
    });

    socket.on('disconnect', () => {
      dispatch(setConnected(false));
    });

    socket.on('connect_error', () => {
      dispatch(setConnected(false));
    });

    socket.on('task:created', (task: Task) => {
      dispatch(taskAdded(task));
      dispatch(addToast({ type: 'info', message: `New task: "${task.title}"` }));
    });

    socket.on('task:updated', (task: Task) => {
      dispatch(taskUpdated(task));
    });

    socket.on('task:deleted', (data: { id: string }) => {
      dispatch(taskDeleted(data.id));
      dispatch(addToast({ type: 'warning', message: 'A task was deleted' }));
    });

    socket.on('activity:new', (activity: Activity) => {
      dispatch(activityAdded(activity));
    });

    socket.on('user:online', (user: User) => {
      dispatch(userOnline(user));
    });

    socket.on('user:offline', (data: { userId: string }) => {
      dispatch(userOffline(data));
    });

    socket.on('presence:updated', (data: { userId: string; status: 'online' | 'away' | 'busy' | 'offline' }) => {
      dispatch(presenceUpdated(data));
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:deleted');
      socket.off('activity:new');
      socket.off('user:online');
      socket.off('user:offline');
      socket.off('presence:updated');
      registeredRef.current = false;
    };
  }, [authUser, dispatch]);
}

export default useSocket;
