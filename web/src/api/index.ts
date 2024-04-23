import { AttributeType, RelationType } from '@/lib/model/attribute';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3001/',
});

export interface AttributeData {
  name: string;
  type:
    | 'CHAR'
    | 'VARCHAR'
    | 'TEXT'
    | 'BOOLEAN'
    | 'TINYINT'
    | 'INTEGER'
    | 'BIGINT'
    | 'FLOAT'
    | 'DOUBLE'
    | 'DATE'
    | 'TIME'
    | 'TIMESTAMP';
  tableId: string;
  isNullable: boolean;
  isUnique: boolean;
  isPrimary: boolean;
  isForeign: boolean;
  isGenerated: boolean;
  references?: string;
  relationType?: 'ONE_TO_ONE' | 'MANY_TO_ONE';
}

export const cacheKeys = {
  schemas: 'schemas',
};

export const getSchemas = async () => {
  const response = await instance.get('schemas');
  return response.data;
};

export const createSchema = async (name: string) => {
  const response = await instance.post('schemas', { name });
  return response.data;
};

export const createTable = async (schemaId: string, name: string) => {
  const response = await instance.post(`tables`, { name, schemaId });
  return response.data;
};

export const createAttribute = async (attribute: AttributeData) => {
  console.log(attribute);
  const response = await instance.post(`attributes`, attribute);
  return response.data;
};
