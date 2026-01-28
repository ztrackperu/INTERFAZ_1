import React from 'react';
import { Target } from 'lucide-react';

export interface ZoneData {
  id: number;
  name: string;
  supply: number;
  return: number;
  setpoint: number;
  power: number; 
  usda1: number;
  usda2: number;
  usda3: number;
  usda4: number;
  powerState: 'ON' | 'OFF';
  mode: 'AUTO' | 'MANUAL';
}

interface ZoneCardProps {
  data: ZoneData;
  onClick: () => void;
}

export const ZoneCard: React.FC<ZoneCardProps> = ({ data, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 cursor-pointer transition-all duration-200 group relative overflow-hidden"
    >
      {/* Power State Indicator Strip */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${data.powerState === 'ON' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>

      <div className="pl-2 flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{data.name}</h3>
        <div className="flex gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${data.mode === 'AUTO' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' : 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800'}`}>
                {data.mode}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${data.powerState === 'ON' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                {data.powerState}
            </span>
        </div>
      </div>
      
      <div className="pl-2 grid grid-cols-3 gap-2 text-sm">
        <div className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5 uppercase">Suministro</span>
          <span className="font-bold text-slate-800 dark:text-white">
             {data.supply}°
          </span>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg text-center">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5 uppercase">Retorno</span>
          <span className="font-bold text-slate-800 dark:text-white">
            {data.return}°
          </span>
        </div>

        <div className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg text-center border border-blue-100 dark:border-blue-900/50">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5 uppercase">Setpoint</span>
          <span className="font-bold text-blue-700 dark:text-blue-400 flex items-center justify-center gap-1">
             {data.setpoint}°
          </span>
        </div>
      </div>
    </div>
  );
};
