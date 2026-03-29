import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Activity } from '../../types';
import api from '../../services/api';

interface ActivitiesState {
  list: Activity[];
  loading: boolean;
}

const initialState: ActivitiesState = {
  list: [],
  loading: false,
};

export const fetchActivities = createAsyncThunk('activities/fetchAll', async () => {
  const { data } = await api.get<Activity[]>('/activities?limit=50');
  return data;
});

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    activityAdded(state, action: PayloadAction<Activity>) {
      state.list.unshift(action.payload);
      if (state.list.length > 100) {
        state.list = state.list.slice(0, 100);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchActivities.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { activityAdded } = activitiesSlice.actions;
export default activitiesSlice.reducer;
