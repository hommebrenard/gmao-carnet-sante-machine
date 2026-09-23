import React, { useRef } from 'react';
import { 
  PlusCircle, 
  FileUp, 
  FileText, 
  Hourglass, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  XCircle,
  Activity,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { Equipment, Intervention } from '../types';

interface EquipmentDetailsProps {
  equipment: Equipment;
  interventions: Intervention[];
  onOpenNewIntervention: () => void;
  onOpenNewDocument: () => void;
  onOpenEditEquipment: () => void;
  onChangePhoto?: () => void;
  onFilterByStatus?: (status: 'in_progress' | 'pending' | 'completed' | 'all') => void;
  activeStatusFilter?: string;
}

export const EquipmentDetails: React.FC<EquipmentDetailsProps> = ({
  equipment,
  interventions,
  onOpenNewIntervention,
  onOpenNewDocument,
  onOpenEditEquipment,
  onChangePhoto,
  onFilterByStatus,
  activeStatusFilter = 'all'
}) => {
  // Compute counts for the 3 badges exactly as shown in the screenshot
  const countInProgress = interventions.filter(i => i.status === 'in_progress').length;
  const countPending = interventions.filter(i => i.status === 'pending').length;
  const countCompleted = interventions.filter(i => i.status === 'completed').length;

  const getStatusBadge = () => {
    switch (equipment.status) {
      case 'operational':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
            Opérationnel
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
            Maintenance requise
          </span>
        );
      case 'stopped':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 mr-1 text-rose-600" />
            Arrêt technique
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            <Activity className="w-3 h-3 mr-1 text-blue-600" />
            En maintenance
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 pb-4">
      {/* Left Column: Equipment Photo + 3 Action Buttons */}
      <div className="md:col-span-4 flex flex-col space-y-3">
        {/* Photo Container with Field Photo Change Action */}
        <div 
          onClick={onChangePhoto}
          className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-sm flex items-center justify-center relative overflow-hidden group cursor-pointer hover:border-sky-400 transition-all"
          title="Cliquez pour changer la photo ou prendre une photo sur le terrain"
        >
          <img
            src={equipment.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80'}
            alt={equipment.name}
            className="w-full h-48 object-contain object-center rounded transition-transform duration-300 group-hover:scale-102"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80';
            }}
          />
          <div className="absolute top-2 right-2">
            {getStatusBadge()}
          </div>

          {/* Field Photo Camera Overlay badge */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <span className="bg-slate-900/85 hover:bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-xs shadow-md flex items-center space-x-1.5 transition-all">
              <Camera className="w-3.5 h-3.5 text-sky-400" />
              <span>Photo terrain / Changer</span>
            </span>
          </div>
        </div>

        {/* 3 Action Buttons matching the screenshot's color styling */}
        <div className="flex flex-col space-y-2 pt-1">
          {/* Button 1: Green "Faire une demande d'intervention" */}
          <button
            id="btn-demande-intervention"
            onClick={onOpenNewIntervention}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-[#2ea44f] hover:bg-[#2c974b] text-white text-xs font-semibold rounded shadow-sm transition-colors cursor-pointer border border-[#268a41]"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>Faire une demande d'intervention</span>
          </button>

          {/* Button 2: Cyan/blue "Ajouter un document" */}
          <button
            id="btn-ajouter-document"
            onClick={onOpenNewDocument}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-semibold rounded shadow-sm transition-colors cursor-pointer border border-sky-600"
          >
            <FileUp className="w-4 h-4 text-sky-100" />
            <span>Ajouter un document</span>
          </button>

          {/* Button 3: Teal/dark cyan "Fiche d'identité" */}
          <button
            id="btn-fiche-identite"
            onClick={onOpenEditEquipment}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-semibold rounded shadow-sm transition-colors cursor-pointer border border-teal-700"
          >
            <FileText className="w-4 h-4 text-teal-100" />
            <span>Fiche d'identité / Fiche technique</span>
          </button>
        </div>
      </div>

      {/* Right Column: Metadata Details Table & 3 KPI Status Badges */}
      <div className="md:col-span-8 flex flex-col justify-between space-y-4">
        {/* Specification Table matching the image */}
        <div className="bg-white rounded-lg border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100 text-xs">
            <div className="grid grid-cols-12 py-2 px-3.5 hover:bg-slate-50/70 transition-colors">
              <span className="col-span-4 font-semibold text-slate-500">Nom :</span>
              <span className="col-span-8 font-medium text-slate-900">{equipment.name}</span>
            </div>

            <div className="grid grid-cols-12 py-2 px-3.5 hover:bg-slate-50/70 transition-colors">
              <span className="col-span-4 font-semibold text-slate-500">Groupe :</span>
              <span className="col-span-8 text-slate-800">{equipment.group}</span>
            </div>

            <div className="grid grid-cols-12 py-2 px-3.5 hover:bg-slate-50/70 transition-colors">
              <span className="col-span-4 font-semibold text-slate-500">Constructeur :</span>
              <span className="col-span-8 text-slate-800">{equipment.manufacturer}</span>
            </div>

            <div className="grid grid-cols-12 py-2 px-3.5 hover:bg-slate-50/70 transition-colors">
              <span className="col-span-4 font-semibold text-slate-500">Type :</span>
              <span className="col-span-8 text-slate-800">{equipment.type}</span>
            </div>

            <div className="grid grid-cols-12 py-2 px-3.5 hover:bg-slate-50/70 transition-colors">
              <span className="col-span-4 font-semibold text-slate-500">Numéro :</span>
              <span className="col-span-8 font-mono text-slate-800">{equipment.serialNumber}</span>
            </div>

            <div className="grid grid-cols-12 py-2 px-3.5 hover:bg-slate-50/70 transition-colors">
              <span className="col-span-4 font-semibold text-slate-500">Secteur :</span>
              <span className="col-span-8 text-slate-800">{equipment.location}</span>
            </div>

            <div className="grid grid-cols-12 py-2 px-3.5 hover:bg-slate-50/70 transition-colors">
              <span className="col-span-4 font-semibold text-slate-500">Tag :</span>
              <span className="col-span-8">
                <span className="inline-block bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono text-[11px] font-bold border border-slate-200">
                  {equipment.tag}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-12 py-2 px-3.5 hover:bg-slate-50/70 transition-colors">
              <span className="col-span-4 font-semibold text-slate-500">Atelier / Zone :</span>
              <span className="col-span-8 text-slate-800">{equipment.workshop}</span>
            </div>

            <div className="grid grid-cols-12 py-2 px-3.5 hover:bg-slate-50/70 transition-colors">
              <span className="col-span-4 font-semibold text-slate-500">Documentation :</span>
              <span className="col-span-8 text-slate-700 italic">{equipment.documentation}</span>
            </div>
          </div>
        </div>

        {/* 3 Status / KPI Counter Badges matching the image */}
        <div className="grid grid-cols-3 gap-3 pt-1">
          {/* Card 1: Hourglass (Green border/icon) */}
          <div 
            onClick={() => onFilterByStatus && onFilterByStatus(activeStatusFilter === 'in_progress' ? 'all' : 'in_progress')}
            className={`border-2 rounded-lg p-3 flex flex-col items-center justify-center transition-all cursor-pointer ${
              activeStatusFilter === 'in_progress'
                ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-400'
                : 'border-emerald-500/70 bg-emerald-50/40 hover:bg-emerald-50'
            }`}
            title="Filtrer les interventions en cours"
          >
            <div className="text-emerald-600 mb-1">
              <Hourglass className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-emerald-700 font-bold text-xs sm:text-sm">
              {countInProgress} en cours
            </span>
          </div>

          {/* Card 2: Calendar (Teal/Cyan border/icon) */}
          <div 
            onClick={() => onFilterByStatus && onFilterByStatus(activeStatusFilter === 'pending' ? 'all' : 'pending')}
            className={`border-2 rounded-lg p-3 flex flex-col items-center justify-center transition-all cursor-pointer ${
              activeStatusFilter === 'pending'
                ? 'border-cyan-600 bg-cyan-50 ring-2 ring-cyan-400'
                : 'border-cyan-500/70 bg-cyan-50/40 hover:bg-cyan-50'
            }`}
            title="Filtrer les interventions à planifier"
          >
            <div className="text-cyan-600 mb-1">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <span className="text-cyan-700 font-bold text-xs sm:text-sm">
              {countPending} à planifier
            </span>
          </div>

          {/* Card 3: Clock / Cycle (Slate/Dark border/icon) */}
          <div 
            onClick={() => onFilterByStatus && onFilterByStatus(activeStatusFilter === 'completed' ? 'all' : 'completed')}
            className={`border-2 rounded-lg p-3 flex flex-col items-center justify-center transition-all cursor-pointer ${
              activeStatusFilter === 'completed'
                ? 'border-slate-600 bg-slate-100 ring-2 ring-slate-400'
                : 'border-slate-300 bg-slate-50/60 hover:bg-slate-100'
            }`}
            title="Filtrer les interventions terminées / Historique"
          >
            <div className="text-slate-600 mb-1">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-slate-700 font-bold text-xs sm:text-sm">
              {countCompleted} terminée{countCompleted > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
