'use client';

import { createSlice } from '@reduxjs/toolkit';

import { ENTITY, EntityState } from './types';

const entityInitialState: EntityState = {
  schema: null,
  table: null,
  attribute: null,
  id: null,
};

const entitySlice = createSlice({
  name: ENTITY,
  initialState: entityInitialState,
  reducers: {
    setActive(state, { payload: { schema, table, attribute, id } }) {
      state.schema = schema;
      state.table = table;
      state.attribute = attribute;
      state.id = id;
    },
  },
});

export const { setActive } = entitySlice.actions;

export default entitySlice.reducer;
