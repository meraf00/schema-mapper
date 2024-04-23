'use client';

import { Schema } from '@/lib/model/schema';
import React from 'react';
import { Node } from './Node';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setActive } from '@/lib/store/entity/slice';

export interface Active {
  schema: string | null;
  table: string | null;
  attribute: string | null;
  id: string | null;
}

export interface HierarchyProps {
  schemas: Schema[];
}

export const Hierarchy = ({ schemas }: HierarchyProps) => {
  const dispatch = useAppDispatch();
  const active = useAppSelector((state) => state.entity);

  return (
    <>
      {schemas.map((schema) => (
        <Node
          key={schema.id}
          title={schema.name}
          isActive={active.id === schema.id}
          onClick={() => {
            dispatch(
              setActive({
                attribute: null,
                table: null,
                schema: schema.id,
                id: schema.id,
              })
            );
          }}
        >
          {schema.tables.map((table) => (
            <Node
              key={table.id}
              title={table.name}
              isActive={active.id === table.id}
              onClick={() => {
                dispatch(
                  setActive({
                    attribute: null,
                    schema: schema.id,
                    table: table.id,
                    id: table.id,
                  })
                );
              }}
            >
              {table.attributes.map((attribute) => (
                <Node
                  key={attribute.id}
                  title={attribute.name}
                  isActive={active.id === attribute.id}
                  onClick={() => {
                    dispatch(
                      setActive({
                        table: table.id,
                        schema: schema.id,
                        attribute: attribute.id,
                        id: attribute.id,
                      })
                    );
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
