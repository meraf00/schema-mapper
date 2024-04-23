'use client';

import { createSlice } from '@reduxjs/toolkit';

import { ENTITY, EntityState } from './types';

const entityInitialState: EntityState = {
  active: null,
  type: null,
};

const entitySlice = createSlice({
  name: ENTITY,
  initialState: entityInitialState,
  reducers: {
    setActive(state, action) {
      state.active = action.payload;
    },
  },
});

export const { setActive } = entitySlice.actions;

export default entitySlice.reducer;
