import { Schema } from '@/model/schema';
import React from 'react';
import { Node } from './Node';

export interface Active {
  schema: string | null;
  table: string | null;
  attribute: string | null;
  id: string | null;
}

export interface HierarchyProps {
  schemas: Schema[];
  active: Active;
  setActive: (active: Active) => void;
}

export const Hierarchy = ({ schemas, active, setActive }: HierarchyProps) => {
  return (
    <>
      {schemas.map((schema) => (
        <Node
          key={schema.id}
          title={schema.name}
          isActive={active.id === schema.id}
          onClick={() => {
            setActive({
              attribute: null,
              table: null,
              schema: schema.id,
              id: schema.id,
            });
          }}
        >
          {schema.tables.map((table) => (
            <Node
              key={table.id}
              title={table.name}
              isActive={active.id === table.id}
              onClick={() => {
                setActive({
                  attribute: null,
                  schema: schema.id,
                  table: table.id,
                  id: table.id,
                });
              }}
            >
              {table.attributes.map((attribute) => (
                <Node
                  key={attribute.id}
                  title={attribute.name}
                  isActive={active.id === attribute.id}
                  onClick={() => {
                    setActive({
                      table: table.id,
                      schema: schema.id,
                      attribute: attribute.id,
                      id: attribute.id,
                    });
                  }}
                />
              ))}
            </Node>
          ))}
        </Node>
      ))}
    </>
  );
};
