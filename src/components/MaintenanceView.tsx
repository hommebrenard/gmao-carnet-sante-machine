import React, { useState } from 'react';
import { 
  ClipboardList, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  ShieldAlert, 
  BookOpen, 
  ListChecks, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Package
} from 'lucide-react';
import { Equipment, MaintenanceProcedure } from '../types';

interface MaintenanceViewProps {
  equipment: Equipment;
  procedures: MaintenanceProcedure[];
  onTriggerInterventionForProcedure: (procedure: MaintenanceProcedure) => void;
  onBackToEquipment: () => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  equipment,
  procedures,
  onTriggerInterventionForProcedure,
  onBackToEquipment
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedProcedureId, setExpandedProcedureId] = useState<string | null>(procedures[0]?.id || null);

  const filteredProcedures = procedures.filter(p => {
    if (selectedType === 'all') return true;
    return p.type === selectedType;
  });

  const getProcedureTypeBadge = (type: MaintenanceProcedure['type']) => {
    switch (type) {
      case 'preventive':
        return <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded">Préventive Systématique</span>;
      case 'regulatory':
        return <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded">Réglementaire Obligatoire (DESP)</span>;
      case 'predictive':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">Conditionnelle / Prédictive</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-sky-900 text-white shadow-sm">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                Gammes & Plans de Maintenance Préventive
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Procédures opératoires standardisées, consignations sécurité LOTO et points de contrôle constructeur
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToEquipment}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <Wrench className="w-4 h-4" />
            <span>Fiche Équipement ({equipment.tag})</span>
          </button>
        </div>
      </div>

      {/* Equipment State Banner */}
      <div className="bg-gradient-to-r from-[#0b1c36] to-[#162d52] text-white p-4 sm:p-5 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-sky-500/20 border border-sky-400/30 rounded-lg text-sky-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-sky-300 font-mono">Équipement de référence</div>
            <div className="text-base font-bold text-white flex items-center space-x-2">
              <span>{equipment.name}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-sky-600 font-mono">{equipment.tag}</span>
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              {equipment.manufacturer} • {equipment.type}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-sky-900/60">
          <div>
            <span className="text-[11px] text-sky-300 block">Compteur d'heures</span>
            <span className="text-xl font-black font-mono text-white">
              {equipment.runningHours.toLocaleString()} h
            </span>
          </div>
          <div>
            <span className="text-[11px] text-sky-300 block">Prochaine visite DESP</span>
            <span className="text-base font-bold font-mono text-amber-300">
              {equipment.nextRegulatoryDate || '2026-11-15'}
            </span>
          </div>
        </div>
      </div>

      {/* Type Filter Buttons */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-2 overflow-x-auto text-xs">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            selectedType === 'all' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Toutes les gammes ({procedures.length})
        </button>
        <button
          onClick={() => setSelectedType('preventive')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            selectedType === 'preventive' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Préventives Systématiques
        </button>
        <button
          onClick={() => setSelectedType('regulatory')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            selectedType === 'regulatory' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Contrôles Réglementaires (DESP)
        </button>
      </div>

      {/* Gammes List */}
      <div className="space-y-4">
        {filteredProcedures.map((proc) => {
          const isExpanded = expandedProcedureId === proc.id;
          return (
            <div 
              key={proc.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all"
            >
              {/* Gamme Header Row */}
              <div 
                onClick={() => setExpandedProcedureId(isExpanded ? null : proc.id)}
                className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    proc.type === 'regulatory' ? 'bg-indigo-50 text-indigo-700' : 'bg-sky-50 text-sky-700'
                  }`}>
                    {proc.type === 'regulatory' ? <ShieldAlert className="w-5 h-5" /> : <ListChecks className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-sky-900 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                        {proc.code}
                      </span>
                      {getProcedureTypeBadge(proc.type)}
                      <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                        Périodicité : <strong>{proc.frequencyLabel}</strong>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {proc.title}
                    </h3>

                    <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
                      {proc.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right hidden md:block">
                    <span className="text-[10px] text-slate-400 block">Durée estimée</span>
                    <span className="text-xs font-mono font-bold text-slate-800">{proc.estimatedDuration}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTriggerInterventionForProcedure(proc);
                    }}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Créer OT</span>
                  </button>

                  <div className="text-slate-400 p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Details Body */}
              {isExpanded && (
                <div className="border-t border-slate-200 bg-slate-50/70 p-5 space-y-4 text-xs">
                  {/* Checkpoints Checklist */}
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase tracking-wide flex items-center space-x-1.5 mb-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Points de Contrôle & Opérations à Réaliser</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {proc.checkpoints.map((cp, idx) => (
                        <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-start space-x-2">
                          <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-slate-700">{cp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Safety and Parts Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Safety Instructions */}
                    {proc.safetyInstructions && (
                      <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 space-y-1">
                        <div className="font-bold text-amber-900 flex items-center space-x-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>Consignes de Sécurité & Habilitations (LOTO)</span>
                        </div>
                        <p className="text-amber-800 text-[11px] leading-relaxed">
                          {proc.safetyInstructions}
                        </p>
                      </div>
                    )}

                    {/* Required Parts */}
                    {proc.requiredParts && proc.requiredParts.length > 0 && (
                      <div className="bg-sky-50/60 border border-sky-200 rounded-lg p-3 space-y-1">
                        <div className="font-bold text-sky-900 flex items-center space-x-1.5">
                          <Package className="w-4 h-4 text-sky-600" />
                          <span>Pièces Détachées & Consommables Requis</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proc.requiredParts.map((part, pIdx) => (
                            <span key={pIdx} className="bg-white border border-sky-200 text-sky-900 px-2 py-0.5 rounded text-[11px] font-medium">
                              {part}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
