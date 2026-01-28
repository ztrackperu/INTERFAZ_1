import React, { useState, useMemo, useEffect } from 'react';
import { ZoneCard, ZoneData } from './ZoneCard';
import { ZoneDetailView } from './ZoneDetailView';
import { AbatidoresCard, AbatidoresDetail, AbatidorMotor } from './AbatidoresComponents';
import { MachineControl } from './MachineControl';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, Settings, PlayCircle, StopCircle, Zap, Cpu, ClipboardList, CheckCircle2, Clock, Moon, Sun, User } from 'lucide-react';
import { Toaster } from 'sonner';

// --- MOCK DATA ---
const generateZones = (count: number): ZoneData[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Zona ${i + 1}`,
    supply: +(40 + Math.random() * 5).toFixed(1),
    return: +(35 + Math.random() * 5).toFixed(1),
    setpoint: 45.0,
    power: Math.floor(20 + Math.random() * 60), 
    usda1: +(41 + Math.random()).toFixed(1),
    usda2: +(40 + Math.random()).toFixed(1),
    usda3: +(42 + Math.random()).toFixed(1),
    usda4: +(39 + Math.random()).toFixed(1),
    powerState: Math.random() > 0.2 ? 'ON' : 'OFF',
    mode: Math.random() > 0.3 ? 'AUTO' : 'MANUAL'
  }));
};

const generateMotors = (): AbatidorMotor[] => {
    return Array.from({ length: 8 }, (_, i) => {
        const isOn = Math.random() > 0.3;
        return {
            id: i + 1,
            name: `Motor ${i + 1}`,
            status: isOn ? 'ON' : 'OFF',
            powerPct: isOn ? Math.floor(40 + Math.random() * 50) : 0,
            frequency: isOn ? +(58 + Math.random() * 4).toFixed(1) : 0,
            voltage: isOn ? +(375 + Math.random() * 10).toFixed(0) : 0,
            realPower: isOn ? +(15 + Math.random() * 5).toFixed(1) : 0,
            current: isOn ? +(25 + Math.random() * 5).toFixed(1) : 0,
        };
    });
};

const avgHistory = [
    { time: '08:00', temp: 41.2 }, { time: '09:00', temp: 41.5 },
    { time: '10:00', temp: 42.1 }, { time: '11:00', temp: 42.8 },
    { time: '12:00', temp: 43.2 }, { time: '13:00', temp: 42.5 },
    { time: '14:00', temp: 41.9 }, { time: '15:00', temp: 41.5 },
    { time: '16:00', temp: 41.8 }, { time: '17:00', temp: 42.0 },
    { time: '18:00', temp: 42.3 }, { time: '19:00', temp: 41.7 }
 ];

interface CommandLog {
  id: string;
  zoneId: number;
  zoneName: string;
  action: string;
  timestamp: string;
  status: 'Pending' | 'Sent' | 'Error';
  user: string;
}

export const Dashboard: React.FC = () => {
  const [zones, setZones] = useState<ZoneData[]>(generateZones(10));
  const [abatidores, setAbatidores] = useState<AbatidorMotor[]>(generateMotors());
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);
  const [showAbatidoresDetail, setShowAbatidoresDetail] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'control'>('dashboard');
  
  // Theme State
  const [darkMode, setDarkMode] = useState(false);

  // Toggle Dark Mode Class on Root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Pending commands state
  const [pendingCommands, setPendingCommands] = useState<CommandLog[]>([]);

  // Mock User
  const currentUser = "Admin";

  // Stats Calculation
  const stats = useMemo(() => {
    const on = zones.filter(z => z.powerState === 'ON').length;
    const off = zones.length - on;
    const auto = zones.filter(z => z.mode === 'AUTO').length;
    const manual = zones.filter(z => z.mode === 'MANUAL').length;
    
    const avgTemp = (zones.reduce((acc, z) => acc + z.supply, 0) / zones.length).toFixed(1);
    const totalConsumption = (zones.reduce((acc, z) => acc + z.power, 0) / 10).toFixed(1);

    return { on, off, auto, manual, avgTemp, totalConsumption };
  }, [zones]);

  const handleUpdateZone = (updatedZone: ZoneData) => {
    setZones(prev => prev.map(z => z.id === updatedZone.id ? updatedZone : z));
  };

  const handleCommandsGenerated = (newCommands: CommandLog[]) => {
    setPendingCommands(prev => [...newCommands, ...prev]);
    setCurrentView('dashboard');
  };

  const imageUrl = "https://images.unsplash.com/photo-1717386255773-a456c611dc4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBpbmR1c3RyaWFsJTIwcGxhbnQlMjBmYWN0b3J5JTIwaW50ZXJpb3IlMjBhdXRvbWF0aW9ufGVufDF8fHx8MTc2OTU1NDc3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  if (currentView === 'control') {
    return (
      <>
        <Toaster position="top-center" theme={darkMode ? 'dark' : 'light'} />
        <MachineControl 
          zones={zones} 
          onBack={() => setCurrentView('dashboard')}
          onUpdateZone={handleUpdateZone}
          onCommandsGenerated={handleCommandsGenerated}
          currentUser={currentUser}
        />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 overflow-hidden font-sans transition-colors duration-300">
      <Toaster position="top-right" theme={darkMode ? 'dark' : 'light'} />
      
      {/* Detail Modal for Zones */}
      {selectedZone && (
        <ZoneDetailView 
          zone={selectedZone} 
          onClose={() => setSelectedZone(null)} 
        />
      )}

      {/* Detail Modal for Abatidores */}
      {showAbatidoresDetail && (
         <AbatidoresDetail 
            motors={abatidores} 
            onClose={() => setShowAbatidoresDetail(false)} 
         />
      )}

      {/* Left Side - Image */}
      <div className="w-[280px] h-full hidden 2xl:block relative shadow-2xl z-10 shrink-0">
        <div className="absolute inset-0 bg-slate-900/60 z-10"></div>
        <img 
          src={imageUrl} 
          alt="Planta Industrial" 
          className="h-full w-full object-cover grayscale mix-blend-overlay"
        />
        <div className="absolute bottom-8 left-6 right-6 z-20 text-white">
          <h2 className="text-xl font-bold mb-2">Planta Principal</h2>
          <div className="flex flex-col gap-2 text-sm text-slate-200">
             <div className="flex justify-between border-b border-white/20 pb-1">
                <span>Eficiencia</span>
                <span className="font-mono text-emerald-400">98%</span>
             </div>
             <div className="flex justify-between border-b border-white/20 pb-1">
                <span>Consumo Total</span>
                <span className="font-mono">{stats.totalConsumption} kW</span>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        
        {/* TOP STATUS BAR */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 shadow-sm z-20 shrink-0 transition-colors">
           <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                 <h1 className="text-xl font-bold text-slate-800 dark:text-white hidden md:block">Monitor General</h1>
                 <button 
                   onClick={() => setCurrentView('control')}
                   className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
                 >
                   <Settings className="w-4 h-4" />
                   Control
                 </button>
                 <button 
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                 >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                 </button>
              </div>

              {/* Status Indicators */}
              <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                 <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50 rounded-lg min-w-[140px]">
                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/50 rounded text-emerald-600 dark:text-emerald-400"><PlayCircle className="w-5 h-5" /></div>
                    <div>
                       <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase block">Encendidas</span>
                       <span className="text-lg font-bold text-emerald-800 dark:text-emerald-300 leading-none">{stats.on}</span>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg min-w-[140px]">
                    <div className="p-1.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-500 dark:text-slate-400"><StopCircle className="w-5 h-5" /></div>
                    <div>
                       <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase block">Apagadas</span>
                       <span className="text-lg font-bold text-slate-700 dark:text-slate-300 leading-none">{stats.off}</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-lg min-w-[140px]">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded text-blue-600 dark:text-blue-400"><Cpu className="w-5 h-5" /></div>
                    <div>
                       <span className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase block">Auto</span>
                       <span className="text-lg font-bold text-blue-800 dark:text-blue-300 leading-none">{stats.auto}</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/50 rounded-lg min-w-[140px]">
                    <div className="p-1.5 bg-purple-100 dark:bg-purple-900/50 rounded text-purple-600 dark:text-purple-400"><Settings className="w-5 h-5" /></div>
                    <div>
                       <span className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase block">Manual</span>
                       <span className="text-lg font-bold text-purple-800 dark:text-purple-300 leading-none">{stats.manual}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
           <div className="max-w-[1600px] mx-auto space-y-6">
              
              {/* Trend Chart (Top) */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 h-[280px] flex flex-col transition-colors">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                       <BarChart3 className="w-5 h-5 text-blue-500" />
                       Tendencia de Temperatura Promedio
                    </h3>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white flex items-baseline gap-1">
                       {stats.avgTemp}<span className="text-sm font-normal text-slate-500 dark:text-slate-400">°C actual</span>
                    </div>
                 </div>
                 <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={avgHistory}>
                          <defs>
                             <linearGradient id="avgTempGradientTop" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} unit="°C" domain={['dataMin - 1', 'dataMax + 1']} />
                          <Tooltip 
                            contentStyle={{
                                borderRadius: '8px', 
                                border: 'none', 
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                backgroundColor: darkMode ? '#1e293b' : '#fff',
                                color: darkMode ? '#fff' : '#000'
                            }} 
                          />
                          <Area type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={3} fill="url(#avgTempGradientTop)" animationDuration={1000} />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                 
                 {/* 1. Zone Cards (1-10) */}
                 {zones.map((zone) => (
                    <ZoneCard 
                       key={zone.id} 
                       data={zone} 
                       onClick={() => setSelectedZone(zone)}
                    />
                 ))}

                 {/* 2. General Summary Card */}
                 <div className="bg-slate-800 dark:bg-slate-700/50 rounded-xl p-5 shadow-lg flex flex-col justify-center text-white relative overflow-hidden group min-h-[160px]">
                     <div className="absolute -right-4 -top-4 text-white/5 rotate-12">
                        <BarChart3 className="w-32 h-32" />
                     </div>
                     <h3 className="text-slate-300 font-medium mb-auto relative z-10">Resumen General</h3>
                     <div className="grid grid-cols-2 gap-4 relative z-10 mt-4">
                        <div>
                           <span className="text-xs text-slate-400 uppercase block">Temp. Media</span>
                           <span className="text-2xl font-bold">{stats.avgTemp}°</span>
                        </div>
                        <div>
                           <span className="text-xs text-slate-400 uppercase block">Consumo Total</span>
                           <span className="text-2xl font-bold text-amber-400">{stats.totalConsumption} kW</span>
                        </div>
                     </div>
                 </div>

                 {/* 3. Abatidores Card */}
                 <AbatidoresCard 
                    motors={abatidores} 
                    onClick={() => setShowAbatidoresDetail(true)} 
                 />

                 {/* 4. Pending Commands Log Card */}
                 <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col min-h-[200px] md:col-span-2 lg:col-span-1 xl:col-span-1 transition-colors">
                     <div className="flex items-center gap-2 mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                         <ClipboardList className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                         <h3 className="font-bold text-slate-700 dark:text-white">Comandos Pendientes</h3>
                     </div>
                     <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[150px]">
                         {pendingCommands.length === 0 ? (
                             <p className="text-sm text-slate-400 dark:text-slate-600 text-center py-4 italic">No hay comandos recientes</p>
                         ) : (
                             pendingCommands.map((cmd) => (
                                 <div key={cmd.id} className="flex items-start gap-2 text-xs p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                     <div className={`mt-0.5 ${cmd.status === 'Sent' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                         {cmd.status === 'Sent' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                     </div>
                                     <div className="flex-1">
                                         <p className="font-bold text-slate-700 dark:text-slate-300">{cmd.zoneName}</p>
                                         <p className="text-slate-500 dark:text-slate-400">{cmd.action}</p>
                                         <div className="flex justify-between mt-1">
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500">{cmd.timestamp}</p>
                                            <span className="flex items-center gap-1 text-[10px] text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 rounded">
                                                <User className="w-2.5 h-2.5" /> {cmd.user}
                                            </span>
                                         </div>
                                     </div>
                                 </div>
                             ))
                         )}
                     </div>
                 </div>

              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
