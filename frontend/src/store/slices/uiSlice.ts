import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Toast } from '../../types';

interface UiState {
  selectedTaskId: string | null;
  showCreateModal: boolean;
  showTaskDetailsModal: boolean;
  theme: 'dark' | 'light';
  toasts: Toast[];
  isConnected: boolean;
}

const initialState: UiState = {
  selectedTaskId: null,
  showCreateModal: false,
  showTaskDetailsModal: false,
  theme: 'dark',
  toasts: [],
  isConnected: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    selectTask(state, action: PayloadAction<string | null>) {
      state.selectedTaskId = action.payload;
      state.showTaskDetailsModal = action.payload !== null;
    },
    setShowCreateModal(state, action: PayloadAction<boolean>) {
      state.showCreateModal = action.payload;
    },
    setShowTaskDetailsModal(state, action: PayloadAction<boolean>) {
      state.showTaskDetailsModal = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
    addToast(state, action: PayloadAction<Omit<Toast, 'id'>>) {
      state.toasts.push({
        ...action.payload,
        id: `toast_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      });
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const {
  selectTask,
  setShowCreateModal,
  setShowTaskDetailsModal,
  toggleTheme,
  setConnected,
  addToast,
  removeToast,
} = uiSlice.actions;
export default uiSlice.reducer;
