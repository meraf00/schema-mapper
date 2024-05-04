import Link from 'next/link';
import React from 'react';

export interface TabButtonProps {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}

export const TabButton = ({ href, children, isActive }: TabButtonProps) => {
  if (isActive) {
    return (
      <Link
        href={href}
        className="bg-white transition-colors duration-300 px-3 py-1 rounded-t"
      >
        {children}
      </Link>
    );
  } else {
    return (
      <Link
        href={href}
        className="text-white  transition-colors duration-300 px-3 py-1 rounded-t"
      >
        {children}
      </Link>
    );
  }
};
