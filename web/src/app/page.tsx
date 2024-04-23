'use client';

import { getSchemas } from '@/api';
import { Explorer } from '@/components/Explorer';
import { Attribute, AttributeType } from '@/lib/model/attribute';
import { Schema } from '@/lib/model/schema';
import { Table } from '@/lib/model/table';
import { useQuery } from '@tanstack/react-query';

const schemas = [
  new Schema('s1', 'Schema 1', [
    new Table('t1', 'User', [
      new Attribute(
        'a1',
        'Name',
        AttributeType.TEXT,
        false,
        false,
        false,
        false,
        false
      ),
      new Attribute(
        'a2',
        'Name',
        AttributeType.TEXT,
        false,
        false,
        false,
        false,
        false
      ),
    ]),
    new Table('t2', 'Table 2', [
      new Attribute(
        'aa1',
        'Name',
        AttributeType.TEXT,
        false,
        false,
        false,
        false,
        false
      ),
      new Attribute(
        'aa2',
        'Name',
        AttributeType.TEXT,
        false,
        false,
        false,
        false,
        false
      ),
    ]),
  ]),
];

export default function Home() {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ['schemas'],
    queryFn: getSchemas,
  });

  if (isPending) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error: {error.toString()}</div>;
  } else if (isFetching) {
    return <div>Fetching...</div>;
  }

  return (
    <main className="h-screen">
      <Explorer className="w-1/4 px-2 border-r h-full" schemas={data} />
    </main>
  );
}
