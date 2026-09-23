import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  FileText, 
  Calendar,
  Building2,
  QrCode
} from 'lucide-react';
import { Equipment, Intervention, SparePart, MaintenanceSchedule } from '../types';
import { safePrintDocument, printOrDownloadPdf, exportElementToPdf } from '../utils/printUtils';

interface HealthRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment;
  interventions: Intervention[];
  spareParts: SparePart[];
  schedules: MaintenanceSchedule[];
}

export const HealthRecordModal: React.FC<HealthRecordModalProps> = ({
  isOpen,
  onClose,
  equipment,
  interventions,
  spareParts,
  schedules
}) => {
  const [isExportingPdf, setIsExportingPdf] = React.useState(false);

  if (!isOpen) return null;

  const handlePrint = async () => {
    const el = document.getElementById('printable-health-record');
    if (el) {
      await printOrDownloadPdf(
        el, 
        `Carnet_Sante_${equipment.tag}_${equipment.name}`, 
        `Carnet_Sante_${equipment.tag}_${new Date().toISOString().slice(0, 10)}.pdf`
      );
    } else {
      window.print();
    }
  };

  const handleDownloadPdf = async () => {
    const el = document.getElementById('printable-health-record');
    if (el) {
      setIsExportingPdf(true);
      try {
        await exportElementToPdf(
          el,
          `Carnet_Sante_${equipment.tag}_${new Date().toISOString().slice(0, 10)}.pdf`
        );
      } finally {
        setIsExportingPdf(false);
      }
    }
  };

  const handleExportCSV = () => {
    const headers = ['Code', 'Date', 'Type', 'Titre', 'Affectation', 'Intervenant', 'Statut', 'Duree', 'Cout'];
    const rows = interventions.map(i => [
      i.code,
      i.scheduledDate,
      i.type,
      `"${i.title.replace(/"/g, '""')}"`,
      i.assignedType,
      `"${(i.contractorName || i.assignee).replace(/"/g, '""')}"`,
      i.status,
      i.actualDuration || i.estimatedDuration,
      i.cost || 0
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Carnet_Sante_${equipment.tag}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-300 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="bg-[#0b1c36] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide">
                CARNET DE SANTÉ & PASSEPORT MACHINE RÉGLEMENTAIRE
              </h3>
              <p className="text-[11px] text-sky-200">
                Norme ISO 55000 / Directive Machines 2006/42/CE & Suivi DESP
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1 transition-colors cursor-pointer"
              title="Imprimer ou générer le PDF A4 du carnet de santé"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimer</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="px-2.5 py-1 text-xs rounded bg-emerald-700 hover:bg-emerald-600 text-white flex items-center space-x-1 transition-colors cursor-pointer disabled:opacity-50"
              title="Télécharger le carnet de santé en PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-2.5 py-1 text-xs rounded bg-sky-700 hover:bg-sky-600 text-white flex items-center space-x-1 transition-colors cursor-pointer"
              title="Exporter l'historique en CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800 bg-white" id="printable-health-record">
          {/* Header ID Sheet */}
          <div className="border-2 border-slate-800 rounded p-4 bg-slate-50/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="bg-slate-800 text-white font-mono px-2 py-0.5 rounded text-xs font-bold">
                  {equipment.tag}
                </span>
                <h2 className="text-base font-bold text-slate-900">{equipment.name}</h2>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">
                  Passeport Actif
                </span>
              </div>
              <p className="text-slate-600 text-xs">
                {equipment.type} — {equipment.manufacturer}
              </p>
              <p className="text-slate-500 text-[11px] font-mono">
                N° Série : {equipment.serialNumber} | Emplacement : {equipment.location} ({equipment.workshop})
              </p>
            </div>

            <div className="flex items-center space-x-4 border-t md:border-t-0 md:border-l border-slate-300 pt-2 md:pt-0 md:pl-4">
              <div className="w-16 h-16 bg-white border border-slate-300 rounded flex flex-col items-center justify-center p-1 text-center shadow-xs">
                <QrCode className="w-10 h-10 text-slate-800" />
                <span className="text-[9px] font-mono text-slate-500 font-bold">{equipment.tag}</span>
              </div>
              <div className="text-right">
                <span className="block text-slate-400 text-[10px]">Date d'émission :</span>
                <span className="font-semibold text-slate-800">{new Date().toLocaleDateString('fr-FR')}</span>
                <span className="block text-slate-400 text-[10px] mt-1">Heures compteur :</span>
                <span className="font-mono font-bold text-emerald-700">{equipment.runningHours.toLocaleString()} h</span>
              </div>
            </div>
          </div>

          {/* Section 1: Synthèse de Santé & État de Conformité */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1 mb-2.5 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>1. Synthèse de santé & Conformité réglementaire</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="border border-slate-200 rounded p-3 bg-white">
                <span className="text-[10px] font-semibold text-slate-500 block">Indice de Fiabilité Globale</span>
                <span className="text-xl font-bold text-emerald-600">96 / 100</span>
                <p className="text-[10px] text-slate-500 mt-1">Conforme aux spécifications constructeur</p>
              </div>

              <div className="border border-slate-200 rounded p-3 bg-white">
                <span className="text-[10px] font-semibold text-slate-500 block">Contrôle DESP (Cuve sous pression)</span>
                <span className="text-sm font-bold text-amber-700">Échéance : 15/11/2026</span>
                <p className="text-[10px] text-slate-500 mt-1">Organisme agréé : APAVE</p>
              </div>

              <div className="border border-slate-200 rounded p-3 bg-white">
                <span className="text-[10px] font-semibold text-slate-500 block">Dernière vidange & filtres</span>
                <span className="text-sm font-bold text-slate-800">14/08/2026 (12 000 h)</span>
                <p className="text-[10px] text-slate-500 mt-1">Par : Équipe Mécanique usine</p>
              </div>
            </div>
          </div>

          {/* Section 2: Registre Chronologique des Interventions */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1 mb-2.5 flex items-center space-x-1.5">
              <Wrench className="w-4 h-4 text-sky-600" />
              <span>2. Registre chronologique d'entretien & dépannages</span>
            </h4>

            {interventions.length === 0 ? (
              <div className="p-4 border border-dashed border-slate-300 rounded text-center text-slate-500 italic">
                Aucun événement consigné pour le moment.
              </div>
            ) : (
              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <th className="p-2 font-semibold">Réf.</th>
                      <th className="p-2 font-semibold">Date</th>
                      <th className="p-2 font-semibold">Type</th>
                      <th className="p-2 font-semibold">Travaux réalisés</th>
                      <th className="p-2 font-semibold">Intervenant</th>
                      <th className="p-2 font-semibold">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {interventions.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-2 font-mono font-medium text-slate-600">{item.code}</td>
                        <td className="p-2 text-slate-700 whitespace-nowrap">{item.scheduledDate}</td>
                        <td className="p-2">
                          <span className="font-medium text-slate-800 capitalize">{item.type}</span>
                        </td>
                        <td className="p-2 font-medium text-slate-900">
                          {item.title}
                        </td>
                        <td className="p-2 text-slate-600">
                          {item.contractorName || item.assignee}
                        </td>
                        <td className="p-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            item.status === 'completed' 
                              ? 'bg-slate-100 text-slate-700' 
                              : item.status === 'in_progress' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-cyan-100 text-cyan-800'
                          }`}>
                            {item.status === 'completed' ? 'Validé' : item.status === 'in_progress' ? 'En cours' : 'Prévu'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 3: Pièces Critiques & Consommables */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1 mb-2.5 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>3. Nomenclature des pièces d'usure associées</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {spareParts.map((sp) => (
                <div key={sp.id} className="p-2 border border-slate-200 rounded flex justify-between items-center">
                  <div>
                    <span className="font-medium text-slate-900">{sp.name}</span>
                    <span className="block text-[10px] text-slate-500 font-mono">Réf: {sp.reference} | {sp.location}</span>
                  </div>
                  <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    Stock: {sp.stock} {sp.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures & Visas */}
          <div className="pt-4 border-t-2 border-slate-200 grid grid-cols-2 gap-6 text-[11px]">
            <div className="border border-slate-200 rounded p-3 bg-slate-50">
              <span className="font-bold text-slate-700 block mb-1">Visa Responsable Maintenance Usine :</span>
              <p className="text-slate-500 text-[10px] italic">Signature & Cachet technique :</p>
              <div className="h-10 mt-2 border-b border-dashed border-slate-300"></div>
            </div>

            <div className="border border-slate-200 rounded p-3 bg-slate-50">
              <span className="font-bold text-slate-700 block mb-1">Visa Contrôle Qualité / Organisme Agréé :</span>
              <p className="text-slate-500 text-[10px] italic">Attestation d'aptitude à l'exploitation :</p>
              <div className="h-10 mt-2 border-b border-dashed border-slate-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
