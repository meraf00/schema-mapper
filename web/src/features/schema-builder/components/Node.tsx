'use client';
import React, { useState } from 'react';
import {
  IconChevronDown,
  IconChevronRight,
  IconCircle,
} from '@tabler/icons-react';

export interface NodeProps {
  children?: React.ReactNode;
  title: string;
  isActive: boolean;
  onClick?: () => void;
}

export const Node = ({
  title,
  children,
  onClick,
  isActive = false,
}: NodeProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <span
        className="flex items-center hover:bg-slate-200 w-full cursor-pointer rounded px-2 text-sm py-1"
        style={isActive ? { backgroundColor: 'rgb(147, 197, 253)' } : {}}
        onClick={() => {
          onClick ? onClick() : null;
        }}
      >
        {children ? (
          isOpen ? (
            <IconChevronDown
              size={16}
              className="mr-2 hover:text-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen((state) => !state);
              }}
            />
          ) : (
            <IconChevronRight
              size={16}
              className="mr-2 hover:text-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen((state) => !state);
              }}
            />
          )
        ) : (
          <IconCircle size={8} className="mr-3 ml-1" />
        )}
        {title}
      </span>
      {children && isOpen ? (
        <div className="ml-4 border-l pl-2">{children}</div>
      ) : null}
    </div>
  );
};
