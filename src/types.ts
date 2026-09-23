export type EquipmentStatus = 'operational' | 'warning' | 'stopped' | 'maintenance';

export type InterventionType = 'corrective' | 'preventive' | 'regulatory' | 'improvement';

export type InterventionPriority = 'low' | 'normal' | 'high' | 'critical';

export type InterventionStatus = 'pending' | 'in_progress' | 'completed';

export interface Equipment {
  id: string;
  name: string;
  group: string;
  manufacturer: string;
  type: string;
  serialNumber: string;
  location: string;
  tag: string;
  workshop: string;
  documentation: string;
  commissioningDate: string;
  runningHours: number;
  loadHours: number;
  powerKw: number;
  pressureBar: number;
  status: EquipmentStatus;
  imageUrl: string;
  notes?: string;
  nextRegulatoryDate?: string;
}

export interface Intervention {
  id: string;
  equipmentId: string;
  code: string;
  title: string;
  type: InterventionType;
  priority: InterventionPriority;
  status: InterventionStatus;
  assignedType: 'internal' | 'external';
  assignee: string; // Technicien interne ou Equipe
  contractorName?: string; // Sous-traitant si externe
  createdAt: string;
  scheduledDate: string;
  completedDate?: string;
  durationMinutes: number;
  estimatedDuration: string; // e.g. "02:30"
  actualDuration?: string;
  cost?: number;
  description: string;
  partsUsed?: string[];
  report?: string;
}

export interface SparePart {
  id: string;
  equipmentId: string;
  code: string;
  name: string;
  reference: string;
  manufacturer: string;
  stock: number;
  minStock: number;
  unit: string;
  unitPrice: number;
  location: string;
}

export interface MaintenanceSchedule {
  id: string;
  equipmentId: string;
  title: string;
  frequency: string;
  targetHours?: number;
  lastDoneDate: string;
  nextDueDate: string;
  legalRequirement: boolean;
  status: 'ok' | 'due_soon' | 'overdue';
  assignedTo: string;
}

export interface EquipmentDocument {
  id: string;
  equipmentId: string;
  name: string;
  category: 'manual' | 'certificate' | 'diagram' | 'report' | 'procedure';
  dateAdded: string;
  size: string;
  fileType: string;
  author: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: 'contractor' | 'manufacturer' | 'spare_parts' | 'inspection_body';
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  contractNumber?: string;
  rating: number; // 1 to 5
  specialties: string[];
  activeContract: boolean;
  equipmentCount?: number;
  interventionsCount?: number;
}

export interface MaintenanceProcedure {
  id: string;
  code: string;
  title: string;
  equipmentCategory: string; // e.g. "Compresseurs d'air"
  type: 'preventive' | 'regulatory' | 'predictive';
  frequencyType: 'hours' | 'calendar';
  frequencyLabel: string; // e.g. "500 h", "2000 h", "1 an", "40 mois"
  intervalHours?: number;
  intervalMonths?: number;
  description: string;
  checkpoints: string[];
  estimatedDuration: string;
  requiredParts?: string[];
  safetyInstructions?: string;
  status: 'active' | 'in_review';
}

