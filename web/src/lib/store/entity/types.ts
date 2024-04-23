import { Attribute } from '@/lib/model/attribute';
import { Schema } from '@/lib/model/schema';
import { Table } from '@/lib/model/table';

export const ENTITY = 'ENTITY';
export const SET_ACTIVE_ENTITY = `${ENTITY}/setActive`;

export interface EntityState {
  active: Attribute | Table | Schema | null;
  type: string | null;
}
