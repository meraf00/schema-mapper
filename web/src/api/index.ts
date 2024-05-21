import { AttributeFormData } from '@/features/schema-builder/components/Forms/AttributeForm';
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
  isNullable: boolean;
  isUnique: boolean;
  isPrimary: boolean;
  isForeign: boolean;
  isGenerated: boolean;
  references?: string;
  relationType?: 'ONE_TO_ONE' | 'MANY_TO_ONE';
  backref?: string;
  tableId?: string;
}

export const cacheKeys = {
  schemas: 'schemas',
  tables: 'tables',
  attributes: 'attributes',
  tasks: 'tasks',
};

export const getSchema = async (id: string) => {
  const response = await instance.get(`schemas/${id}`);
  return response.data;
};

export const getSchemas = async () => {
  const response = await instance.get('schemas');
  return response.data;
};

export const createSchema = async (name: string) => {
  const response = await instance.post('schemas', { name });
  return response.data;
};

export const updateSchema = async (id: string, name: string) => {
  const response = await instance.put(`schemas/${id}`, { name });
  return response.data;
};

export const getTable = async (id: string) => {
  const response = await instance.get(`tables/${id}`);
  return response.data;
};

export const createTable = async (
  schemaId: string,
  name: string,
  aggregate: boolean
) => {
  const response = await instance.post(`tables`, {
    name,
    schemaId,
    isAggregate: aggregate,
  });
  return response.data;
};

export const updateTable = async (
  id: string,
  name: string,
  aggregate: boolean
) => {
  const response = await instance.put(`tables/${id}`, {
    name,
    isAggregate: aggregate,
  });

  return response.data;
};

export const getAttribute = async (id: string) => {
  const response = await instance.get(`attributes/${id}`);
  return response.data;
};

export const createAttribute = async (attribute: AttributeData) => {
  const response = await instance.post(`attributes`, attribute);
  return response.data;
};

export const updateAttribute = async (
  attribId: string,
  attribute: AttributeData
) => {
  try {
    const response = await instance.put(`attributes/${attribId}`, attribute);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const deleteAttribute = async (id: string) => {
  const response = await instance.delete(`attributes/${id}`);
  return response.data;
};

export const deleteTable = async (id: string) => {
  const response = await instance.delete(`tables/${id}`);
  return response.data;
};

export const deleteSchema = async (id: string) => {
  const response = await instance.delete(`schemas/${id}`);
  return response.data;
};


export const createGenerateCodeTask = async (
  schemaIds: string[],
  pathMap: {
    [key: string]: { type: string; path: string };
  },
  paths: { type: string; path: string }[]
) => {
  console.log(pathMap, schemaIds, paths);
  const response = await instance.post(`generator`, {
    schemas: schemaIds,
    pathMap,
    paths,
  });
  
  return response.data;
};

export const getTasks = async () => {
  const response = await instance.get('generator');
  return response.data;
};
