import React, { useRef, useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText,
  ShieldCheck, 
  Wrench, 
  Clock, 
  FileCheck,
  Layers,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Equipment, Intervention, SparePart, MaintenanceSchedule } from '../types';
import { exportElementToPdf, printOrDownloadPdf, downloadPrintableFile } from '../utils/printUtils';

interface PrintEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment;
  interventions: Intervention[];
  spareParts: SparePart[];
  schedules: MaintenanceSchedule[];
}

export const PrintEquipmentModal: React.FC<PrintEquipmentModalProps> = ({
  isOpen,
  onClose,
  equipment,
  interventions,
  spareParts,
  schedules
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Print customization toggles
  const [includePhoto, setIncludePhoto] = useState(true);
  const [includeInterventions, setIncludeInterventions] = useState(true);
  const [includeParts, setIncludeParts] = useState(true);
  const [includeSchedules, setIncludeSchedules] = useState(true);
  const [includeSignatures, setIncludeSignatures] = useState(true);

  // Loading & notification states
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusNotification, setStatusNotification] = useState<{
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const baseFileName = `Fiche_Technique_${equipment.tag}_${equipment.name.replace(/\s+/g, '_')}`;

  // Action 1: Print (with auto fallback to high-res PDF if iframe blocks native print)
  const handlePrint = async () => {
    if (!printAreaRef.current) return;
    setIsProcessing(true);
    setStatusNotification({
      type: 'info',
      message: 'Préparation et mise en page du document officiel A4...'
    });

    try {
      const res = await printOrDownloadPdf(
        printAreaRef.current,
        `Fiche_Technique_${equipment.tag}_${equipment.name}`,
        `${baseFileName}.pdf`
      );

      if (res.success) {
        if (res.method === 'pdf') {
          setStatusNotification({
            type: 'success',
            message: "L'impression directe par le navigateur étant restreinte dans ce cadre sécurisé, votre fiche officielle A4 a été générée et téléchargée au format PDF haute résolution prêt à imprimer."
          });
        } else {
          setStatusNotification({
            type: 'success',
            message: "Boîte de dialogue d'impression lancée avec succès !"
          });
        }
      } else {
        setStatusNotification({
          type: 'error',
          message: res.message || "Erreur lors de l'impression."
        });
      }
    } catch (err: any) {
      setStatusNotification({
        type: 'error',
        message: err?.message || "Erreur lors de la génération du document."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Action 2: Direct PDF download
  const handleDownloadPdf = async () => {
    if (!printAreaRef.current) return;
    setIsProcessing(true);
    setStatusNotification({
      type: 'info',
      message: 'Génération du fichier PDF A4 haute résolution en cours...'
    });

    try {
      const res = await exportElementToPdf(
        printAreaRef.current,
        `${baseFileName}.pdf`
      );

      if (res.success) {
        setStatusNotification({
          type: 'success',
          message: 'Le dossier technique A4 a été téléchargé avec succès au format PDF officiel.'
        });
      } else {
        setStatusNotification({
          type: 'error',
          message: res.error || 'Erreur lors de la génération du PDF.'
        });
      }
    } catch (err: any) {
      setStatusNotification({
        type: 'error',
        message: err?.message || 'Erreur lors de la création du fichier PDF.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Action 3: Standalone HTML backup
  const handleDownloadHtml = () => {
    if (!printAreaRef.current) return;
    const content = printAreaRef.current.innerHTML;
    downloadPrintableFile(
      `${baseFileName}.html`,
      `Dossier Technique & Passeport Machine - ${equipment.tag} ${equipment.name}`,
      content
    );
    setStatusNotification({
      type: 'success',
      message: 'Dossier exporté au format HTML autonome stylisé.'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full border border-slate-300 max-h-[96vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Control Bar */}
        <div className="bg-[#0b1c36] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0 rounded-t-xl">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded bg-sky-500/20 text-sky-400 border border-sky-400/30">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-wide flex items-center space-x-2">
                <span>ÉDITION FICHE TECHNIQUE & PASSEPORT MACHINE INDUSTRIEL</span>
              </h3>
              <p className="text-[11px] text-sky-300 font-mono">
                {equipment.tag} — {equipment.name} • Conforme Norme ISO 55001 & Arrêté DESP
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Primary Print Button */}
            <button
              id="btn-print-a4-pdf"
              onClick={handlePrint}
              disabled={isProcessing}
              className={`px-3.5 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer ${
                isProcessing 
                  ? 'bg-sky-800 text-sky-200 cursor-not-allowed' 
                  : 'bg-sky-600 hover:bg-sky-500 text-white'
              }`}
              title="Lancer l'impression ou générer le PDF officiel prêt à imprimer"
            >
              {isProcessing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Printer className="w-4 h-4" />
              )}
              <span>Imprimer (A4 / PDF)</span>
            </button>

            {/* Direct PDF Download Button */}
            <button
              id="btn-download-pdf"
              onClick={handleDownloadPdf}
              disabled={isProcessing}
              className={`px-3.5 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer ${
                isProcessing
                  ? 'bg-emerald-900 text-emerald-200 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
              title="Télécharger directement le document au format PDF standard"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger PDF (A4)</span>
            </button>

            {/* Standalone HTML File Button */}
            <button
              id="btn-download-html"
              onClick={handleDownloadHtml}
              disabled={isProcessing}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
              title="Télécharger une copie HTML autonome avec styles intégrés"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Format HTML</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status notification banner */}
        {statusNotification && (
          <div className={`px-5 py-2.5 text-xs font-medium flex items-center space-x-2 border-b shrink-0 ${
            statusNotification.type === 'success' 
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
              : statusNotification.type === 'error'
              ? 'bg-rose-50 text-rose-900 border-rose-200'
              : 'bg-sky-50 text-sky-900 border-sky-200'
          }`}>
            {statusNotification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {statusNotification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            {statusNotification.type === 'info' && <RefreshCw className="w-4 h-4 text-sky-600 animate-spin shrink-0" />}
            <span className="flex-1">{statusNotification.message}</span>
            <button 
              onClick={() => setStatusNotification(null)}
              className="text-slate-400 hover:text-slate-700 text-sm font-bold px-1"
            >
              ×
            </button>
          </div>
        )}

        {/* Options & Filters Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 py-2.5 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-1 text-slate-500 font-medium">
            <Layers className="w-3.5 h-3.5 text-slate-600 mr-1" />
            <span>Options d'édition :</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-800 font-medium">
              <input
                type="checkbox"
                checked={includePhoto}
                onChange={(e) => setIncludePhoto(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
              <span>Photo de l'équipement</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-800 font-medium">
              <input
                type="checkbox"
                checked={includeSchedules}
                onChange={(e) => setIncludeSchedules(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
              <span>Planning & Préventif</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-800 font-medium">
              <input
                type="checkbox"
                checked={includeInterventions}
                onChange={(e) => setIncludeInterventions(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
              <span>Historique OT</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-800 font-medium">
              <input
                type="checkbox"
                checked={includeParts}
                onChange={(e) => setIncludeParts(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
              <span>Pièces détachées</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-800 font-medium">
              <input
                type="checkbox"
                checked={includeSignatures}
                onChange={(e) => setIncludeSignatures(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500"
              />
              <span>Cadre d'émargement / Visas</span>
            </label>
          </div>
        </div>

        {/* Printable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200/70 flex justify-center items-start">
          <div 
            id="printable-equipment-sheet"
            ref={printAreaRef}
            className="bg-white p-5 sm:p-6 rounded-lg shadow-sm border border-slate-300 w-full max-w-[800px] text-slate-900 space-y-2.5"
            style={{ 
              fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              backgroundColor: '#ffffff',
              margin: '0',
              boxSizing: 'border-box'
            }}
          >
            {/* 1. OFFICIAL INDUSTRIAL PLANT HEADER */}
            <div 
              className="border-b-2 border-slate-900 pb-2 flex flex-row justify-between items-start"
              style={{ borderBottom: '2px solid #0f172a', paddingBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <div>
                <div className="flex items-center space-x-2" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div 
                    className="w-7 h-7 rounded bg-[#0b1c36] text-white flex items-center justify-center font-black text-xs tracking-wider"
                    style={{ width: '28px', height: '28px', borderRadius: '4px', backgroundColor: '#0b1c36', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '10px' }}
                  >
                    GMAO
                  </div>
                  <div>
                    <div 
                      className="text-[9.5px] font-black uppercase tracking-widest text-slate-500"
                      style={{ fontSize: '9.5px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}
                    >
                      DIRECTION INDUSTRIELLE & TECHNIQUE • SERVICE MAINTENANCE
                    </div>
                    <div 
                      className="text-[8.5px] text-slate-400 uppercase tracking-wider font-semibold"
                      style={{ fontSize: '8.5px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}
                    >
                      SITE DE PRODUCTION • ATELIER ÉNERGIE & FLUIDES
                    </div>
                  </div>
                </div>

                <h1 
                  className="text-base font-black text-slate-950 mt-1.5 uppercase tracking-tight"
                  style={{ fontSize: '16px', fontWeight: '900', color: '#020617', marginTop: '6px', textTransform: 'uppercase', letterSpacing: '-0.02em', margin: '6px 0 1px 0' }}
                >
                  FICHE D'IDENTITÉ TECHNIQUE & PASSEPORT MACHINE
                </h1>
                <p 
                  className="text-[9.5px] text-slate-600 font-semibold mt-0.5"
                  style={{ fontSize: '9.5px', color: '#475569', fontWeight: '600', margin: 0 }}
                >
                  Conforme Directive Machines 2006/42/CE & Arrêté Ministériel du 20/11/2017 (ESP)
                </p>
              </div>

              {/* Document Reference Stamp */}
              <div 
                className="text-right border-2 border-slate-900 rounded p-1.5 bg-slate-50 min-w-[140px]"
                style={{ textAlign: 'right', border: '2px solid #0f172a', borderRadius: '4px', padding: '6px 8px', backgroundColor: '#f8fafc', minWidth: '140px' }}
              >
                <div style={{ fontSize: '8.5px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>RÉF. DOCUMENT</div>
                <div style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: '900', color: '#020617' }}>DT-{equipment.tag}</div>
                <div style={{ fontSize: '8.5px', color: '#475569', marginTop: '1px' }}>Indice : <strong>Rev 03</strong></div>
                <div style={{ fontSize: '8.5px', color: '#475569' }}>Édition : <strong>{todayStr}</strong></div>
              </div>
            </div>

            {/* 2. EQUIPMENT PHOTO & IDENTIFICATION BLOCK */}
            <div 
              className="grid grid-cols-12 gap-3 items-stretch"
              style={{ display: 'grid', gridTemplateColumns: includePhoto ? '4.5fr 7.5fr' : '1fr', gap: '12px', alignItems: 'stretch' }}
            >
              {/* Photo Box */}
              {includePhoto && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div 
                    className="border border-slate-300 rounded overflow-hidden bg-slate-50 flex items-center justify-center relative flex-1 min-h-[140px]"
                    style={{ border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f8fafc', position: 'relative', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <img 
                      src={equipment.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80'} 
                      alt={equipment.name}
                      crossOrigin="anonymous"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80';
                      }}
                    />
                    <div 
                      className="absolute top-1.5 left-1.5 bg-slate-900/90 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded"
                      style={{ position: 'absolute', top: '4px', left: '4px', backgroundColor: 'rgba(15, 23, 42, 0.9)', color: '#ffffff', fontFamily: 'monospace', fontWeight: '700', fontSize: '9px', padding: '1px 5px', borderRadius: '3px' }}
                    >
                      TAG : {equipment.tag}
                    </div>
                  </div>
                  <div style={{ fontSize: '8.5px', color: '#64748b', textAlign: 'center', marginTop: '2px', fontStyle: 'italic' }}>
                    Vue terrain équipement en exploitation
                  </div>
                </div>
              )}

              {/* Identity & Technical Specs */}
              <div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                  <tbody>
                    <tr>
                      <th style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '3.5px 6px', width: '35%', textAlign: 'left', color: '#334155', fontWeight: '700' }}>Désignation</th>
                      <td style={{ border: '1px solid #cbd5e1', padding: '3.5px 6px', fontWeight: '700', color: '#020617' }}>{equipment.name}</td>
                    </tr>
                    <tr>
                      <th style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '3.5px 6px', textAlign: 'left', color: '#334155', fontWeight: '700' }}>Constructeur</th>
                      <td style={{ border: '1px solid #cbd5e1', padding: '3.5px 6px', fontWeight: '600', color: '#0f172a' }}>{equipment.manufacturer}</td>
                    </tr>
                    <tr>
                      <th style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '3.5px 6px', textAlign: 'left', color: '#334155', fontWeight: '700' }}>Modèle / Gamme</th>
                      <td style={{ border: '1px solid #cbd5e1', padding: '3.5px 6px', fontWeight: '600', color: '#0f172a' }}>{equipment.type}</td>
                    </tr>
                    <tr>
                      <th style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '3.5px 6px', textAlign: 'left', color: '#334155', fontWeight: '700' }}>Numéro de Série</th>
                      <td style={{ border: '1px solid #cbd5e1', padding: '3.5px 6px', fontFamily: 'monospace', fontWeight: '700', color: '#0c4a6e' }}>{equipment.serialNumber}</td>
                    </tr>
                    <tr>
                      <th style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '3.5px 6px', textAlign: 'left', color: '#334155', fontWeight: '700' }}>Mise en service</th>
                      <td style={{ border: '1px solid #cbd5e1', padding: '3.5px 6px', color: '#0f172a' }}>{equipment.commissioningDate}</td>
                    </tr>
                    <tr>
                      <th style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '3.5px 6px', textAlign: 'left', color: '#334155', fontWeight: '700' }}>Localisation usine</th>
                      <td style={{ border: '1px solid #cbd5e1', padding: '3.5px 6px', fontWeight: '600', color: '#0f172a' }}>{equipment.workshop} • {equipment.location}</td>
                    </tr>
                    <tr>
                      <th style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '3.5px 6px', textAlign: 'left', color: '#334155', fontWeight: '700' }}>Puissance / Pression</th>
                      <td style={{ border: '1px solid #cbd5e1', padding: '3.5px 6px', fontWeight: '600', color: '#0f172a' }}>
                        <strong>{equipment.powerKw} kW</strong> | Consigne : <strong>{equipment.pressureBar} bar</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. KEY METRICS & OPERATING HOURS ROW */}
            <div 
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', textAlign: 'center', fontSize: '10px' }}
            >
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '5px 6px', backgroundColor: '#f8fafc' }}>
                <span style={{ fontSize: '8.5px', textTransform: 'uppercase', fontWeight: '700', color: '#64748b', display: 'block' }}>Compteur Total</span>
                <span style={{ fontFamily: 'monospace', fontWeight: '900', fontSize: '12px', color: '#020617', marginTop: '1px', display: 'block' }}>
                  {equipment.runningHours.toLocaleString()} h
                </span>
              </div>

              <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '5px 6px', backgroundColor: '#f8fafc' }}>
                <span style={{ fontSize: '8.5px', textTransform: 'uppercase', fontWeight: '700', color: '#64748b', display: 'block' }}>Heures en Charge</span>
                <span style={{ fontFamily: 'monospace', fontWeight: '900', fontSize: '12px', color: '#0369a1', marginTop: '1px', display: 'block' }}>
                  {equipment.loadHours.toLocaleString()} h
                </span>
              </div>

              <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '5px 6px', backgroundColor: '#f8fafc' }}>
                <span style={{ fontSize: '8.5px', textTransform: 'uppercase', fontWeight: '700', color: '#64748b', display: 'block' }}>Taux d'Engagement</span>
                <span style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '12px', color: '#15803d', marginTop: '1px', display: 'block' }}>
                  {Math.round((equipment.loadHours / (equipment.runningHours || 1)) * 100)} %
                </span>
              </div>

              <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '5px 6px', backgroundColor: '#f8fafc' }}>
                <span style={{ fontSize: '8.5px', textTransform: 'uppercase', fontWeight: '700', color: '#64748b', display: 'block' }}>Statut Actuel</span>
                <span style={{ fontWeight: '700', fontSize: '10px', textTransform: 'uppercase', color: equipment.status === 'operational' ? '#15803d' : '#b45309', marginTop: '2px', display: 'block' }}>
                  {equipment.status === 'operational' ? '● OPÉRATIONNEL' : equipment.status === 'warning' ? '▲ MAINTENANCE' : '■ ARRÊTÉ'}
                </span>
              </div>
            </div>

            {/* 4. REGULATORY DESP CERTIFICATION BOX */}
            <div 
              style={{ border: '1.5px solid #059669', borderRadius: '5px', backgroundColor: '#ecfdf5', padding: '7px 10px', fontSize: '10px', color: '#064e3b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '4px', borderRadius: '4px', backgroundColor: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck style={{ width: '15px', height: '15px' }} />
                </div>
                <div>
                  <div style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.03em' }}>
                    CONTRÔLE RÉGLEMENTAIRE & SÉCURITÉ DESP (Directive 2014/68/UE)
                  </div>
                  <div style={{ fontSize: '9px', color: '#065f46', marginTop: '1px', lineHeight: '1.3' }}>
                    Équipement sous pression soumis à déclaration périodique. Dernière vérification APAVE validée. Prochaine visite réglementaire obligatoire : <strong>{equipment.nextRegulatoryDate || '2026-11-15'}</strong>.
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right', borderLeft: '1px solid #a7f3d0', paddingLeft: '8px', flexShrink: 0 }}>
                <span style={{ backgroundColor: '#047857', color: '#ffffff', fontWeight: '900', fontSize: '9px', padding: '2px 6px', borderRadius: '3px', display: 'inline-block' }}>
                  CONFORME
                </span>
                <span style={{ fontSize: '8px', color: '#065f46', fontFamily: 'monospace', display: 'block', marginTop: '2px' }}>Visa APAVE #49281</span>
              </div>
            </div>

            {/* 5. PREVENTIVE MAINTENANCE SCHEDULE TABLE */}
            {includeSchedules && (
              <div>
                <div style={{ borderBottom: '1px solid #0f172a', paddingBottom: '3px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '10.5px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock style={{ width: '13px', height: '13px', color: '#334155' }} />
                    <span>PROGRAMME DE MAINTENANCE PRÉVENTIVE & CONTRÔLES</span>
                  </h3>
                  <span style={{ fontSize: '8.5px', color: '#64748b', fontWeight: '600' }}>Périodicités constructeur</span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', color: '#1e293b', textAlign: 'left' }}>
                      <th style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1' }}>Gamme / Opération</th>
                      <th style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', width: '100px' }}>Périodicité</th>
                      <th style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', width: '100px' }}>Dernière exécution</th>
                      <th style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', width: '100px' }}>Prochaine échéance</th>
                      <th style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', width: '130px' }}>Intervenant qualifié</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((sch, idx) => (
                      <tr key={sch.id} style={{ backgroundColor: idx % 2 === 1 ? '#f8fafc' : '#ffffff' }}>
                        <td style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', fontWeight: '700', color: '#0f172a' }}>
                          {sch.title}
                          {sch.legalRequirement && (
                            <span style={{ marginLeft: '4px', fontSize: '7.5px', fontWeight: '700', color: '#4338ca', backgroundColor: '#eef2ff', border: '1px solid #c7d2fe', padding: '1px 3px', borderRadius: '2px' }}>
                              RÉGLEMENTAIRE
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', color: '#334155' }}>{sch.frequency}</td>
                        <td style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', fontFamily: 'monospace', color: '#334155' }}>{sch.lastDoneDate}</td>
                        <td style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontWeight: '700', color: '#0c4a6e' }}>{sch.nextDueDate}</td>
                        <td style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', color: '#334155' }}>{sch.assignedTo}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 6. RECENT INTERVENTIONS / WORK ORDERS */}
            {includeInterventions && (
              <div>
                <div style={{ borderBottom: '1px solid #0f172a', paddingBottom: '3px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '10.5px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FileCheck style={{ width: '13px', height: '13px', color: '#334155' }} />
                    <span>HISTORIQUE DES DERNIÈRES INTERVENTIONS & TRAVAUX</span>
                  </h3>
                  <span style={{ fontSize: '8.5px', color: '#64748b', fontWeight: '600' }}>Traçabilité GMAO</span>
                </div>

                {interventions.length === 0 ? (
                  <div style={{ padding: '8px', textAlign: 'center', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '9px', color: '#64748b', backgroundColor: '#f8fafc' }}>
                    Aucune intervention enregistrée ou historique archivé.
                  </div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', color: '#1e293b', textAlign: 'left' }}>
                        <th style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', width: '80px' }}>N° OT</th>
                        <th style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', width: '80px' }}>Date</th>
                        <th style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1' }}>Nature des Travaux & Diagnostic</th>
                        <th style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', width: '80px' }}>Type</th>
                        <th style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', width: '120px' }}>Intervenant</th>
                        <th style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', width: '70px', textAlign: 'center' }}>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interventions.slice(0, 4).map((intv, idx) => (
                        <tr key={intv.id} style={{ backgroundColor: idx % 2 === 1 ? '#f8fafc' : '#ffffff' }}>
                          <td style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontWeight: '700', color: '#020617' }}>{intv.code}</td>
                          <td style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', fontFamily: 'monospace', color: '#334155' }}>{intv.scheduledDate}</td>
                          <td style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', color: '#0f172a', fontWeight: '500' }}>{intv.title}</td>
                          <td style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', color: '#334155', textTransform: 'capitalize' }}>{intv.type}</td>
                          <td style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', color: '#334155' }}>{intv.contractorName || intv.assignee}</td>
                          <td style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: '700', fontSize: '8.5px' }}>
                            {intv.status === 'completed' ? 'CLÔTURÉ' : intv.status === 'in_progress' ? 'EN COURS' : 'PLANIFIÉ'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* 7. CRITICAL SPARE PARTS & CONSUMABLES */}
            {includeParts && (
              <div>
                <div style={{ borderBottom: '1px solid #0f172a', paddingBottom: '3px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '10.5px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Wrench style={{ width: '13px', height: '13px', color: '#334155' }} />
                    <span>PIÈCES DÉTACHÉES DE SÉCURITÉ & CONSOMMABLES CRITIQUES</span>
                  </h3>
                  <span style={{ fontSize: '8.5px', color: '#64748b', fontWeight: '600' }}>Magasin pièces de rechange</span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', color: '#1e293b', textAlign: 'left' }}>
                      <th style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1' }}>Désignation du composant</th>
                      <th style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', width: '110px' }}>Référence Fabricant</th>
                      <th style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', width: '100px' }}>Emplacement Magasin</th>
                      <th style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', width: '70px', textAlign: 'center' }}>Stock Actuel</th>
                      <th style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', width: '70px', textAlign: 'center' }}>Seuil Mini</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spareParts.slice(0, 4).map((part, idx) => (
                      <tr key={part.id} style={{ backgroundColor: idx % 2 === 1 ? '#f8fafc' : '#ffffff' }}>
                        <td style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', fontWeight: '700', color: '#0f172a' }}>{part.name}</td>
                        <td style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', fontFamily: 'monospace', color: '#334155' }}>{part.reference}</td>
                        <td style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', color: '#334155' }}>{part.location}</td>
                        <td style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: '700', color: '#0f172a' }}>{part.stock}</td>
                        <td style={{ padding: '3.5px 6px', border: '1px solid #cbd5e1', textAlign: 'center', color: '#64748b' }}>{part.minStock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 8. FORMAL AUDIT SIGNATURE BOX */}
            {includeSignatures && (
              <div style={{ paddingTop: '4px' }}>
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '5px', padding: '6px 8px', backgroundColor: '#f8fafc', fontSize: '9.5px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {/* Visa Maintenance */}
                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '5px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '60px' }}>
                      <span style={{ fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', display: 'block', fontSize: '8.5px' }}>Visa Responsable Maintenance</span>
                      <span style={{ fontSize: '7.5px', color: '#94a3b8' }}>Date et signature :</span>
                      <div style={{ borderBottom: '1px dashed #cbd5e1', marginTop: '6px' }}></div>
                    </div>

                    {/* Visa Sécurité / HSE */}
                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '5px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '60px' }}>
                      <span style={{ fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', display: 'block', fontSize: '8.5px' }}>Visa Responsable HSE / Sécurité</span>
                      <span style={{ fontSize: '7.5px', color: '#94a3b8' }}>Date et signature :</span>
                      <div style={{ borderBottom: '1px dashed #cbd5e1', marginTop: '6px' }}></div>
                    </div>

                    {/* Cachet Entreprise */}
                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '5px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '60px' }}>
                      <span style={{ fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', display: 'block', fontSize: '8.5px' }}>Cachet & Visa de Conformité</span>
                      <span style={{ fontSize: '7.5px', color: '#94a3b8' }}>Date : {todayStr}</span>
                      <div style={{ borderBottom: '1px dashed #cbd5e1', marginTop: '6px' }}></div>
                    </div>
                  </div>

                  <p style={{ fontSize: '8px', color: '#64748b', textAlign: 'center', marginTop: '4px', fontStyle: 'italic', margin: '4px 0 0 0' }}>
                    Document officiel certifié conforme extrait du système GMAO usine. Les données d'exploitation et de maintenance sont opposables lors des audits réglementaires DREAL, APAVE et assurances.
                  </p>
                </div>
              </div>
            )}

            {/* Page Footer */}
            <div style={{ fontSize: '8px', color: '#94a3b8', paddingTop: '4px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>GMAO INDUSTRIE 4.0 • CARNET DE SANTÉ MACHINE</span>
              <span style={{ fontFamily: 'monospace' }}>IDENTIFIANT UNIQUE : {equipment.tag}</span>
              <span>DOCUMENT TECHNIQUE CONFORME</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
