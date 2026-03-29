import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import activitiesReducer from './slices/activitiesSlice';
import usersReducer from './slices/usersSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    activities: activitiesReducer,
    users: usersReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
