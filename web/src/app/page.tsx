'use client';

import { cacheKeys, getProjects } from '@/api';
import { Project } from '@/lib/model/project';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';

export default function Home() {
  const {
    isPending,
    error,
    data: projects,
    isFetching,
  } = useQuery({
    queryKey: [cacheKeys.projects],
    queryFn: getProjects,
  });

  console.log(projects);

  return (
    <main className="h-screen relative flex gap-3 overflow-auto">
      {isPending && <p>Loading...</p>}
      {projects &&
        projects.map((project: Project) => (
          <Link key={project.stub} href={`${project.stub}/schemas`}>
            {project.name}
          </Link>
        ))}
    </main>
  );
}
