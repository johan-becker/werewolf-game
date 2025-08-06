'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// Properly typed dropdown menu components
interface BaseProps {
  children?: React.ReactNode;
  className?: string;
}

interface DropdownMenuProps extends BaseProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  asChild?: boolean;
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

interface DropdownMenuItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onSelect?: (event: React.SyntheticEvent<HTMLDivElement>) => void;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  children,
  className,
  ...props
}) => (
  <button className={cn('dropdown-trigger', className)} {...props}>
    {children}
  </button>
);

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('dropdown-content', className)} {...props}>
    {children}
  </div>
);

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('dropdown-item', className)} {...props}>
    {children}
  </div>
);

export const DropdownMenuCheckboxItem: React.FC<BaseProps> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

export const DropdownMenuRadioItem: React.FC<BaseProps> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

export const DropdownMenuLabel: React.FC<BaseProps> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

export const DropdownMenuSeparator: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn('dropdown-separator', className)} {...props} />;

export const DropdownMenuShortcut: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  children,
  ...props
}) => <span {...props}>{children}</span>;

export const DropdownMenuGroup: React.FC<BaseProps> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

export const DropdownMenuPortal: React.FC<BaseProps> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

export const DropdownMenuSub: React.FC<BaseProps> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

export const DropdownMenuSubContent: React.FC<BaseProps> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

export const DropdownMenuSubTrigger: React.FC<BaseProps> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

export const DropdownMenuRadioGroup: React.FC<BaseProps> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);
