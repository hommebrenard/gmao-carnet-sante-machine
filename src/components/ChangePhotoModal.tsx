import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  X, 
  Check, 
  Sparkles,
  Smartphone,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Equipment } from '../types';
import { compressAndResizeImage, INDUSTRIAL_PRESET_IMAGES } from '../utils/imageUtils';

interface ChangePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment;
  onUpdatePhoto: (newImageUrl: string) => void;
}

export const ChangePhotoModal: React.FC<ChangePhotoModalProps> = ({
  isOpen,
  onClose,
  equipment,
  onUpdatePhoto
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery' | 'url'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string>(equipment.imageUrl || '');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Hidden file inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage("Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP).");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Resize & compress to ~1024px and JPEG quality 0.82 to save neatly in localStorage
      const compressedDataUrl = await compressAndResizeImage(file, {
        maxWidth: 1024,
        maxHeight: 768,
        quality: 0.82
      });

      setPreviewUrl(compressedDataUrl);
    } catch (err: any) {
      setErrorMessage(err.message || "Erreur lors du traitement de l'image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleApply = () => {
    if (!previewUrl) return;
    onUpdatePhoto(previewUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#0b1c36] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-400/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide">
                Modifier la photo de l'équipement
              </h3>
              <p className="text-[11px] text-sky-300 font-mono">
                {equipment.tag} — {equipment.name}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2.5 px-3 font-semibold flex items-center justify-center space-x-1.5 transition-colors border-b-2 ${
              activeTab === 'upload' 
                ? 'border-sky-600 text-sky-700 bg-white font-bold' 
                : 'border-transparent text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Photo Terrain / Fichier</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex-1 py-2.5 px-3 font-semibold flex items-center justify-center space-x-1.5 transition-colors border-b-2 ${
              activeTab === 'gallery' 
                ? 'border-sky-600 text-sky-700 bg-white font-bold' 
                : 'border-transparent text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Galerie Industrielle</span>
          </button>

          <button
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2.5 px-3 font-semibold flex items-center justify-center space-x-1.5 transition-colors border-b-2 ${
              activeTab === 'url' 
                ? 'border-sky-600 text-sky-700 bg-white font-bold' 
                : 'border-transparent text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Lien URL</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 text-xs">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-lg flex items-center space-x-2 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: FIELD PHOTO / UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              {/* Hidden file inputs */}
              <input
                type="file"
                ref={cameraInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Action Buttons: Camera + File */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="p-3 rounded-lg border-2 border-dashed border-sky-400 bg-sky-50/70 hover:bg-sky-100 text-sky-900 flex flex-col items-center justify-center text-center space-y-1.5 transition-colors cursor-pointer group"
                >
                  <div className="p-2 rounded-full bg-sky-600 text-white group-hover:scale-105 transition-transform">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xs">Prendre photo sur le terrain</span>
                  <span className="text-[10px] text-sky-700">
                    Ouvre l'appareil photo du smartphone / tablette
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 flex flex-col items-center justify-center text-center space-y-1.5 transition-colors cursor-pointer group"
                >
                  <div className="p-2 rounded-full bg-slate-700 text-white group-hover:scale-105 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xs">Importer un fichier image</span>
                  <span className="text-[10px] text-slate-500">
                    JPG, PNG, WEBP depuis votre ordinateur
                  </span>
                </button>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                  isDragOver 
                    ? 'border-sky-500 bg-sky-50 text-sky-800' 
                    : 'border-slate-200 bg-slate-50/60 text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                <span className="text-[11px] block font-medium">
                  Glissez-déposez une photo ici ou cliquez pour parcourir
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Optimisation et redimensionnement automatiques haute fidélité
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: GALLERY OF PRESETS */}
          {activeTab === 'gallery' && (
            <div className="space-y-3">
              <p className="text-slate-600 text-xs">
                Sélectionnez une photo haute définition correspondant à l'équipement industriel :
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {INDUSTRIAL_PRESET_IMAGES.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => setPreviewUrl(preset.url)}
                    className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                      previewUrl === preset.url 
                        ? 'border-sky-600 shadow-md ring-2 ring-sky-300' 
                        : 'border-slate-200 hover:border-sky-400'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-1.5 bg-white text-[10px]">
                      <div className="font-bold text-slate-900 truncate">{preset.name}</div>
                      <div className="text-slate-500 truncate">{preset.category}</div>
                    </div>
                    {previewUrl === preset.url && (
                      <div className="absolute top-1 right-1 bg-sky-600 text-white rounded-full p-0.5 shadow-sm">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM URL */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Adresse web (URL directe de l'image)
                </label>
                <input
                  type="url"
                  placeholder="https://exemple.fr/photo-compresseur.jpg"
                  value={customUrl}
                  onChange={(e) => {
                    setCustomUrl(e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500 text-xs font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Vous pouvez coller l'URL d'une photo hébergée sur votre intranet d'entreprise, Google Drive (lien direct) ou catalogue constructeur.
              </p>
            </div>
          )}

          {/* Preview Box */}
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-700 text-xs flex items-center space-x-1.5">
                <ImageIcon className="w-4 h-4 text-sky-600" />
                <span>Aperçu du rendu final</span>
              </span>
              {isProcessing && (
                <span className="text-[10px] text-sky-700 flex items-center space-x-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Compression de la photo...</span>
                </span>
              )}
            </div>

            <div className="w-full h-44 bg-white rounded border border-slate-200 flex items-center justify-center overflow-hidden relative">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Aperçu équipement"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center text-slate-400 text-xs">
                  <Camera className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                  <span>Aucune photo sélectionnée</span>
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium"
            >
              Annuler
            </button>

            <button
              type="button"
              disabled={!previewUrl || isProcessing}
              onClick={handleApply}
              className={`px-4 py-1.5 rounded font-bold text-white flex items-center space-x-1.5 shadow-sm transition-all ${
                !previewUrl || isProcessing
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-sky-600 hover:bg-sky-700 cursor-pointer'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Valider cette photo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
