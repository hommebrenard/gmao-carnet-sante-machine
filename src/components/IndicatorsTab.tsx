import React from 'react';
import { 
  Activity, 
  Gauge, 
  TrendingUp, 
  Zap, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  FileCheck 
} from 'lucide-react';
import { Equipment, Intervention } from '../types';

interface IndicatorsTabProps {
  equipment: Equipment;
  interventions: Intervention[];
  onOpenHealthRecord: () => void;
}

export const IndicatorsTab: React.FC<IndicatorsTabProps> = ({
  equipment,
  interventions,
  onOpenHealthRecord
}) => {
  const loadRatio = Math.round((equipment.loadHours / (equipment.runningHours || 1)) * 100);
  const completedInterventions = interventions.filter(i => i.status === 'completed');
  const totalCosts = completedInterventions.reduce((sum, i) => sum + (i.cost || 0), 0) + 1240;

  return (
    <div className="p-4 space-y-4">
      {/* Top Banner with Health Score */}
      <div className="bg-gradient-to-r from-[#0b1c36] to-[#1e3a8a] text-white p-4 rounded-lg shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 font-bold text-lg">
            96%
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm tracking-wide text-white">
                INDICE DE SANTÉ & FIABILITÉ ÉQUIPEMENT
              </h3>
              <span className="bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-[10px] px-2 py-0.5 rounded font-semibold">
                Niveau A - Excellent
              </span>
            </div>
            <p className="text-xs text-sky-200 mt-0.5">
              Aucune anomalie critique détectée. Tous les contrôles de conformité DESP sont à jour.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenHealthRecord}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold shadow transition-colors flex items-center space-x-1.5 whitespace-nowrap cursor-pointer"
        >
          <FileCheck className="w-4 h-4" />
          <span>Éditer le Passeport Machine</span>
        </button>
      </div>

      {/* Grid of Key Industrial Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {/* Metric 1: Disponibilité */}
        <div className="bg-white p-3 rounded border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-semibold text-slate-500">Disponibilité</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">99.4 %</div>
          <span className="text-[10px] text-emerald-600 font-medium">+0.2% vs moyenne parc</span>
        </div>

        {/* Metric 2: MTBF */}
        <div className="bg-white p-3 rounded border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-semibold text-slate-500">MTBF (Moyenne pannes)</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">1 840 h</div>
          <span className="text-[10px] text-slate-500">Objectif constructeur : 1 500 h</span>
        </div>

        {/* Metric 3: MTTR */}
        <div className="bg-white p-3 rounded border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-semibold text-slate-500">MTTR (Temps réparation)</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">1.8 h</div>
          <span className="text-[10px] text-slate-500">Délai moyen d'intervention</span>
        </div>

        {/* Metric 4: Taux de charge */}
        <div className="bg-white p-3 rounded border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="font-semibold text-slate-500">Ratio de charge</span>
            <Gauge className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-slate-900">{loadRatio} %</div>
          <span className="text-[10px] text-slate-500">{equipment.loadHours.toLocaleString()} h / {equipment.runningHours.toLocaleString()} h</span>
        </div>
      </div>

      {/* Counters & Lifecycle tracking */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Box 1: Compteurs de marche */}
        <div className="bg-white p-3.5 rounded border border-slate-200">
          <h4 className="font-bold text-slate-800 flex items-center space-x-1.5 mb-2.5">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>Compteurs horaires machine</span>
          </h4>
          <div className="space-y-2 text-slate-700">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Heures totales sous tension :</span>
              <span className="font-mono font-bold text-slate-900">{equipment.runningHours.toLocaleString()} h</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Heures en compression :</span>
              <span className="font-mono font-bold text-emerald-700">{equipment.loadHours.toLocaleString()} h</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Mise en service :</span>
              <span className="font-medium text-slate-900">{equipment.commissioningDate}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Prochaine révision conseillée :</span>
              <span className="font-bold text-sky-700">16 000 h</span>
            </div>
          </div>
        </div>

        {/* Box 2: Paramètres physiques */}
        <div className="bg-white p-3.5 rounded border border-slate-200">
          <h4 className="font-bold text-slate-800 flex items-center space-x-1.5 mb-2.5">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>Données d'exploitation</span>
          </h4>
          <div className="space-y-2 text-slate-700">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Puissance nominale moteur :</span>
              <span className="font-mono font-bold text-slate-900">{equipment.powerKw} kW</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Pression de service régulée :</span>
              <span className="font-mono font-bold text-slate-900">{equipment.pressureBar} bar</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Régulation de débit :</span>
              <span className="font-medium text-slate-900">Variateur VSD (Fréquence)</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Fluide caloporteur / Huile :</span>
              <span className="font-medium text-slate-900">Roto-Inject synthétique</span>
            </div>
          </div>
        </div>

        {/* Box 3: Coûts de maintenance */}
        <div className="bg-white p-3.5 rounded border border-slate-200">
          <h4 className="font-bold text-slate-800 flex items-center space-x-1.5 mb-2.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Coûts de possession (TCO)</span>
          </h4>
          <div className="space-y-2 text-slate-700">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Budget préventif annuel :</span>
              <span className="font-medium text-slate-900">2 800 €</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Dépenses engagées à date :</span>
              <span className="font-mono font-bold text-emerald-700">{totalCosts.toLocaleString()} € HT</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Conformité budget :</span>
              <span className="font-semibold text-emerald-600">Conforme (Sous plafond)</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Garantie constructeur :</span>
              <span className="text-slate-500 italic">Contrat sérénité 5 ans</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
