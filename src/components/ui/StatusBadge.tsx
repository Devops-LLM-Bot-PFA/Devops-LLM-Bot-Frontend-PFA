
import React from 'react';
import { cn } from '@/lib/utils';
import { InstanceStatus } from '@/contexts/InstanceContext';

interface StatusBadgeProps {
  status: InstanceStatus;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withAnimation?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  size = 'md',
  withAnimation = true
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'running':
        return 'bg-devops-green text-white';
      case 'stopped':
        return 'bg-devops-gray text-white';
      case 'error':
        return 'bg-devops-red text-white';
      case 'creating':
        return 'bg-devops-blue text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'running':
        return 'Running';
      case 'stopped':
        return 'Stopped';
      case 'error':
        return 'Error';
      case 'creating':
        return 'Creating';
      default:
        return 'Unknown';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs';
      case 'lg':
        return 'px-4 py-1.5 text-sm';
      default:
        return 'px-3 py-1 text-xs';
    }
  };

  return (
    <span className={cn(
      'inline-flex items-center font-medium rounded-full',
      getStatusColor(),
      getSizeClasses(),
      withAnimation && status === 'running' && 'animate-pulse-slow',
      className
    )}>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full mr-1.5',
        status === 'running' ? 'bg-white' : 'bg-white/70'
      )}></span>
      {getStatusTitle()}
    </span>
  );
};

export default StatusBadge;
