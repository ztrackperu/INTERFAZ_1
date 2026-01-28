import React from 'react';
import { X, Calendar, Download, Thermometer, Activity } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ZoneData } from './ZoneCard';

interface ZoneDetailViewProps {
  zone: ZoneData;
  onClose: () => void;
}

const generateHistory = (baseTemp: number) => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    supply: +(baseTemp + Math.random() * 2 - 1).toFixed(1),
    return: +(baseTemp - 2 + Math.random() * 1).toFixed(1),
    kw: +(3.5 + Math.random() * 2).toFixed(2),
    usda1: +(baseTemp + Math.random()).toFixed(1),
    usda2: +(baseTemp - 0.5 + Math.random()).toFixed(1),
    usda3: +(baseTemp + 0.2 + Math.random()).toFixed(1),
    usda4: +(baseTemp - 0.2 + Math.random()).toFixed(1),
    setpoint: 45.0,
    powerState: i > 2 && i < 22 ? 'ON' : 'OFF',
  }));
};

const MetricCard = ({ title, value, unit, icon: Icon, color }: any) => (
  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
    <div className={`p-2 rounded-lg ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">{title}</p>
      <p className="text-lg font-bold text-slate-800 dark:text-white">{value}<span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-0.5">{unit}</span></p>
    </div>
  </div>
);

export const ZoneDetailView: React.FC<ZoneDetailViewProps> = ({ zone, onClose }) => {
  const historyData = generateHistory(zone.supply);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 w-full max-w-7xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-3">
               <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{zone.name}</h2>
               <span className={`px-2 py-1 rounded-md text-xs font-bold ${zone.powerState === 'ON' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'}`}>
                  {zone.powerState}
               </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor de sondas USDA y Consumo</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 bg-slate-50/50 dark:bg-slate-900/50">
          
          {/* Detailed Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
             <MetricCard title="Suministro" value={zone.supply} unit="°C" icon={Thermometer} color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300" />
             <MetricCard title="Retorno" value={zone.return} unit="°C" icon={Thermometer} color="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300" />
             <MetricCard title="USDA 1" value={zone.usda1} unit="°C" icon={Activity} color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300" />
             <MetricCard title="USDA 2" value={zone.usda2} unit="°C" icon={Activity} color="bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300" />
             <MetricCard title="USDA 3" value={zone.usda3} unit="°C" icon={Activity} color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300" />
             <MetricCard title="USDA 4" value={zone.usda4} unit="°C" icon={Activity} color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300" />
             <MetricCard title="Setpoint" value={zone.setpoint} unit="°C" icon={Activity} color="bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300" />
             <MetricCard title="Consumo" value={(zone.power / 10).toFixed(1)} unit="kW" icon={Activity} color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300" />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Temp Chart */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Control Térmico</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historyData}>
                    <defs>
                      <linearGradient id="colorTemp3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} unit="°C" domain={['auto', 'auto']} />
                    <Tooltip 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)'}} 
                    />
                    <Legend />
                    <Area type="monotone" name="Suministro" dataKey="supply" stroke="#3b82f6" strokeWidth={2} fill="url(#colorTemp3)" />
                    <Area type="monotone" name="Retorno" dataKey="return" stroke="#06b6d4" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* USDA Probes Chart */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">Histórico Sondas USDA</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} unit="°C" domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                    <Legend />
                    <Line type="monotone" name="USDA 1" dataKey="usda1" stroke="#9333ea" strokeWidth={2} dot={false} />
                    <Line type="monotone" name="USDA 2" dataKey="usda2" stroke="#db2777" strokeWidth={2} dot={false} />
                    <Line type="monotone" name="USDA 3" dataKey="usda3" stroke="#ea580c" strokeWidth={2} dot={false} />
                    <Line type="monotone" name="USDA 4" dataKey="usda4" stroke="#4f46e5" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex-1">
             <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800">
                <h3 className="font-bold text-slate-700 dark:text-white flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-slate-500" />
                   Registro de Lecturas
                </h3>
                <button className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg transition-colors">
                   <Download className="w-4 h-4" /> Exportar
                </button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                   <thead className="bg-slate-50/80 dark:bg-slate-700/50 sticky top-0">
                      <tr>
                         <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700">Hora</th>
                         <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-700">Estado</th>
                         <th className="px-4 py-3 font-semibold text-blue-600 dark:text-blue-400 border-b border-slate-100 dark:border-slate-700">Suministro</th>
                         <th className="px-4 py-3 font-semibold text-cyan-600 dark:text-cyan-400 border-b border-slate-100 dark:border-slate-700">Retorno</th>
                         <th className="px-4 py-3 font-semibold text-amber-600 dark:text-amber-400 border-b border-slate-100 dark:border-slate-700">Consumo</th>
                         <th className="px-4 py-3 font-semibold text-purple-600 dark:text-purple-400 border-b border-slate-100 dark:border-slate-700">USDA 1</th>
                         <th className="px-4 py-3 font-semibold text-purple-600 dark:text-purple-400 border-b border-slate-100 dark:border-slate-700">USDA 2</th>
                         <th className="px-4 py-3 font-semibold text-purple-600 dark:text-purple-400 border-b border-slate-100 dark:border-slate-700">USDA 3</th>
                         <th className="px-4 py-3 font-semibold text-purple-600 dark:text-purple-400 border-b border-slate-100 dark:border-slate-700">USDA 4</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {historyData.map((row, i) => (
                         <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                            <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400 font-mono">{row.time}</td>
                            <td className="px-4 py-2.5">
                               <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${row.powerState === 'ON' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                                  {row.powerState}
                               </span>
                            </td>
                            <td className="px-4 py-2.5 text-slate-700 dark:text-slate-200 font-medium">{row.supply}°</td>
                            <td className="px-4 py-2.5 text-slate-600 dark:text-slate-400">{row.return}°</td>
                            <td className="px-4 py-2.5 text-amber-700 dark:text-amber-400 font-bold">{row.kw} kW</td>
                            <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{row.usda1}°</td>
                            <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{row.usda2}°</td>
                            <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{row.usda3}°</td>
                            <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{row.usda4}°</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
