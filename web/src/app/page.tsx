import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <main className="h-screen relative flex gap-3 overflow-auto">
      <Link href="project/schemas">My Project</Link>
    </main>
  );
}
