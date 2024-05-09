'use client';

import { Schema } from '@/lib/model/schema';
import React from 'react';
import { Node } from '@/components/Node';
import { useParams, useRouter } from 'next/navigation';

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
  const path = '/project/schemas';
  const router = useRouter();
  const params = useParams();

  let active = null;

  if (params['attribute-id']) {
    active = params['attribute-id'];
  } else if (params['table-id']) {
    active = params['table-id'];
  } else if (params['schema-id']) {
    active = params['schema-id'];
  }

  return (
    <>
      {schemas.map((schema) => (
        <Node
          key={schema.id}
          onClick={() => {
            router.push(`${path}/${schema.id}`);
          }}
          title={schema.name}
          isActive={active == schema.id}
        >
          {schema.tables.map((table) => (
            <Node
              key={table.id}
              onClick={() =>
                router.push(`${path}/${schema.id}/tables/${table.id}`)
              }
              title={table.name}
              isActive={active == table.id}
            >
              {table.attributes.map((attribute) => (
                <Node
                  key={attribute.id}
                  onClick={() =>
                    router.push(
                      `${path}/${schema.id}/tables/${table.id}/attributes/${attribute.id}`
                    )
                  }
                  title={attribute.name}
                  isActive={active == attribute.id}
                />
              ))}
            </Node>
          ))}
        </Node>
      ))}
    </>
  );
};
