export const ENTITY = 'ENTITY';
export const SET_ACTIVE_ENTITY = `${ENTITY}/setActive`;

export interface EntityState {
  type: 'schema' | 'table' | 'attribute' | null;
  id: string | null;
}
