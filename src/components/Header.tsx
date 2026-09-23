import React from 'react';
import { 
  Search, 
  Wrench, 
  Package, 
  Users, 
  Calendar, 
  ClipboardList, 
  FileText, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { Equipment } from '../types';

interface HeaderProps {
  equipments: Equipment[];
  currentEquipment: Equipment;
  onSelectEquipment: (eq: Equipment) => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenHealthRecord: () => void;
  onOpenNewIntervention: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  equipments,
  currentEquipment,
  onSelectEquipment,
  activeNav,
  setActiveNav,
  searchQuery,
  setSearchQuery,
  onOpenHealthRecord
}) => {
  return (
    <header id="app-header" className="bg-[#0b1c36] text-white shadow-md select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand & Main Navigation links */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            <div className="flex items-center space-x-2 mr-2">
              <div className="w-8 h-8 rounded bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm tracking-wide text-sky-100 hidden sm:inline">
                GMAO <span className="text-sky-400 font-light text-xs">SANTÉ ÉQUIPEMENT</span>
              </span>
            </div>

            <nav className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
              <button
                id="nav-intervention"
                onClick={() => setActiveNav('intervention')}
                className={`px-3 py-1.5 rounded transition-colors flex items-center space-x-1.5 ${
                  activeNav === 'intervention' 
                    ? 'bg-sky-600/90 text-white font-semibold' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Intervention</span>
              </button>

              <button
                id="nav-articles"
                onClick={() => setActiveNav('articles')}
                className={`px-3 py-1.5 rounded transition-colors flex items-center space-x-1.5 ${
                  activeNav === 'articles' 
                    ? 'bg-sky-600/90 text-white font-semibold' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Articles</span>
              </button>

              <button
                id="nav-fournisseurs"
                onClick={() => setActiveNav('fournisseurs')}
                className={`px-3 py-1.5 rounded transition-colors flex items-center space-x-1.5 ${
                  activeNav === 'fournisseurs' 
                    ? 'bg-sky-600/90 text-white font-semibold' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Fournisseurs</span>
              </button>

              <button
                id="nav-planning"
                onClick={() => setActiveNav('planning')}
                className={`px-3 py-1.5 rounded transition-colors flex items-center space-x-1.5 ${
                  activeNav === 'planning' 
                    ? 'bg-sky-600/90 text-white font-semibold' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Planning</span>
              </button>

              <button
                id="nav-maintenance"
                onClick={() => setActiveNav('maintenance')}
                className={`px-3 py-1.5 rounded transition-colors flex items-center space-x-1.5 ${
                  activeNav === 'maintenance' 
                    ? 'bg-sky-600/90 text-white font-semibold' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Maintenance</span>
              </button>
            </nav>
          </div>

          {/* Right Action & Search Area */}
          <div className="flex items-center space-x-3">
            {/* Quick Equipment Selector Dropdown */}
            <div className="relative hidden md:block">
              <select
                id="equipment-selector"
                value={currentEquipment.id}
                onChange={(e) => {
                  const found = equipments.find(item => item.id === e.target.value);
                  if (found) onSelectEquipment(found);
                }}
                className="bg-[#142848] border border-sky-800/60 rounded text-xs text-sky-100 py-1.5 pl-2.5 pr-7 focus:outline-none focus:ring-1 focus:ring-sky-400 cursor-pointer appearance-none"
              >
                {equipments.map(eq => (
                  <option key={eq.id} value={eq.id}>
                    {eq.tag} - {eq.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-sky-400 absolute right-2 top-2 pointer-events-none" />
            </div>

            {/* Carnet de Santé Official Passport Button */}
            <button
              id="btn-carnet-sante"
              onClick={onOpenHealthRecord}
              className="px-2.5 py-1 text-xs font-medium rounded bg-emerald-700/80 hover:bg-emerald-600 border border-emerald-500/50 text-white flex items-center space-x-1.5 transition-all shadow-sm"
              title="Consulter le Carnet de Santé officiel et le Passeport réglementaire de cet équipement"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden lg:inline">Carnet de santé</span>
            </button>

            {/* Search Input Box */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                id="header-search-input"
                type="text"
                placeholder="Recherche..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-28 sm:w-44 lg:w-56 bg-[#162d52] text-xs text-white placeholder-slate-400 pl-8 pr-2.5 py-1.5 rounded border border-sky-900 focus:outline-none focus:border-sky-400 transition-all"
              />
            </div>

            {/* User Profile Badge */}
            <div className="flex items-center space-x-2 pl-1 border-l border-slate-700/60">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                AD
              </div>
              <span className="text-xs font-semibold text-slate-200 hidden xl:inline">ADMIN</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
