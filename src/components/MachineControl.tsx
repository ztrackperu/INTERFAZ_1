import React, { useState, useMemo } from 'react';
import { ArrowLeft, Save, Power, Thermometer, Clock, Snowflake, Lock, AlertTriangle, ChevronRight } from 'lucide-react';
import { ZoneData } from './ZoneCard';
import { toast } from 'sonner';

interface CommandLog {
  id: string;
  zoneId: number;
  zoneName: string;
  action: string;
  timestamp: string;
  status: 'Pending' | 'Sent' | 'Error';
  user: string;
}

interface MachineControlProps {
  zones: ZoneData[];
  onBack: () => void;
  onUpdateZone: (updatedZone: ZoneData) => void;
  onCommandsGenerated: (commands: CommandLog[]) => void;
  currentUser: string;
}

export const MachineControl: React.FC<MachineControlProps> = ({ zones, onBack, onUpdateZone, onCommandsGenerated, currentUser }) => {
  const [localZones, setLocalZones] = useState<ZoneData[]>(JSON.parse(JSON.stringify(zones)));
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [schedules, setSchedules] = useState<Record<number, { date: string, time: string, action: 'ON' | 'OFF' }>>({});

  // Helper to check if a specific zone has changes
  const getZoneChanges = (zoneId: number) => {
    const original = zones.find(z => z.id === zoneId);
    const current = localZones.find(z => z.id === zoneId);
    const schedule = schedules[zoneId];
    
    if (!original || !current) return [];

    const changes = [];
    if (current.powerState !== original.powerState) changes.push(`Estado: ${original.powerState} -> ${current.powerState}`);
    if (current.setpoint !== original.setpoint) changes.push(`Setpoint: ${original.setpoint}° -> ${current.setpoint}°`);
    if (schedule && schedule.date && schedule.time) changes.push(`Prog: ${schedule.action} @ ${schedule.date} ${schedule.time}`);

    return changes;
  };

  const hasChanges = (zoneId: number) => getZoneChanges(zoneId).length > 0;

  // Aggregate all changes for the summary modal
  const allChanges = useMemo(() => {
    return localZones.map(z => ({
      name: z.name,
      changes: getZoneChanges(z.id)
    })).filter(item => item.changes.length > 0);
  }, [localZones, schedules]);

  const handleTogglePower = (zoneId: number) => {
    setLocalZones(prev => prev.map(z => 
      z.id === zoneId ? { ...z, powerState: z.powerState === 'ON' ? 'OFF' : 'ON' } : z
    ));
  };

  const handleSetpointChange = (zoneId: number, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setLocalZones(prev => prev.map(z => z.id === zoneId ? { ...z, setpoint: num } : z));
    }
  };

  const handleScheduleChange = (zoneId: number, field: 'date' | 'time' | 'action', value: string) => {
    setSchedules(prev => ({
      ...prev,
      [zoneId]: {
        ...prev[zoneId] || { date: '', time: '', action: 'OFF' },
        [field]: value
      }
    }));
  };

  const handleDefrost = (zoneId: number) => {
    toast.info(`Comando Defrost preparado para Zona ${zoneId}`);
  };

  const handleSaveClick = () => {
    if (allChanges.length === 0) {
        toast.info("No hay cambios pendientes para guardar.");
        return;
    }
    setShowPasswordModal(true);
    setError('');
    setPassword('');
  };

  const submitChanges = () => {
    if (password !== 'admin123') {
      setError('Contraseña incorrecta. Acceso denegado.');
      return;
    }

    const timestamp = new Date().toLocaleTimeString();
    const newLogs: CommandLog[] = [];

    // Apply changes
    localZones.forEach(z => {
       const original = zones.find(oz => oz.id === z.id);
       const zoneChanges = getZoneChanges(z.id);

       if (zoneChanges.length > 0) {
           // Create logs for each specific change type for better granularity
           if (z.powerState !== original?.powerState) {
               newLogs.push({ id: Math.random().toString(36).substr(2, 9), zoneId: z.id, zoneName: z.name, action: `Cambio Estado: ${z.powerState}`, timestamp, status: 'Sent', user: currentUser });
           }
           if (z.setpoint !== original?.setpoint) {
               newLogs.push({ id: Math.random().toString(36).substr(2, 9), zoneId: z.id, zoneName: z.name, action: `Nuevo Setpoint: ${z.setpoint}°C`, timestamp, status: 'Sent', user: currentUser });
           }
           const sched = schedules[z.id];
           if (sched && sched.date && sched.time) {
               newLogs.push({ id: Math.random().toString(36).substr(2, 9), zoneId: z.id, zoneName: z.name, action: `Prog: ${sched.action} el ${sched.date} ${sched.time}`, timestamp, status: 'Pending', user: currentUser });
           }
           
           // Update global state
           onUpdateZone(z);
       }
    });

    if (newLogs.length > 0) {
      onCommandsGenerated(newLogs);
      toast.success("Cambios enviados correctamente al controlador");
    }

    setShowPasswordModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-6 relative transition-colors duration-300">
      
      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 w-full max-w-md animate-in zoom-in duration-200">
              <div className="flex flex-col items-center mb-6">
                 <div className="p-3 bg-amber-100 text-amber-600 rounded-full mb-3">
                    <Lock className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 dark:text-white">Confirmar Cambios</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400 text-center">Revise los cambios antes de autorizar.</p>
              </div>

              {/* Summary List */}
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 mb-6 max-h-[200px] overflow-y-auto border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 sticky top-0 bg-slate-50 dark:bg-transparent">Resumen de Operaciones</h4>
                  {allChanges.map((item, idx) => (
                      <div key={idx} className="mb-3 last:mb-0">
                          <p className="font-bold text-slate-700 dark:text-slate-300 text-sm flex items-center gap-1">
                              <ChevronRight className="w-3 h-3 text-blue-500" /> {item.name}
                          </p>
                          <ul className="pl-5 mt-1 space-y-1">
                              {item.changes.map((change, cIdx) => (
                                  <li key={cIdx} className="text-xs text-slate-600 dark:text-slate-400 list-disc">{change}</li>
                              ))}
                          </ul>
                      </div>
                  ))}
              </div>

              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-4 py-3 mb-2 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                placeholder="Contraseña de administrador..."
                autoFocus
              />
              {error && <p className="text-red-500 text-xs mb-4 font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {error}</p>}
              
              <div className="flex gap-3 mt-4">
                 <button onClick={() => setShowPasswordModal(false)} className="flex-1 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">Cancelar</button>
                 <button onClick={submitChanges} className="flex-1 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-lg shadow-md transition-colors">Autorizar</button>
              </div>
           </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Volver al Panel</span>
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-600"></div>
            <div>
               <h1 className="text-xl font-bold text-slate-800 dark:text-white">Control de Máquina</h1>
               <p className="text-slate-500 dark:text-slate-400 text-sm">Modo de Configuración Avanzada</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             {allChanges.length > 0 && (
                 <span className="text-sm font-medium text-amber-600 dark:text-amber-400 animate-pulse">
                     {allChanges.length} zonas modificadas
                 </span>
             )}
             <button 
                onClick={handleSaveClick}
                disabled={allChanges.length === 0}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md transition-all font-medium ${
                    allChanges.length > 0 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500'
                }`}
             >
                <Save className="w-4 h-4" />
                Guardar Cambios
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {localZones.map((zone) => {
            const isChanged = hasChanges(zone.id);
            return (
                <div 
                    key={zone.id} 
                    className={`bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border-2 transition-all duration-300 ${
                        isChanged 
                        ? 'border-amber-400 dark:border-amber-500 ring-4 ring-amber-400/10 dark:ring-amber-500/10 scale-[1.01]' 
                        : zone.powerState === 'ON' ? 'border-emerald-500/30 dark:border-emerald-500/30' : 'border-slate-200 dark:border-slate-700'
                    }`}
                >
                
                {/* Header */}
                <div className={`p-4 border-b flex justify-between items-center transition-colors ${
                    isChanged ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-700'
                }`}>
                    <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                        {zone.name}
                        {isChanged && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                    </h3>
                    <button
                        onClick={() => handleTogglePower(zone.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        zone.powerState === 'ON' 
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300' 
                            : 'bg-slate-200 text-slate-500 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-400'
                        }`}
                    >
                        <Power className="w-3 h-3" />
                        {zone.powerState}
                    </button>
                </div>

                {/* Control Body */}
                <div className="p-6 space-y-6">
                    
                    {/* Setpoint */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                            <Thermometer className="w-4 h-4 text-blue-500" />
                            Temperatura Setpoint
                        </label>
                        <div className="flex items-center gap-2">
                            <input 
                            type="number" 
                            step="0.1"
                            value={zone.setpoint}
                            onChange={(e) => handleSetpointChange(zone.id, e.target.value)}
                            className="w-full border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-3 py-2 text-lg font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                            />
                            <span className="text-slate-400 font-medium">°C</span>
                        </div>
                    </div>

                    {/* Programar Apagado/Encendido */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
                            <Clock className="w-4 h-4 text-purple-500" />
                            Programar Evento
                        </label>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                            <input 
                            type="date" 
                            className="text-sm border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded px-2 py-1 outline-none focus:border-blue-500"
                            onChange={(e) => handleScheduleChange(zone.id, 'date', e.target.value)}
                            />
                            <input 
                            type="time" 
                            className="text-sm border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded px-2 py-1 outline-none focus:border-blue-500"
                            onChange={(e) => handleScheduleChange(zone.id, 'time', e.target.value)}
                            />
                        </div>
                        <select 
                            className="w-full text-sm border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded px-2 py-1 outline-none focus:border-blue-500"
                            onChange={(e) => handleScheduleChange(zone.id, 'action', e.target.value as 'ON' | 'OFF')}
                        >
                            <option value="OFF">Apagar en fecha indicada</option>
                            <option value="ON">Encender en fecha indicada</option>
                        </select>
                    </div>

                    {/* Defrost Action */}
                    <button 
                        onClick={() => handleDefrost(zone.id)}
                        className="w-full flex items-center justify-center gap-2 border border-cyan-200 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800 font-medium py-2 rounded-lg transition-colors"
                    >
                        <Snowflake className="w-4 h-4" />
                        Forzar Defrost
                    </button>

                </div>
                </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
