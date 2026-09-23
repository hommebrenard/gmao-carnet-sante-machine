import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  ShieldAlert, 
  Filter, 
  Wrench, 
  User, 
  Building2, 
  ChevronLeft, 
  ChevronRight,
  FileCheck,
  X
} from 'lucide-react';
import { Equipment, MaintenanceSchedule, Intervention } from '../types';

interface PlanningViewProps {
  equipments: Equipment[];
  currentEquipment: Equipment;
  schedules: MaintenanceSchedule[];
  interventions: Intervention[];
  onAddSchedule: (schedule: Omit<MaintenanceSchedule, 'id'>) => void;
  onOpenNewIntervention: (defaultType?: 'internal' | 'external', defaultTitle?: string) => void;
  onBackToEquipment: () => void;
  onSelectEquipment: (eq: Equipment) => void;
}

export const PlanningView: React.FC<PlanningViewProps> = ({
  equipments,
  currentEquipment,
  schedules,
  interventions,
  onAddSchedule,
  onOpenNewIntervention,
  onBackToEquipment,
  onSelectEquipment
}) => {
  const [filterEquipmentId, setFilterEquipmentId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newFrequency, setNewFrequency] = useState('1 000 h / 6 mois');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [newLegal, setNewLegal] = useState(false);
  const [newAssignedTo, setNewAssignedTo] = useState('Maintenance interne');
  const [targetEquipmentId, setTargetEquipmentId] = useState(currentEquipment.id);

  const filteredSchedules = schedules.filter(s => {
    const matchesEq = filterEquipmentId === 'all' || s.equipmentId === filterEquipmentId;
    if (!matchesEq) return false;
    if (filterStatus === 'legal') return s.legalRequirement;
    if (filterStatus === 'due_soon') return s.status === 'due_soon' || s.status === 'overdue';
    if (filterStatus === 'ok') return s.status === 'ok';
    return true;
  });

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDueDate) return;

    onAddSchedule({
      equipmentId: targetEquipmentId,
      title: newTitle,
      frequency: newFrequency,
      lastDoneDate: new Date().toISOString().slice(0, 10),
      nextDueDate: newDueDate,
      legalRequirement: newLegal,
      status: 'ok',
      assignedTo: newAssignedTo
    });

    setIsAddScheduleModalOpen(false);
    setNewTitle('');
  };

  // Calendar demo dates
  const daysInMonth = 30;
  const currentMonthName = "Septembre / Octobre 2026";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-sky-900 text-white shadow-sm">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                Planning GMAO & Calendrier Préventif
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Suivi chronologique des entretiens périodiques, inspections réglementaires DESP et ordres de travaux
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAddScheduleModalOpen(true)}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Programmer un Entretien</span>
          </button>

          <button
            onClick={onBackToEquipment}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <Wrench className="w-4 h-4" />
            <span>Fiche Équipement</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Plans Programmés</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{schedules.length}</div>
          <span className="text-[11px] text-sky-600 font-medium">Gammes préventives</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Contrôles DESP</span>
          <div className="text-2xl font-black text-amber-700 mt-1">
            {schedules.filter(s => s.legalRequirement).length}
          </div>
          <span className="text-[11px] text-amber-600 font-medium">Arrêté ESP / APAVE</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Échéances Proches</span>
          <div className="text-2xl font-black text-indigo-700 mt-1">
            {schedules.filter(s => s.status === 'due_soon').length || 1}
          </div>
          <span className="text-[11px] text-indigo-600 font-medium">Sous 60 jours</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Taux de Ponctualité</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">98.5%</div>
          <span className="text-[11px] text-emerald-600 font-medium">Maintenance maîtrisée</span>
        </div>
      </div>

      {/* Filter and Calendar Navigation Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium">Machine :</span>
            <select
              value={filterEquipmentId}
              onChange={(e) => setFilterEquipmentId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">Tous les équipements ({equipments.length})</option>
              {equipments.map(eq => (
                <option key={eq.id} value={eq.id}>{eq.tag} - {eq.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg ${filterStatus === 'all' ? 'bg-sky-600 text-white font-bold' : 'bg-slate-100 text-slate-600'}`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilterStatus('due_soon')}
              className={`px-2.5 py-1 rounded-lg ${filterStatus === 'due_soon' ? 'bg-amber-600 text-white font-bold' : 'bg-slate-100 text-slate-600'}`}
            >
              À prévoir
            </button>
            <button
              onClick={() => setFilterStatus('legal')}
              className={`px-2.5 py-1 rounded-lg ${filterStatus === 'legal' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 text-slate-600'}`}
            >
              Légal DESP
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
          <button className="p-1 rounded hover:bg-slate-100 text-slate-500">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono">{currentMonthName}</span>
          <button className="p-1 rounded hover:bg-slate-100 text-slate-500">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Schedules List */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center space-x-2">
          <Clock className="w-4 h-4 text-sky-600" />
          <span>Échéancier des Visites & Interventions Programmées</span>
        </h2>

        <div className="grid grid-cols-1 gap-3">
          {filteredSchedules.map((sch) => {
            const eq = equipments.find(e => e.id === sch.equipmentId) || currentEquipment;
            return (
              <div
                key={sch.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`p-2.5 rounded-lg shrink-0 ${
                    sch.legalRequirement ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-sky-50 text-sky-700 border border-sky-200'
                  }`}>
                    {sch.legalRequirement ? <ShieldAlert className="w-5 h-5" /> : <CalendarIcon className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                        {eq.tag}
                      </span>
                      {sch.legalRequirement && (
                        <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          Obligation Réglementaire DESP
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        sch.status === 'due_soon' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {sch.status === 'due_soon' ? 'Échéance proche' : 'À jour'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {sch.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500">
                      <div>
                        Périodicité : <strong className="text-slate-700">{sch.frequency}</strong>
                      </div>
                      <div>
                        Dernière exécution : <span className="font-mono">{sch.lastDoneDate}</span>
                      </div>
                      <div>
                        Intervenant : <strong className="text-slate-700">{sch.assignedTo}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 shrink-0 gap-2">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Prochaine Échéance</span>
                    <span className="text-sm font-extrabold text-sky-950 font-mono">
                      {sch.nextDueDate}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenNewIntervention(
                      sch.legalRequirement ? 'external' : 'internal', 
                      `Exécution plan : ${sch.title} (${eq.tag})`
                    )}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Lancer l'intervention</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Add Schedule */}
      {isAddScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-sky-600" />
                <span>Programmer une Échéance de Maintenance</span>
              </h3>
              <button onClick={() => setIsAddScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Équipement concerné</label>
                <select
                  value={targetEquipmentId}
                  onChange={(e) => setTargetEquipmentId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                >
                  {equipments.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.tag} - {eq.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Titre de l'opération préventive *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Remplacement cartouche séparatrice et vidange"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Périodicité</label>
                  <input
                    type="text"
                    placeholder="ex: 2 000 h / 6 mois"
                    value={newFrequency}
                    onChange={(e) => setNewFrequency(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date d'échéance *</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Affecté à (équipe ou sous-traitant)</label>
                <input
                  type="text"
                  placeholder="ex: Technicien Interne ou Atlas Copco"
                  value={newAssignedTo}
                  onChange={(e) => setNewAssignedTo(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="chk-legal"
                  checked={newLegal}
                  onChange={(e) => setNewLegal(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="chk-legal" className="text-slate-700 font-medium">
                  Obligation réglementaire légale (DESP, APAVE, F-Gaz)
                </label>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddScheduleModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold shadow-sm"
                >
                  Planifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
