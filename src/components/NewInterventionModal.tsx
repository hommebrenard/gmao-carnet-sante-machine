import React, { useState } from 'react';
import { X, Wrench, Calendar, Clock, User, Building2, AlertTriangle } from 'lucide-react';
import { Intervention, Equipment, InterventionType, InterventionPriority } from '../types';

interface NewInterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment;
  defaultAssignedType?: 'internal' | 'external';
  defaultTitle?: string;
  defaultContractorName?: string;
  defaultDescription?: string;
  defaultType?: InterventionType;
  onSubmit: (intervention: Omit<Intervention, 'id' | 'code' | 'createdAt'>) => void;
}

export const NewInterventionModal: React.FC<NewInterventionModalProps> = ({
  isOpen,
  onClose,
  equipment,
  defaultAssignedType = 'internal',
  defaultTitle = '',
  defaultContractorName = 'Atlas Copco Service France',
  defaultDescription = '',
  defaultType = 'preventive',
  onSubmit
}) => {
  const [title, setTitle] = useState(defaultTitle);
  const [type, setType] = useState<InterventionType>(defaultType);
  const [priority, setPriority] = useState<InterventionPriority>('normal');
  const [assignedType, setAssignedType] = useState<'internal' | 'external'>(defaultAssignedType);
  const [assignee, setAssignee] = useState('Équipe Maintenance Mécanique');
  const [contractorName, setContractorName] = useState(defaultContractorName);
  const [scheduledDate, setScheduledDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [estimatedDuration, setEstimatedDuration] = useState('02:00');
  const [cost, setCost] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState(defaultDescription);

  // Sync defaults when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTitle(defaultTitle);
      setType(defaultType);
      setAssignedType(defaultAssignedType);
      if (defaultContractorName) setContractorName(defaultContractorName);
      setDescription(defaultDescription);
    }
  }, [isOpen, defaultTitle, defaultType, defaultAssignedType, defaultContractorName, defaultDescription]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    // Convert estimatedDuration to minutes
    const parts = estimatedDuration.split(':');
    const hours = parseInt(parts[0], 10) || 0;
    const mins = parseInt(parts[1], 10) || 0;
    const totalMinutes = (hours * 60) + mins;

    onSubmit({
      equipmentId: equipment.id,
      title,
      type,
      priority,
      status: 'pending',
      assignedType,
      assignee: assignedType === 'internal' ? assignee : 'Sous-traitant mandaté',
      contractorName: assignedType === 'external' ? contractorName : undefined,
      scheduledDate,
      durationMinutes: totalMinutes,
      estimatedDuration,
      cost: cost ? Number(cost) : undefined,
      description
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-[#0b1c36] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold tracking-wide">
              Demande d'Intervention - {equipment.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Intitulé / Sujet de l'intervention *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Remplacement cartouche séparatrice ou fuite réseau"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-900 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Type d'intervention</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as InterventionType)}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
              >
                <option value="preventive">Préventive systématique</option>
                <option value="corrective">Corrective (Panne / Réparation)</option>
                <option value="regulatory">Contrôle Réglementaire / Sécurité</option>
                <option value="improvement">Amélioration / Optimisation</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Degré de priorité</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as InterventionPriority)}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
              >
                <option value="normal">Normale (Planifiée)</option>
                <option value="high">Haute (Délai court)</option>
                <option value="critical">Critique (Machine à l'arrêt)</option>
                <option value="low">Faible</option>
              </select>
            </div>
          </div>

          {/* Allocation Type: Interne vs Externe */}
          <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-2">
            <span className="block text-slate-700 font-bold">Affectation de l'intervention :</span>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="assignedType"
                  checked={assignedType === 'internal'}
                  onChange={() => setAssignedType('internal')}
                  className="text-sky-600 focus:ring-sky-500"
                />
                <span className="flex items-center space-x-1 text-slate-800 font-medium">
                  <User className="w-3.5 h-3.5 text-sky-600" />
                  <span>Groupe interne (Équipe usine)</span>
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="assignedType"
                  checked={assignedType === 'external'}
                  onChange={() => setAssignedType('external')}
                  className="text-sky-600 focus:ring-sky-500"
                />
                <span className="flex items-center space-x-1 text-slate-800 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Sous-traitant ou tiers</span>
                </span>
              </label>
            </div>

            {assignedType === 'internal' ? (
              <div className="pt-2">
                <label className="block text-slate-600 font-medium mb-1">Équipe / Technicien affecté</label>
                <input
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                />
              </div>
            ) : (
              <div className="pt-2">
                <label className="block text-slate-600 font-medium mb-1">Nom de l'entreprise sous-traitante</label>
                <input
                  type="text"
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                  className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Date souhaitée</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Durée estimée (HH:MM)</label>
              <input
                type="text"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                placeholder="02:00"
                className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Coût estimé HT (€)</label>
              <input
                type="number"
                placeholder="ex: 350"
                value={cost ?? ''}
                onChange={(e) => setCost(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Description détaillée des travaux à réaliser
            </label>
            <textarea
              rows={3}
              placeholder="Préciser les symptômes, pièces de rechange à prévoir, conditions d'arrêt et consignes de sécurité (LOTO)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-[#2ea44f] hover:bg-[#289346] text-white font-semibold shadow-xs transition-colors"
            >
              Créer la demande
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
