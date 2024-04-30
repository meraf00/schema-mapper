'use client';

import { createSlice } from '@reduxjs/toolkit';

import { GENERATION_STATUS, GenerationState } from './types';

const generationInitialState: GenerationState = {
  timestamp: null,
  status: '',
  id: null,
};

const generationSlice = createSlice({
  name: GENERATION_STATUS,
  initialState: generationInitialState,
  reducers: {
    set(state, { payload: { timestamp, status, id } }) {
      state.timestamp = timestamp;
      state.status = status;
      state.id = id;

      localStorage.setItem(
        'generation',
        JSON.stringify({
          timestamp,
          status,
          id,
        })
      );
    },

    clear(state) {
      state.timestamp = null;
      state.status = '';
      state.id = null;

      localStorage.removeItem('generation');
    },

    load(state) {
      const generation = localStorage.getItem('generation');
      if (generation) {
        const parsed = JSON.parse(generation);
        state.timestamp = parsed.timestamp;
        state.status = parsed.status;
        state.id = parsed.id;
      }
    },
  },
});

export const { set, clear, load } = generationSlice.actions;

export default generationSlice.reducer;
