import React, { useState } from 'react';
import { 
  Wrench, 
  MoreVertical, 
  User, 
  Package, 
  Calendar, 
  BarChart3, 
  FileText,
  FileCheck,
  RefreshCw,
  Printer,
  Sparkles,
  Camera
} from 'lucide-react';
import { Equipment, Intervention, SparePart, MaintenanceSchedule, EquipmentDocument } from '../types';
import { EquipmentDetails } from './EquipmentDetails';
import { InterventionsTab } from './InterventionsTab';
import { ArticlesTab } from './ArticlesTab';
import { PlanningTab } from './PlanningTab';
import { IndicatorsTab } from './IndicatorsTab';
import { DocumentsTab } from './DocumentsTab';

interface EquipmentCardProps {
  equipment: Equipment;
  interventions: Intervention[];
  spareParts: SparePart[];
  schedules: MaintenanceSchedule[];
  documents: EquipmentDocument[];
  currentTab?: 'interventions' | 'articles' | 'planning' | 'indicators' | 'documents';
  onTabChange?: (tab: 'interventions' | 'articles' | 'planning' | 'indicators' | 'documents') => void;
  onOpenNewIntervention: (defaultAssignedType?: 'internal' | 'external') => void;
  onOpenNewDocument: () => void;
  onOpenEditEquipment: () => void;
  onOpenHealthRecord: () => void;
  onOpenPrintModal: () => void;
  onChangePhoto?: () => void;
  onUpdateInterventionStatus: (id: string, status: 'pending' | 'in_progress' | 'completed') => void;
  onDeleteIntervention: (id: string) => void;
  onAddSparePart: (part: Omit<SparePart, 'id'>) => void;
  onUpdateStock: (id: string, delta: number) => void;
  onDeleteDocument: (id: string) => void;
  onToggleDemoData: () => void;
  hasDemoData: boolean;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  equipment,
  interventions,
  spareParts,
  schedules,
  documents,
  currentTab,
  onTabChange,
  onOpenNewIntervention,
  onOpenNewDocument,
  onOpenEditEquipment,
  onOpenHealthRecord,
  onOpenPrintModal,
  onChangePhoto,
  onUpdateInterventionStatus,
  onDeleteIntervention,
  onAddSparePart,
  onUpdateStock,
  onDeleteDocument,
  onToggleDemoData,
  hasDemoData
}) => {
  const [internalTab, setInternalTab] = useState<'interventions' | 'articles' | 'planning' | 'indicators' | 'documents'>('interventions');
  
  const activeTab = currentTab || internalTab;
  const setActiveTab = (tab: 'interventions' | 'articles' | 'planning' | 'indicators' | 'documents') => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const [activeStatusFilter, setActiveStatusFilter] = useState<'in_progress' | 'pending' | 'completed' | 'all'>('all');
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  return (
    <div id="equipment-card" className="bg-white rounded-xl shadow-lg border border-slate-200/90 overflow-hidden transition-all max-w-5xl mx-auto backdrop-blur-xs">
      {/* Card Header matching screenshot: "Équipement: Compresseur 1" */}
      <div className="px-5 py-3.5 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
            <Wrench className="w-4 h-4 text-slate-700" />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
            <span>Équipement :</span>
            <span className="text-sky-950 font-extrabold">{equipment.name}</span>
          </h2>
          <span className="hidden sm:inline-block bg-sky-50 text-sky-800 border border-sky-200 text-[11px] font-mono px-2 py-0.5 rounded font-bold">
            {equipment.tag}
          </span>
        </div>

        {/* Right tools and Options menu */}
        <div className="flex items-center space-x-2 relative">
          {/* Quick button to toggle demo data (so user can switch between pure blank screenshot view and active records) */}
          <button
            onClick={onToggleDemoData}
            className={`text-xs px-2.5 py-1 rounded flex items-center space-x-1.5 transition-all border ${
              hasDemoData 
                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                : 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
            }`}
            title="Basculer entre vue vierge (comme la capture) et historique préchargé"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden md:inline">
              {hasDemoData ? 'Vue capture (vierge)' : 'Charger historique démo'}
            </span>
          </button>

          {/* Direct Print Icon Button */}
          <button
            id="btn-print-equipment"
            onClick={onOpenPrintModal}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors border border-slate-200 flex items-center space-x-1"
            title="Imprimer la fiche équipement & dossier technique"
          >
            <Printer className="w-4 h-4 text-slate-700" />
            <span className="text-[11px] font-medium hidden lg:inline text-slate-700">Imprimer</span>
          </button>

          <button
            onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
            title="Options de l'équipement"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Options Menu */}
          {showOptionsMenu && (
            <div 
              className="absolute right-0 top-8 z-30 w-56 bg-white rounded-md shadow-xl border border-slate-200 py-1 text-xs text-slate-700 animate-in fade-in duration-100"
              onMouseLeave={() => setShowOptionsMenu(false)}
            >
              <button
                onClick={() => { setShowOptionsMenu(false); onOpenHealthRecord(); }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-800"
              >
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Passeport & Carnet de Santé</span>
              </button>

              <button
                onClick={() => { setShowOptionsMenu(false); onOpenEditEquipment(); }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-800"
              >
                <Wrench className="w-4 h-4 text-sky-600" />
                <span>Modifier caractéristiques</span>
              </button>

              <button
                onClick={() => { setShowOptionsMenu(false); onChangePhoto?.(); }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-800"
              >
                <Camera className="w-4 h-4 text-sky-600" />
                <span>Changer photo / Terrain</span>
              </button>

              <button
                onClick={() => { setShowOptionsMenu(false); onOpenPrintModal(); }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-800"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Imprimer fiche équipement</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Equipment Details Section (Photo + 3 buttons + Metadata table + 3 KPI boxes) */}
      <EquipmentDetails
        equipment={equipment}
        interventions={interventions}
        onOpenNewIntervention={() => onOpenNewIntervention()}
        onOpenNewDocument={onOpenNewDocument}
        onOpenEditEquipment={onOpenEditEquipment}
        onChangePhoto={onChangePhoto}
        onFilterByStatus={(st) => {
          setActiveStatusFilter(st);
          setActiveTab('interventions');
        }}
        activeStatusFilter={activeStatusFilter}
      />

      {/* Navigation Tabs matching screenshot layout */}
      <div className="border-t border-b border-slate-200 bg-slate-50/80 px-6 pt-2 flex items-center space-x-1 sm:space-x-3 overflow-x-auto text-xs select-none">
        <button
          id="tab-interventions"
          onClick={() => setActiveTab('interventions')}
          className={`pb-2.5 px-3 font-semibold flex items-center space-x-1.5 border-b-2 transition-all cursor-pointer ${
            activeTab === 'interventions'
              ? 'border-sky-600 text-sky-700 bg-white rounded-t'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Interventions</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
            {interventions.length}
          </span>
        </button>

        <button
          id="tab-articles"
          onClick={() => setActiveTab('articles')}
          className={`pb-2.5 px-3 font-semibold flex items-center space-x-1.5 border-b-2 transition-all cursor-pointer ${
            activeTab === 'articles'
              ? 'border-sky-600 text-sky-700 bg-white rounded-t'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Articles</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
            {spareParts.length}
          </span>
        </button>

        <button
          id="tab-planning"
          onClick={() => setActiveTab('planning')}
          className={`pb-2.5 px-3 font-semibold flex items-center space-x-1.5 border-b-2 transition-all cursor-pointer ${
            activeTab === 'planning'
              ? 'border-sky-600 text-sky-700 bg-white rounded-t'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Planning</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
            {schedules.length}
          </span>
        </button>

        <button
          id="tab-indicateurs"
          onClick={() => setActiveTab('indicators')}
          className={`pb-2.5 px-3 font-semibold flex items-center space-x-1.5 border-b-2 transition-all cursor-pointer ${
            activeTab === 'indicators'
              ? 'border-sky-600 text-sky-700 bg-white rounded-t'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Indicateurs</span>
        </button>

        <button
          id="tab-documents"
          onClick={() => setActiveTab('documents')}
          className={`pb-2.5 px-3 font-semibold flex items-center space-x-1.5 border-b-2 transition-all cursor-pointer ${
            activeTab === 'documents'
              ? 'border-sky-600 text-sky-700 bg-white rounded-t'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Documents</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold">
            {documents.length}
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[260px]">
        {activeTab === 'interventions' && (
          <InterventionsTab
            interventions={interventions}
            onOpenNewIntervention={onOpenNewIntervention}
            onUpdateInterventionStatus={onUpdateInterventionStatus}
            onDeleteIntervention={onDeleteIntervention}
            activeStatusFilter={activeStatusFilter}
          />
        )}

        {activeTab === 'articles' && (
          <ArticlesTab
            spareParts={spareParts}
            onAddSparePart={onAddSparePart}
            onUpdateStock={onUpdateStock}
          />
        )}

        {activeTab === 'planning' && (
          <PlanningTab
            schedules={schedules}
            onAddSchedule={() => {}}
            onOpenNewIntervention={() => onOpenNewIntervention('internal')}
          />
        )}

        {activeTab === 'indicators' && (
          <IndicatorsTab
            equipment={equipment}
            interventions={interventions}
            onOpenHealthRecord={onOpenHealthRecord}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentsTab
            documents={documents}
            onOpenNewDocument={onOpenNewDocument}
            onDeleteDocument={onDeleteDocument}
          />
        )}
      </div>
    </div>
  );
};
