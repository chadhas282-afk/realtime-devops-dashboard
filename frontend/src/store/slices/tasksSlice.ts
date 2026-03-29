import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskStatus } from '../../types';
import api from '../../services/api';

interface TasksState {
  byId: Record<string, Task>;
  allIds: string[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  byId: {},
  allIds: [],
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async () => {
  const { data } = await api.get<Task[]>('/tasks');
  return data;
});

export const createTask = createAsyncThunk('tasks/create', async (task: Partial<Task>) => {
  const { data } = await api.post<Task>('/tasks', task);
  return data;
});

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
    const { data } = await api.put<Task>(`/tasks/${id}`, updates);
    return data;
  },
);

export const deleteTask = createAsyncThunk('tasks/delete', async (id: string) => {
  await api.delete(`/tasks/${id}`);
  return id;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    taskAdded(state, action: PayloadAction<Task>) {
      if (!state.byId[action.payload._id]) {
        state.byId[action.payload._id] = action.payload;
        state.allIds.push(action.payload._id);
      }
    },
    taskUpdated(state, action: PayloadAction<Task>) {
      if (state.byId[action.payload._id]) {
        state.byId[action.payload._id] = action.payload;
      }
    },
    taskDeleted(state, action: PayloadAction<string>) {
      delete state.byId[action.payload];
      state.allIds = state.allIds.filter((id) => id !== action.payload);
    },
    taskMoved(state, action: PayloadAction<{ id: string; status: TaskStatus }>) {
      if (state.byId[action.payload.id]) {
        state.byId[action.payload.id].status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.byId = {};
        state.allIds = [];
        action.payload.forEach((task) => {
          state.byId[task._id] = task;
          state.allIds.push(task._id);
        });
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.byId[action.payload._id] = action.payload;
        state.allIds.push(action.payload._id);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.byId[action.payload._id] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        delete state.byId[action.payload];
        state.allIds = state.allIds.filter((id) => id !== action.payload);
      });
  },
});

export const { taskAdded, taskUpdated, taskDeleted, taskMoved } = tasksSlice.actions;
export default tasksSlice.reducer;
