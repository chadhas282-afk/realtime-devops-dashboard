import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserStatus } from '../../types';
import api from '../../services/api';

interface UsersState {
  byId: Record<string, User>;
  onlineUserIds: string[];
  loading: boolean;
}

const initialState: UsersState = {
  byId: {},
  onlineUserIds: [],
  loading: false,
};

export const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
  const { data } = await api.get<User[]>('/users');
  return data;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    userOnline(state, action: PayloadAction<User>) {
      state.byId[action.payload._id] = action.payload;
      if (!state.onlineUserIds.includes(action.payload._id)) {
        state.onlineUserIds.push(action.payload._id);
      }
    },
    userOffline(state, action: PayloadAction<{ userId: string }>) {
      if (state.byId[action.payload.userId]) {
        state.byId[action.payload.userId].status = 'offline';
      }
      state.onlineUserIds = state.onlineUserIds.filter((id) => id !== action.payload.userId);
    },
    presenceUpdated(
      state,
      action: PayloadAction<{ userId: string; status: UserStatus }>,
    ) {
      if (state.byId[action.payload.userId]) {
        state.byId[action.payload.userId].status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.byId = {};
        state.onlineUserIds = [];
        action.payload.forEach((user) => {
          state.byId[user._id] = user;
          if (['online', 'away', 'busy'].includes(user.status)) {
            state.onlineUserIds.push(user._id);
          }
        });
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { userOnline, userOffline, presenceUpdated } = usersSlice.actions;
export default usersSlice.reducer;
