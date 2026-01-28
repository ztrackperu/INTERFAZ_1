import React, { useState } from 'react';
import { Fan, Activity, Zap, Power, Link as LinkIcon, X } from 'lucide-react';

// --- Types ---
export interface AbatidorMotor {
  id: number;
  name: string;
  status: 'ON' | 'OFF';
  powerPct: number; 
  frequency: number; 
  voltage: number;   
  realPower: number; 
  current: number;   
}

// --- Component: Abatidores Dashboard Card ---
interface AbatidoresCardProps {
  motors: AbatidorMotor[];
  onClick: () => void;
}

export const AbatidoresCard: React.FC<AbatidoresCardProps> = ({ motors, onClick }) => {
  const onCount = motors.filter(m => m.status === 'ON').length;
  const offCount = motors.length - onCount;
  const avgPower = Math.round(motors.reduce((acc, m) => acc + m.powerPct, 0) / motors.length);

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-cyan-300 dark:hover:border-cyan-600 cursor-pointer transition-all duration-200 group flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300 rounded-lg group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <Fan className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-700 dark:text-white">Abatidores</h3>
        </div>
        <div className="flex flex-col items-end">
            <span className="text-xs text-slate-400 uppercase">Promedio</span>
            <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400">{avgPower}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 flex flex-col">
             <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold uppercase mb-1">Encendidos</span>
             <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{onCount}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 flex flex-col">
             <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase mb-1">Apagados</span>
             <span className="text-2xl font-bold text-slate-600 dark:text-slate-300">{offCount}</span>
          </div>
      </div>
    </div>
  );
};

// --- Component: Motor Specific Detail (Pop-up 2) ---
interface MotorSpecificProps {
  motor: AbatidorMotor;
  onClose: () => void;
}

const MotorSpecific: React.FC<MotorSpecificProps> = ({ motor, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
       <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="bg-slate-800 dark:bg-slate-900 p-6 text-white flex justify-between items-center">
             <div>
                <h3 className="text-xl font-bold">{motor.name}</h3>
                <p className="text-slate-400 text-sm">Parámetros Eléctricos</p>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
             </button>
          </div>
          
          <div className="p-6 grid grid-cols-2 gap-4">
             <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                <Activity className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Frecuencia</span>
                <span className="text-2xl font-bold text-slate-800 dark:text-white">{motor.frequency} <span className="text-sm text-slate-400">Hz</span></span>
             </div>
             <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                <Zap className="w-6 h-6 text-amber-500 mb-2" />
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Voltaje</span>
                <span className="text-2xl font-bold text-slate-800 dark:text-white">{motor.voltage} <span className="text-sm text-slate-400">V</span></span>
             </div>
             <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                <Power className="w-6 h-6 text-red-500 mb-2" />
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Potencia Real</span>
                <span className="text-2xl font-bold text-slate-800 dark:text-white">{motor.realPower} <span className="text-sm text-slate-400">kW</span></span>
             </div>
             <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                <Activity className="w-6 h-6 text-purple-500 mb-2" />
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Corriente</span>
                <span className="text-2xl font-bold text-slate-800 dark:text-white">{motor.current} <span className="text-sm text-slate-400">A</span></span>
             </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/30 p-4 border-t border-slate-100 dark:border-slate-700 flex justify-center">
             <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${motor.status === 'ON' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-slate-200 text-slate-500 dark:bg-slate-600 dark:text-slate-300'}`}>
                <div className={`w-2 h-2 rounded-full ${motor.status === 'ON' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                Motor {motor.status === 'ON' ? 'Operativo' : 'Detenido'}
             </span>
          </div>
       </div>
    </div>
  );
};

// --- Component: Abatidores List View (Pop-up 1) ---
interface AbatidoresDetailProps {
  motors: AbatidorMotor[];
  onClose: () => void;
}

export const AbatidoresDetail: React.FC<AbatidoresDetailProps> = ({ motors, onClose }) => {
  const [selectedMotor, setSelectedMotor] = useState<AbatidorMotor | null>(null);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      {selectedMotor && (
         <MotorSpecific motor={selectedMotor} onClose={() => setSelectedMotor(null)} />
      )}
      
      <div className="bg-white dark:bg-slate-800 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                <Fan className="w-6 h-6 text-cyan-700 dark:text-cyan-400" />
             </div>
             <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Sistema de Abatidores</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Control y monitoreo de banco de motores</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {motors.map((motor) => (
              <div key={motor.id} className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-slate-700 dark:text-white">{motor.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${motor.status === 'ON' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                    {motor.status}
                  </span>
                </div>
                
                <div className="mb-6">
                   <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span>Potencia</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{motor.powerPct}%</span>
                   </div>
                   <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${motor.status === 'OFF' ? 'bg-slate-300 dark:bg-slate-600' : 'bg-cyan-500'}`} 
                        style={{ width: `${motor.powerPct}%` }}
                      ></div>
                   </div>
                </div>

                <button 
                  onClick={() => setSelectedMotor(motor)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <LinkIcon className="w-3 h-3" />
                  Vincular
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
