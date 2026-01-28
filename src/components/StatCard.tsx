import React from 'react';
import { LucideIcon, Thermometer, Zap, Activity, Battery } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color: 'blue' | 'red' | 'yellow' | 'green';
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, unit, icon: Icon, trend, trendValue, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-amber-50 text-amber-600',
    green: 'bg-emerald-50 text-emerald-600',
  };

  const ringClasses = {
     blue: 'ring-blue-100',
     red: 'ring-red-100',
     yellow: 'ring-amber-100',
     green: 'ring-emerald-100',
  };

  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]} ${ringClasses[color]} ring-4 ring-opacity-50`}>
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend === 'up' ? 'text-emerald-700 bg-emerald-100' : 
            trend === 'down' ? 'text-red-700 bg-red-100' : 'text-slate-600 bg-slate-100'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {trendValue}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-slate-800">{value}</span>
          <span className="ml-1 text-sm font-medium text-slate-500">{unit}</span>
        </div>
      </div>
    </div>
  );
};
