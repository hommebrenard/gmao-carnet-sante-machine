import React from 'react';
import { Calendar, ShieldAlert, CheckCircle2, Clock, Plus, AlertTriangle } from 'lucide-react';
import { MaintenanceSchedule } from '../types';

interface PlanningTabProps {
  schedules: MaintenanceSchedule[];
  onAddSchedule: (schedule: MaintenanceSchedule) => void;
  onOpenNewIntervention: () => void;
}

export const PlanningTab: React.FC<PlanningTabProps> = ({
  schedules,
  onOpenNewIntervention
}) => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
            <Calendar className="w-4 h-4 text-sky-600" />
            <span>Plan de maintenance préventive & contrôles réglementaires</span>
          </h3>
          <p className="text-[11px] text-slate-500">
            Suivi des échéances horaires, visites périodiques et obligations réglementaires (DESP, APAVE).
          </p>
        </div>

        <button
          onClick={onOpenNewIntervention}
          className="text-xs px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded flex items-center space-x-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Créer intervention préventive</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {schedules.map((item) => {
          const isRegulatory = item.legalRequirement;
          return (
            <div 
              key={item.id}
              className={`p-3.5 rounded border transition-all ${
                isRegulatory 
                  ? 'border-amber-300 bg-amber-50/40 shadow-xs' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-1.5">
                  {isRegulatory ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 flex items-center space-x-1">
                      <ShieldAlert className="w-3 h-3" />
                      <span>Réglementaire Obligatoire</span>
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-100 text-sky-800">
                      Constructeur
                    </span>
                  )}

                  {item.status === 'due_soon' ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center space-x-0.5">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      <span>Échéance proche (&lt; 60j)</span>
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800 flex items-center space-x-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Conforme</span>
                    </span>
                  )}
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-900 mt-2">
                {item.title}
              </h4>

              <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] text-slate-600 border-t border-slate-100 pt-2">
                <div>
                  <span className="block text-slate-400 text-[10px]">Périodicité</span>
                  <span className="font-medium text-slate-800">{item.frequency}</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px]">Dernière réalisation</span>
                  <span className="font-medium text-slate-800">{item.lastDoneDate}</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px]">Prochaine échéance</span>
                  <span className="font-bold text-sky-700">{item.nextDueDate}</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px]">Affecté à</span>
                  <span className="font-medium text-slate-800 truncate block">{item.assignedTo}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
