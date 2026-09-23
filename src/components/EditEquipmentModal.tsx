import React, { useState, useRef } from 'react';
import { X, FileText, Check, Settings2, Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { Equipment, EquipmentStatus } from '../types';
import { compressAndResizeImage } from '../utils/imageUtils';

interface EditEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment;
  onUpdate: (updated: Equipment) => void;
}

export const EditEquipmentModal: React.FC<EditEquipmentModalProps> = ({
  isOpen,
  onClose,
  equipment,
  onUpdate
}) => {
  const [formData, setFormData] = useState<Equipment>({ ...equipment });
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  const handleChange = (field: keyof Equipment, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setIsProcessingPhoto(true);
    try {
      const dataUrl = await compressAndResizeImage(file, { maxWidth: 1024, maxHeight: 768, quality: 0.82 });
      handleChange('imageUrl', dataUrl);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#0b1c36] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings2 className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-bold tracking-wide">
              Fiche d'Identité & Caractéristiques - {equipment.name}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Nom de l'équipement</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-teal-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tag / Identifiant Usine</label>
              <input
                type="text"
                required
                value={formData.tag}
                onChange={(e) => handleChange('tag', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded font-mono focus:ring-1 focus:ring-teal-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Groupe technique</label>
              <input
                type="text"
                value={formData.group}
                onChange={(e) => handleChange('group', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Constructeur</label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => handleChange('manufacturer', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Type / Modèle</label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Numéro de série constructeur</label>
              <input
                type="text"
                value={formData.serialNumber}
                onChange={(e) => handleChange('serialNumber', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Secteur / Emplacement physique</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Atelier / Zone</label>
              <input
                type="text"
                value={formData.workshop}
                onChange={(e) => handleChange('workshop', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-100">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Statut opérationnel</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as EquipmentStatus)}
                className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
              >
                <option value="operational">🟢 Opérationnel</option>
                <option value="warning">🟡 Maintenance requise</option>
                <option value="stopped">🔴 Arrêt technique</option>
                <option value="maintenance">🔵 En révision</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Puissance nominale (kW)</label>
              <input
                type="number"
                value={formData.powerKw}
                onChange={(e) => handleChange('powerKw', Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Pression consigne (bar)</label>
              <input
                type="number"
                step="0.1"
                value={formData.pressureBar}
                onChange={(e) => handleChange('pressureBar', Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Heures totales de marche (h)</label>
              <input
                type="number"
                value={formData.runningHours}
                onChange={(e) => handleChange('runningHours', Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Date de mise en service</label>
              <input
                type="date"
                value={formData.commissioningDate}
                onChange={(e) => handleChange('commissioningDate', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Protocole & Documentation requise</label>
            <input
              type="text"
              value={formData.documentation}
              onChange={(e) => handleChange('documentation', e.target.value)}
              className="w-full p-2 border border-slate-300 rounded text-xs"
            />
          </div>

          {/* Photo Management Section */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-slate-700 font-semibold mb-1 flex items-center space-x-1.5">
              <Camera className="w-4 h-4 text-teal-600" />
              <span>Photo de l'équipement (Terrain ou Fichier)</span>
            </label>

            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              onChange={(e) => e.target.files?.[0] && handlePhotoFile(e.target.files[0])}
              className="hidden"
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handlePhotoFile(e.target.files[0])}
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Photo Preview Thumbnail */}
              <div className="w-24 h-20 bg-slate-100 border border-slate-200 rounded overflow-hidden shrink-0 flex items-center justify-center relative">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Aperçu" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
                {isProcessingPhoto && (
                  <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center text-white text-[10px]">
                    ...
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="space-y-1.5 flex-1 w-full">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Prendre photo terrain</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded text-xs font-medium flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choisir fichier</span>
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Ou saisissez une URL d'image directe"
                  value={formData.imageUrl || ''}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  className="w-full p-1.5 border border-slate-200 rounded text-[11px] font-mono text-slate-600"
                />
              </div>
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
              className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded shadow-xs"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
