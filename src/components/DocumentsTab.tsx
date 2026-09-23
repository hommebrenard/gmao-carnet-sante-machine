import React from 'react';
import { FileText, Download, Eye, FileUp, ShieldCheck, FileSpreadsheet, Trash2 } from 'lucide-react';
import { EquipmentDocument } from '../types';

interface DocumentsTabProps {
  documents: EquipmentDocument[];
  onOpenNewDocument: () => void;
  onDeleteDocument: (id: string) => void;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({
  documents,
  onOpenNewDocument,
  onDeleteDocument
}) => {
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'certificate':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Certificat CE</span>;
      case 'manual':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-100 text-sky-800">Manuel Constructeur</span>;
      case 'diagram':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-800">Schéma P&ID / Élec</span>;
      case 'report':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">PV Réglementaire</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">Procédure</span>;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
            <FileText className="w-4 h-4 text-sky-600" />
            <span>Dossier technique & documents associés</span>
          </h3>
          <p className="text-[11px] text-slate-500">
            Tous les fichiers légaux, schémas techniques, manuels et PV de contrôle réglementaires.
          </p>
        </div>

        <button
          onClick={onOpenNewDocument}
          className="text-xs px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded flex items-center space-x-1 transition-colors"
        >
          <FileUp className="w-3.5 h-3.5" />
          <span>Ajouter un document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {documents.map((doc) => (
          <div 
            key={doc.id}
            className="p-3 bg-white rounded border border-slate-200 hover:border-sky-300 transition-all shadow-2xs flex items-center justify-between"
          >
            <div className="flex items-start space-x-3 overflow-hidden">
              <div className="p-2 rounded bg-sky-50 text-sky-600 border border-sky-100 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate">
                <div className="flex items-center space-x-2">
                  {getCategoryBadge(doc.category)}
                  <span className="text-[10px] text-slate-400 font-mono">{doc.fileType}</span>
                </div>
                <h4 className="text-xs font-medium text-slate-900 mt-1 truncate" title={doc.name}>
                  {doc.name}
                </h4>
                <div className="flex items-center space-x-3 text-[10px] text-slate-400 mt-1">
                  <span>{doc.size}</span>
                  <span>• Ajouté le {doc.dateAdded}</span>
                  <span>• {doc.author}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0 ml-2">
              <button
                onClick={() => alert(`Téléchargement de ${doc.name}`)}
                className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-slate-100 rounded transition-colors"
                title="Consulter / Télécharger"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteDocument(doc.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
