import React, { useState, useEffect } from 'react';
import { 
  INITIAL_EQUIPMENTS, 
  INITIAL_INTERVENTIONS, 
  DEMO_PRELOADED_INTERVENTIONS,
  INITIAL_SPARE_PARTS, 
  INITIAL_SCHEDULES, 
  INITIAL_DOCUMENTS,
  INITIAL_SUPPLIERS,
  INITIAL_MAINTENANCE_PROCEDURES
} from './data/initialData';
import { 
  Equipment, 
  Intervention, 
  SparePart, 
  MaintenanceSchedule, 
  EquipmentDocument,
  Supplier,
  MaintenanceProcedure,
  InterventionType
} from './types';
import { Header } from './components/Header';
import { EquipmentCard } from './components/EquipmentCard';
import { SuppliersView } from './components/SuppliersView';
import { PlanningView } from './components/PlanningView';
import { MaintenanceView } from './components/MaintenanceView';
import { PrintEquipmentModal } from './components/PrintEquipmentModal';
import { NewInterventionModal } from './components/NewInterventionModal';
import { NewDocumentModal } from './components/NewDocumentModal';
import { EditEquipmentModal } from './components/EditEquipmentModal';
import { HealthRecordModal } from './components/HealthRecordModal';
import { ChangePhotoModal } from './components/ChangePhotoModal';

export default function App() {
  const [equipments, setEquipments] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem('gmao_equipments');
    return saved ? JSON.parse(saved) : INITIAL_EQUIPMENTS;
  });

  const [currentEquipment, setCurrentEquipment] = useState<Equipment>(equipments[0]);

  const [interventions, setInterventions] = useState<Intervention[]>(() => {
    const saved = localStorage.getItem('gmao_interventions');
    return saved ? JSON.parse(saved) : INITIAL_INTERVENTIONS;
  });

  const [spareParts, setSpareParts] = useState<SparePart[]>(() => {
    const saved = localStorage.getItem('gmao_spareparts');
    return saved ? JSON.parse(saved) : INITIAL_SPARE_PARTS;
  });

  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>(() => {
    const saved = localStorage.getItem('gmao_schedules');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULES;
  });

  const [documents, setDocuments] = useState<EquipmentDocument[]>(() => {
    const saved = localStorage.getItem('gmao_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('gmao_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [procedures, setProcedures] = useState<MaintenanceProcedure[]>(() => {
    const saved = localStorage.getItem('gmao_procedures');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE_PROCEDURES;
  });

  const [hasDemoData, setHasDemoData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState('intervention');
  const [cardTab, setCardTab] = useState<'interventions' | 'articles' | 'planning' | 'indicators' | 'documents'>('interventions');

  // Modals state
  const [isNewInterventionOpen, setIsNewInterventionOpen] = useState(false);
  const [interventionConfig, setInterventionConfig] = useState<{
    assignedType: 'internal' | 'external';
    title?: string;
    contractorName?: string;
    description?: string;
    type?: InterventionType;
  }>({
    assignedType: 'internal'
  });

  const [isNewDocumentOpen, setIsNewDocumentOpen] = useState(false);
  const [isEditEquipmentOpen, setIsEditEquipmentOpen] = useState(false);
  const [isHealthRecordOpen, setIsHealthRecordOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isChangePhotoOpen, setIsChangePhotoOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('gmao_equipments', JSON.stringify(equipments));
  }, [equipments]);

  useEffect(() => {
    localStorage.setItem('gmao_interventions', JSON.stringify(interventions));
  }, [interventions]);

  useEffect(() => {
    localStorage.setItem('gmao_spareparts', JSON.stringify(spareParts));
  }, [spareParts]);

  useEffect(() => {
    localStorage.setItem('gmao_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('gmao_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('gmao_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('gmao_procedures', JSON.stringify(procedures));
  }, [procedures]);

  // Keep currentEquipment synced
  useEffect(() => {
    const match = equipments.find(e => e.id === currentEquipment.id);
    if (match) setCurrentEquipment(match);
  }, [equipments]);

  // Handle nav change
  const handleNavChange = (nav: string) => {
    setActiveNav(nav);
    if (nav === 'intervention') {
      setCardTab('interventions');
    } else if (nav === 'articles') {
      setCardTab('articles');
    }
  };

  // Handle toggling demo data
  const handleToggleDemoData = () => {
    if (hasDemoData) {
      setInterventions([]);
      setHasDemoData(false);
    } else {
      setInterventions(DEMO_PRELOADED_INTERVENTIONS);
      setHasDemoData(true);
    }
  };

  // Add new intervention
  const handleAddIntervention = (data: Omit<Intervention, 'id' | 'code' | 'createdAt'>) => {
    const newCode = `INT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const newIntervention: Intervention = {
      ...data,
      id: `int-${Date.now()}`,
      code: newCode,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setInterventions(prev => [newIntervention, ...prev]);
  };

  // Update status of intervention
  const handleUpdateInterventionStatus = (id: string, status: 'pending' | 'in_progress' | 'completed') => {
    setInterventions(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status,
          completedDate: status === 'completed' ? new Date().toISOString().split('T')[0] : item.completedDate
        };
      }
      return item;
    }));
  };

  // Delete intervention
  const handleDeleteIntervention = (id: string) => {
    setInterventions(prev => prev.filter(i => i.id !== id));
  };

  // Add spare part
  const handleAddSparePart = (part: Omit<SparePart, 'id'>) => {
    const newPart: SparePart = {
      ...part,
      id: `sp-${Date.now()}`
    };
    setSpareParts(prev => [...prev, newPart]);
  };

  // Update spare part stock
  const handleUpdateStock = (id: string, delta: number) => {
    setSpareParts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, stock: Math.max(0, p.stock + delta) };
      }
      return p;
    }));
  };

  // Add Document
  const handleAddDocument = (doc: Omit<EquipmentDocument, 'id'>) => {
    const newDoc: EquipmentDocument = {
      ...doc,
      id: `doc-${Date.now()}`
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  // Delete Document
  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  // Add Supplier
  const handleAddSupplier = (newSup: Omit<Supplier, 'id'>) => {
    const sup: Supplier = {
      ...newSup,
      id: `sup-${Date.now()}`
    };
    setSuppliers(prev => [...prev, sup]);
  };

  // Add Schedule
  const handleAddSchedule = (newSch: Omit<MaintenanceSchedule, 'id'>) => {
    const sch: MaintenanceSchedule = {
      ...newSch,
      id: `sch-${Date.now()}`
    };
    setSchedules(prev => [...prev, sch]);
  };

  // Update Equipment specs
  const handleUpdateEquipment = (updated: Equipment) => {
    setEquipments(prev => prev.map(e => e.id === updated.id ? updated : e));
    setCurrentEquipment(updated);
  };

  // Update Equipment Photo (terrain capture, file upload or library)
  const handleUpdatePhoto = (newImageUrl: string) => {
    setEquipments(prev => prev.map(e => e.id === currentEquipment.id ? { ...e, imageUrl: newImageUrl } : e));
    setCurrentEquipment(prev => ({ ...prev, imageUrl: newImageUrl }));
  };

  // Trigger intervention from supplier card
  const handleCreateInterventionForSupplier = (supplierName: string) => {
    setInterventionConfig({
      assignedType: 'external',
      contractorName: supplierName,
      title: `Intervention sous-traitance - ${supplierName}`,
      type: 'preventive'
    });
    setIsNewInterventionOpen(true);
  };

  // Trigger intervention from maintenance procedure
  const handleTriggerInterventionForProcedure = (proc: MaintenanceProcedure) => {
    setInterventionConfig({
      assignedType: proc.type === 'regulatory' ? 'external' : 'internal',
      title: `${proc.code} : ${proc.title}`,
      description: `${proc.description}\n\nPoints de contrôle :\n- ${proc.checkpoints.join('\n- ')}`,
      type: proc.type === 'regulatory' ? 'regulatory' : 'preventive',
      contractorName: proc.type === 'regulatory' ? 'APAVE Exploitation & Contrôle' : undefined
    });
    setIsNewInterventionOpen(true);
  };

  // Filter interventions for current equipment
  const currentInterventions = interventions.filter(i => {
    const matchesEq = i.equipmentId === currentEquipment.id;
    if (!matchesEq) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      i.title.toLowerCase().includes(q) ||
      i.code.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.assignee.toLowerCase().includes(q) ||
      (i.contractorName && i.contractorName.toLowerCase().includes(q))
    );
  });

  const currentSpareParts = spareParts.filter(p => p.equipmentId === currentEquipment.id);
  const currentSchedules = schedules.filter(s => s.equipmentId === currentEquipment.id);
  const currentDocs = documents.filter(d => d.equipmentId === currentEquipment.id);

  return (
    <div className="min-h-screen flex flex-col bg-gmao-poly relative font-sans text-slate-800">
      {/* Polygonal overlay matching the crystalline background in the user screenshot */}
      <div className="poly-overlay absolute inset-0 pointer-events-none" />

      {/* Top Header Navigation */}
      <Header
        equipments={equipments}
        currentEquipment={currentEquipment}
        onSelectEquipment={setCurrentEquipment}
        activeNav={activeNav}
        setActiveNav={handleNavChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenHealthRecord={() => setIsHealthRecordOpen(true)}
        onOpenNewIntervention={() => {
          setInterventionConfig({ assignedType: 'internal' });
          setIsNewInterventionOpen(true);
        }}
      />

      {/* Main Container based on active navigation */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 z-10">
        {(activeNav === 'intervention' || activeNav === 'articles') && (
          <EquipmentCard
            equipment={currentEquipment}
            interventions={currentInterventions}
            spareParts={currentSpareParts}
            schedules={currentSchedules}
            documents={currentDocs}
            currentTab={cardTab}
            onTabChange={setCardTab}
            onOpenNewIntervention={(type) => {
              setInterventionConfig({ assignedType: type || 'internal' });
              setIsNewInterventionOpen(true);
            }}
            onOpenNewDocument={() => setIsNewDocumentOpen(true)}
            onOpenEditEquipment={() => setIsEditEquipmentOpen(true)}
            onOpenHealthRecord={() => setIsHealthRecordOpen(true)}
            onOpenPrintModal={() => setIsPrintModalOpen(true)}
            onChangePhoto={() => setIsChangePhotoOpen(true)}
            onUpdateInterventionStatus={handleUpdateInterventionStatus}
            onDeleteIntervention={handleDeleteIntervention}
            onAddSparePart={handleAddSparePart}
            onUpdateStock={handleUpdateStock}
            onDeleteDocument={handleDeleteDocument}
            onToggleDemoData={handleToggleDemoData}
            hasDemoData={hasDemoData}
          />
        )}

        {activeNav === 'fournisseurs' && (
          <SuppliersView
            suppliers={suppliers}
            onAddSupplier={handleAddSupplier}
            onCreateInterventionForSupplier={handleCreateInterventionForSupplier}
            onBackToEquipment={() => handleNavChange('intervention')}
          />
        )}

        {activeNav === 'planning' && (
          <PlanningView
            equipments={equipments}
            currentEquipment={currentEquipment}
            schedules={schedules}
            interventions={interventions}
            onAddSchedule={handleAddSchedule}
            onOpenNewIntervention={(type, title) => {
              setInterventionConfig({
                assignedType: type || 'internal',
                title: title || ''
              });
              setIsNewInterventionOpen(true);
            }}
            onBackToEquipment={() => handleNavChange('intervention')}
            onSelectEquipment={setCurrentEquipment}
          />
        )}

        {activeNav === 'maintenance' && (
          <MaintenanceView
            equipment={currentEquipment}
            procedures={procedures}
            onTriggerInterventionForProcedure={handleTriggerInterventionForProcedure}
            onBackToEquipment={() => handleNavChange('intervention')}
          />
        )}
      </main>

      {/* Footer / Status bar */}
      <footer className="bg-white/80 border-t border-slate-200/80 py-2.5 px-6 text-center text-xs text-slate-500 z-10 flex flex-col sm:flex-row items-center justify-between max-w-7xl w-full mx-auto">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-semibold text-slate-700">Carnet de Santé Équipement</span>
          <span className="text-slate-400">| GMAO Industrielle</span>
        </div>
        <div className="text-[11px] text-slate-500 mt-1 sm:mt-0">
          Gouvernance Maintenance • Conforme Directive 2006/42/CE & DESP 2014/68/UE
        </div>
      </footer>

      {/* Modals */}
      <NewInterventionModal
        isOpen={isNewInterventionOpen}
        onClose={() => setIsNewInterventionOpen(false)}
        equipment={currentEquipment}
        defaultAssignedType={interventionConfig.assignedType}
        defaultTitle={interventionConfig.title}
        defaultContractorName={interventionConfig.contractorName}
        defaultDescription={interventionConfig.description}
        defaultType={interventionConfig.type}
        onSubmit={handleAddIntervention}
      />

      <NewDocumentModal
        isOpen={isNewDocumentOpen}
        onClose={() => setIsNewDocumentOpen(false)}
        equipment={currentEquipment}
        onAddDocument={handleAddDocument}
      />

      <EditEquipmentModal
        isOpen={isEditEquipmentOpen}
        onClose={() => setIsEditEquipmentOpen(false)}
        equipment={currentEquipment}
        onUpdate={handleUpdateEquipment}
      />

      <HealthRecordModal
        isOpen={isHealthRecordOpen}
        onClose={() => setIsHealthRecordOpen(false)}
        equipment={currentEquipment}
        interventions={currentInterventions}
        spareParts={currentSpareParts}
        schedules={currentSchedules}
      />

      <PrintEquipmentModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        equipment={currentEquipment}
        interventions={currentInterventions}
        spareParts={currentSpareParts}
        schedules={currentSchedules}
      />

      <ChangePhotoModal
        isOpen={isChangePhotoOpen}
        onClose={() => setIsChangePhotoOpen(false)}
        equipment={currentEquipment}
        onUpdatePhoto={handleUpdatePhoto}
      />
    </div>
  );
}
