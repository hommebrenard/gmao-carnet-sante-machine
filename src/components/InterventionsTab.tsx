import React from 'react';
import { 
  Wrench, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Building2, 
  Plus, 
  FileText,
  Trash2,
  Play,
  Calendar
} from 'lucide-react';
import { Intervention } from '../types';

interface InterventionsTabProps {
  interventions: Intervention[];
  onOpenNewIntervention: (defaultAssignedType?: 'internal' | 'external') => void;
  onUpdateInterventionStatus: (id: string, status: 'pending' | 'in_progress' | 'completed') => void;
  onDeleteIntervention: (id: string) => void;
  activeStatusFilter?: string;
  onSelectInterventionDetail?: (intervention: Intervention) => void;
}

export const InterventionsTab: React.FC<InterventionsTabProps> = ({
  interventions,
  onOpenNewIntervention,
  onUpdateInterventionStatus,
  onDeleteIntervention,
  activeStatusFilter = 'all',
  onSelectInterventionDetail
}) => {
  // Filter by status if filter active
  const filteredInterventions = interventions.filter(item => {
    if (activeStatusFilter === 'all') return true;
    return item.status === activeStatusFilter;
  });

  const internalInterventions = filteredInterventions.filter(i => i.assignedType === 'internal');
  const externalInterventions = filteredInterventions.filter(i => i.assignedType === 'external');

  // Calculate total durations formatted as HH:MM
  const formatDuration = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const internalTotalMinutes = internalInterventions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const externalTotalMinutes = externalInterventions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

  const renderPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">Urgence Critique</span>;
      case 'high':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">Haute</span>;
      case 'low':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">Faible</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-sky-100 text-sky-800">Normale</span>;
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">En cours</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">Terminée</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-100 text-cyan-800 border border-cyan-300">À planifier</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50/50">
      {/* LEFT COLUMN: Intervention de groupe affectée */}
      <div className="bg-white rounded border border-slate-200 shadow-xs flex flex-col min-h-[220px]">
        {/* Header bar styled exactly like the screenshot with light blue background */}
        <div className="bg-[#b9d5f5] text-slate-800 px-3.5 py-2 flex items-center justify-between font-semibold text-xs border-b border-sky-200">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-sky-900" />
            <span>Intervention de groupe affectée</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-white/80 px-2 py-0.5 rounded text-[11px] font-mono text-slate-800 shadow-2xs font-bold">
              • {formatDuration(internalTotalMinutes)}
            </span>
            <button
              onClick={() => onOpenNewIntervention('internal')}
              title="Ajouter une intervention interne"
              className="p-1 rounded hover:bg-white/90 text-sky-900 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="p-3 flex-1 flex flex-col justify-start">
          {internalInterventions.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <span className="text-xs italic text-slate-500">Aucune intervention affectée</span>
              <button
                onClick={() => onOpenNewIntervention('internal')}
                className="mt-3 text-[11px] text-sky-700 hover:text-sky-900 hover:underline font-medium inline-flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Créer une intervention interne</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {internalInterventions.map((item) => (
                <div 
                  key={item.id}
                  className="p-3 rounded border border-slate-200 hover:border-sky-300 bg-white transition-all shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] text-slate-500 font-bold">{item.code}</span>
                        {renderPriorityBadge(item.priority)}
                        {renderStatusBadge(item.status)}
                      </div>
                      <h4 className="text-xs font-semibold text-slate-900 mt-1 leading-snug">
                        {item.title}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => onDeleteIntervention(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1 text-slate-700 font-medium">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{item.assignee}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{item.scheduledDate}</span>
                      </span>
                      <span className="flex items-center space-x-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{item.estimatedDuration}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {item.status === 'pending' && (
                        <button
                          onClick={() => onUpdateInterventionStatus(item.id, 'in_progress')}
                          className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-medium flex items-center space-x-1 transition-colors"
                        >
                          <Play className="w-2.5 h-2.5" />
                          <span>Démarrer</span>
                        </button>
                      )}
                      {item.status === 'in_progress' && (
                        <button
                          onClick={() => onUpdateInterventionStatus(item.id, 'completed')}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-[10px] font-medium flex items-center space-x-1 transition-colors"
                        >
                          <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                          <span>Clôturer</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Sous-traitant ou tiers affecté */}
      <div className="bg-white rounded border border-slate-200 shadow-xs flex flex-col min-h-[220px]">
        {/* Header bar styled exactly like the screenshot with light blue background */}
        <div className="bg-[#b9d5f5] text-slate-800 px-3.5 py-2 flex items-center justify-between font-semibold text-xs border-b border-sky-200">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-sky-900" />
            <span>Sous-traitant ou tiers affecté</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="bg-white/80 px-2 py-0.5 rounded text-[11px] font-mono text-slate-800 shadow-2xs font-bold">
              • {formatDuration(externalTotalMinutes)}
            </span>
            <button
              onClick={() => onOpenNewIntervention('external')}
              title="Ajouter une intervention sous-traitée"
              className="p-1 rounded hover:bg-white/90 text-sky-900 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="p-3 flex-1 flex flex-col justify-start">
          {externalInterventions.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <span className="text-xs italic text-slate-500">Aucun sous-traitant affecté</span>
              <button
                onClick={() => onOpenNewIntervention('external')}
                className="mt-3 text-[11px] text-sky-700 hover:text-sky-900 hover:underline font-medium inline-flex items-center space-x-1"
              >
                <Plus className="w-3 h-3" />
                <span>Assigner un sous-traitant</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {externalInterventions.map((item) => (
                <div 
                  key={item.id}
                  className="p-3 rounded border border-slate-200 hover:border-sky-300 bg-white transition-all shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] text-slate-500 font-bold">{item.code}</span>
                        {renderPriorityBadge(item.priority)}
                        {renderStatusBadge(item.status)}
                      </div>
                      <h4 className="text-xs font-semibold text-slate-900 mt-1 leading-snug">
                        {item.title}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => onDeleteIntervention(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1 text-indigo-700 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded">
                        <Building2 className="w-3 h-3 text-indigo-500" />
                        <span>{item.contractorName || 'Sous-traitant'}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{item.scheduledDate}</span>
                      </span>
                      {item.cost && (
                        <span className="font-semibold text-emerald-700">
                          {item.cost} € HT
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {item.status === 'pending' && (
                        <button
                          onClick={() => onUpdateInterventionStatus(item.id, 'in_progress')}
                          className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-medium flex items-center space-x-1 transition-colors"
                        >
                          <Play className="w-2.5 h-2.5" />
                          <span>Démarrer</span>
                        </button>
                      )}
                      {item.status === 'in_progress' && (
                        <button
                          onClick={() => onUpdateInterventionStatus(item.id, 'completed')}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-[10px] font-medium flex items-center space-x-1 transition-colors"
                        >
                          <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                          <span>Valider PV</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
