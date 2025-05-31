
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: number;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  className
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
            {typeof trend !== 'undefined' && (
              <div className="flex items-center mt-2">
                {trend >= 0 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-devops-green mr-1"
                  >
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-devops-red mr-1"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                )}
                <span className={trend >= 0 ? 'text-devops-green' : 'text-devops-red'}>
                  {Math.abs(trend)}% {trend >= 0 ? 'increase' : 'decrease'}
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className="p-2 bg-primary/10 rounded-md text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
