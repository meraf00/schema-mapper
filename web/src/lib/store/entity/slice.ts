'use client';

import { createSlice } from '@reduxjs/toolkit';

import { ENTITY, EntityState } from './types';

const entityInitialState: EntityState = {
  type: null,
  id: null,
};

const entitySlice = createSlice({
  name: ENTITY,
  initialState: entityInitialState,
  reducers: {
    setActive(state, { payload: { type, id } }) {
      state.type = type;
      state.id = id;
    },
  },
});

export const { setActive } = entitySlice.actions;

export default entitySlice.reducer;
