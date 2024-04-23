export const ENTITY = 'ENTITY';
export const SET_ACTIVE_ENTITY = `${ENTITY}/setActive`;

export interface EntityState {
  schema: string | null;
  table: string | null;
  attribute: string | null;
  id: string | null;
}
