'use client';
import React, { useState } from 'react';
import {
  IconChevronDown,
  IconChevronRight,
  IconCircle,
} from '@tabler/icons-react';

export interface NodeProps {
  children?: React.ReactNode;
  title: string | React.ReactNode;
  isActive?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  onContextMenu?: (e?: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  isClosed?: boolean;
}

export const Node = ({
  title,
  children,
  onClick,
  onContextMenu,
  isActive = false,
  isClosed = true,
}: NodeProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(!isClosed);

  return (
    <div>
      <span
        className="flex items-center hover:bg-slate-200 w-full cursor-pointer rounded px-2 text-sm py-1"
        style={isActive ? { backgroundColor: 'rgb(147, 197, 253)' } : {}}
        onContextMenu={onContextMenu}
        onClick={(e) => (onClick ? onClick() : setIsOpen((state) => !state))}
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
