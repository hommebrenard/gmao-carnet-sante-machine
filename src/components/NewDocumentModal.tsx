import React, { useState } from 'react';
import { X, FileUp, UploadCloud, Check } from 'lucide-react';
import { EquipmentDocument, Equipment } from '../types';

interface NewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment;
  onAddDocument: (doc: Omit<EquipmentDocument, 'id'>) => void;
}

export const NewDocumentModal: React.FC<NewDocumentModalProps> = ({
  isOpen,
  onClose,
  equipment,
  onAddDocument
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'manual' | 'certificate' | 'diagram' | 'report' | 'procedure'>('report');
  const [size, setSize] = useState('1.5 Mo');
  const [fileType, setFileType] = useState('PDF');
  const [author, setAuthor] = useState('Service Maintenance');
  const [isDragOver, setIsDragOver] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    onAddDocument({
      equipmentId: equipment.id,
      name: name.endsWith('.pdf') ? name : `${name}.pdf`,
      category,
      dateAdded: new Date().toISOString().split('T')[0],
      size,
      fileType,
      author
    });

    onClose();
  };

  const handleSimulatedDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setName(file.name);
      setSize(`${(file.size / (1024 * 1024)).toFixed(1)} Mo`);
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      setFileType(ext);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="bg-[#0b1c36] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileUp className="w-5 h-5 text-sky-400" />
            <h3 className="text-sm font-bold tracking-wide">
              Ajouter un document - {equipment.name}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleSimulatedDrop}
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
              isDragOver ? 'border-sky-500 bg-sky-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
            }`}
          >
            <UploadCloud className="w-8 h-8 text-sky-600 mb-1" />
            <span className="font-semibold text-slate-700">Glissez-déposez votre fichier ici</span>
            <span className="text-[11px] text-slate-400 mt-0.5">PDF, DWG, PNG, JPEG jusqu'à 50 Mo</span>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Nom du document *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Rapport_Controle_Vibratoire_2026.pdf"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
              >
                <option value="report">PV / Rapport d'intervention</option>
                <option value="manual">Notice & Manuel constructeur</option>
                <option value="certificate">Certificat CE / Épreuve</option>
                <option value="diagram">Schéma P&ID / Électrique</option>
                <option value="procedure">Procédure Sécurité / LOTO</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Auteur / Organisme</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-semibold rounded shadow-xs"
            >
              Enregistrer le document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
