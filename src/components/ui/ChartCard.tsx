
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  data: number[];
  dataKey?: string;
  label?: string;
  color?: string;
  className?: string;
  yAxisLabel?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  data,
  dataKey = 'value',
  label = 'Time',
  color = '#0EA5E9',
  className,
  yAxisLabel
}) => {
  // Transform data into format expected by recharts
  const chartData = data.map((value, index) => ({
    name: `${index}`,
    [dataKey]: value,
  }));

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="p-6 pb-0">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}${yAxisLabel || ''}`}
              />
              <Tooltip 
                formatter={(value) => [`${value}${yAxisLabel || ''}`, dataKey]}
                labelFormatter={() => label}
                contentStyle={{ background: 'rgba(255, 255, 255, 0.8)', borderColor: '#ddd' }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartCard;
