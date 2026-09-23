import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  Wrench,
  Building2,
  ExternalLink,
  X
} from 'lucide-react';
import { Supplier } from '../types';

interface SuppliersViewProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  onCreateInterventionForSupplier: (supplierName: string) => void;
  onBackToEquipment: () => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  onAddSupplier,
  onCreateInterventionForSupplier,
  onBackToEquipment
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Supplier['category']>('contractor');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [contractNumber, setContractNumber] = useState('');
  const [specialtiesText, setSpecialtiesText] = useState('');

  const filteredSuppliers = suppliers.filter(s => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    if (!matchesCat) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.contactPerson.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.specialties.some(sp => sp.toLowerCase().includes(q)) ||
      (s.contractNumber && s.contractNumber.toLowerCase().includes(q))
    );
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    onAddSupplier({
      name,
      category,
      contactPerson,
      phone,
      email,
      address,
      contractNumber: contractNumber || `CTR-${Math.floor(1000 + Math.random() * 9000)}`,
      rating: 5,
      specialties: specialtiesText.split(',').map(s => s.trim()).filter(Boolean),
      activeContract: true,
      equipmentCount: 1,
      interventionsCount: 0
    });

    setIsAddModalOpen(false);
    setName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setAddress('');
    setContractNumber('');
    setSpecialtiesText('');
  };

  const getCategoryLabel = (cat: Supplier['category']) => {
    switch (cat) {
      case 'contractor': return 'Prestataire Maintenance';
      case 'manufacturer': return 'Constructeur Machine';
      case 'spare_parts': return 'Fournisseur Pièces & Fluides';
      case 'inspection_body': return 'Organisme Agréé (Contrôle Réglementaire)';
    }
  };

  const getCategoryBadgeClass = (cat: Supplier['category']) => {
    switch (cat) {
      case 'contractor': return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'manufacturer': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'spare_parts': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'inspection_body': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-sky-900 text-white shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                Fournisseurs, Constructeurs & Sous-traitants
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Gestion des contrats de maintenance, organismes agréés DESP et prestataires techniques
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Fournisseur</span>
          </button>

          <button
            onClick={onBackToEquipment}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <Wrench className="w-4 h-4" />
            <span>Fiche Équipement</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Partenaires</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{suppliers.length}</div>
          <span className="text-[11px] text-sky-600 font-medium">Référencés usine</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Contrats Actifs</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {suppliers.filter(s => s.activeContract).length}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">100% à jour</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Organismes Agréés</span>
          <div className="text-2xl font-black text-indigo-700 mt-1">
            {suppliers.filter(s => s.category === 'inspection_body').length}
          </div>
          <span className="text-[11px] text-indigo-600 font-medium">APAVE / Bureau Veritas</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Délégation OT</span>
          <div className="text-2xl font-black text-slate-800 mt-1">
            {suppliers.reduce((acc, s) => acc + (s.interventionsCount || 0), 0)}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Interventions réalisées</span>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Rechercher par nom, spécialité, contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500 transition-all"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedCategory === 'all' 
                ? 'bg-sky-600 text-white font-bold' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tous ({suppliers.length})
          </button>
          <button
            onClick={() => setSelectedCategory('contractor')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedCategory === 'contractor' 
                ? 'bg-sky-600 text-white font-bold' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Prestataires
          </button>
          <button
            onClick={() => setSelectedCategory('manufacturer')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedCategory === 'manufacturer' 
                ? 'bg-sky-600 text-white font-bold' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Constructeurs
          </button>
          <button
            onClick={() => setSelectedCategory('inspection_body')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedCategory === 'inspection_body' 
                ? 'bg-sky-600 text-white font-bold' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Organismes Agréés
          </button>
          <button
            onClick={() => setSelectedCategory('spare_parts')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedCategory === 'spare_parts' 
                ? 'bg-sky-600 text-white font-bold' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pièces & Fluides
          </button>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSuppliers.map((supplier) => (
          <div 
            key={supplier.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border mb-1.5 ${getCategoryBadgeClass(supplier.category)}`}>
                    {getCategoryLabel(supplier.category)}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <span>{supplier.name}</span>
                  </h3>
                  {supplier.contractNumber && (
                    <span className="text-[11px] font-mono text-slate-500">
                      Contrat : <strong>{supplier.contractNumber}</strong>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1 text-amber-500">
                  {Array.from({ length: supplier.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800">{supplier.contactPerson}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={`tel:${supplier.phone}`} className="text-sky-700 hover:underline font-mono">
                    {supplier.phone}
                  </a>
                </div>

                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={`mailto:${supplier.email}`} className="text-sky-700 hover:underline">
                    {supplier.email}
                  </a>
                </div>

                <div className="flex items-start space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] text-slate-500">{supplier.address}</span>
                </div>
              </div>

              {/* Specialties */}
              <div className="mt-3.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Domaines d'expertise & Habilitations
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {supplier.specialties.map((spec, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-[11px] text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fournisseur agréé</span>
              </div>

              <button
                onClick={() => onCreateInterventionForSupplier(supplier.name)}
                className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors"
              >
                <Wrench className="w-3.5 h-3.5 text-sky-600" />
                <span>Affecter une intervention</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Supplier */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Users className="w-4 h-4 text-sky-600" />
                <span>Ajouter un Fournisseur ou Prestataire</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Raison Sociale / Nom *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Atlas Copco France"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="contractor">Prestataire Maintenance</option>
                    <option value="manufacturer">Constructeur Machine</option>
                    <option value="inspection_body">Organisme Agréé (DESP)</option>
                    <option value="spare_parts">Fournisseur Pièces/Fluides</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">N° Contrat</label>
                  <input
                    type="text"
                    placeholder="ex: CTR-2026-01"
                    value={contractNumber}
                    onChange={(e) => setContractNumber(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Référent</label>
                  <input
                    type="text"
                    placeholder="ex: Jean Dupont"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Téléphone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+33 1 23 45 67 89"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="support@prestataire.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Adresse</label>
                <input
                  type="text"
                  placeholder="Rue, Ville, Code Postal"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Spécialités (séparées par virgules)</label>
                <input
                  type="text"
                  placeholder="Compresseurs à vis, Vidange, Contrôle DESP"
                  value={specialtiesText}
                  onChange={(e) => setSpecialtiesText(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold shadow-sm"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
