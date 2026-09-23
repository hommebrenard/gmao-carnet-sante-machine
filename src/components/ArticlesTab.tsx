import React, { useState } from 'react';
import { Package, Plus, AlertCircle, CheckCircle, Search } from 'lucide-react';
import { SparePart } from '../types';

interface ArticlesTabProps {
  spareParts: SparePart[];
  onAddSparePart: (part: Omit<SparePart, 'id'>) => void;
  onUpdateStock: (id: string, delta: number) => void;
}

export const ArticlesTab: React.FC<ArticlesTabProps> = ({
  spareParts,
  onAddSparePart,
  onUpdateStock
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [reference, setReference] = useState('');
  const [manufacturer, setManufacturer] = useState('Atlas Copco');
  const [stock, setStock] = useState(1);
  const [minStock, setMinStock] = useState(1);
  const [unit, setUnit] = useState('Pièce');
  const [unitPrice, setUnitPrice] = useState(45);
  const [location, setLocation] = useState('Magasin Central');

  const filteredParts = spareParts.filter(p => 
    p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    p.reference.toLowerCase().includes(filterQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !reference) return;

    onAddSparePart({
      equipmentId: 'cpr-01',
      code: code || `ART-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      reference,
      manufacturer,
      stock: Number(stock),
      minStock: Number(minStock),
      unit,
      unitPrice: Number(unitPrice),
      location
    });

    setName('');
    setCode('');
    setReference('');
    setShowAddForm(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrer un article ou référence..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded focus:outline-none focus:border-sky-500 bg-white"
            />
          </div>
          <span className="text-xs text-slate-500 whitespace-nowrap">
            {filteredParts.length} article(s) lié(s)
          </span>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full sm:w-auto text-xs px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded flex items-center justify-center space-x-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Fermer formulaire' : 'Associer un article'}</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-sky-50/50 p-3.5 rounded border border-sky-200 text-xs space-y-3">
          <h4 className="font-bold text-sky-900">Associer une nouvelle pièce de rechange</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Désignation pièce *</label>
              <input
                type="text"
                required
                placeholder="ex: Filtre séparateur d'huile"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-1.5 border border-slate-300 rounded bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Référence constructeur *</label>
              <input
                type="text"
                required
                placeholder="ex: 1622-0871-00"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="w-full p-1.5 border border-slate-300 rounded bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Emplacement stockage</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-1.5 border border-slate-300 rounded bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Stock initial</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full p-1.5 border border-slate-300 rounded bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Stock minimum d'alerte</label>
              <input
                type="number"
                min="0"
                value={minStock}
                onChange={(e) => setMinStock(Number(e.target.value))}
                className="w-full p-1.5 border border-slate-300 rounded bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Prix unitaire HT (€)</label>
              <input
                type="number"
                step="0.1"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full p-1.5 border border-slate-300 rounded bg-white"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 text-slate-600 hover:text-slate-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded"
            >
              Enregistrer l'article
            </button>
          </div>
        </form>
      )}

      {/* Table of Spare Parts */}
      <div className="overflow-x-auto border border-slate-200 rounded">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
              <th className="py-2.5 px-3 font-semibold">Code</th>
              <th className="py-2.5 px-3 font-semibold">Désignation</th>
              <th className="py-2.5 px-3 font-semibold">Réf. Constructeur</th>
              <th className="py-2.5 px-3 font-semibold">Emplacement</th>
              <th className="py-2.5 px-3 font-semibold text-center">Stock</th>
              <th className="py-2.5 px-3 font-semibold text-right">Prix HT</th>
              <th className="py-2.5 px-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredParts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-slate-400 italic">
                  Aucun article associé trouvé.
                </td>
              </tr>
            ) : (
              filteredParts.map((item) => {
                const isLowStock = item.stock <= item.minStock;
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2 px-3 font-mono font-medium text-slate-600">{item.code}</td>
                    <td className="py-2 px-3 font-medium text-slate-900">
                      <div className="flex items-center space-x-1.5">
                        <Package className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 font-mono text-slate-700">{item.reference}</td>
                    <td className="py-2 px-3 text-slate-600">{item.location}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                        isLowStock 
                          ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {isLowStock ? <AlertCircle className="w-3 h-3 text-amber-600" /> : <CheckCircle className="w-3 h-3 text-emerald-600" />}
                        <span>{item.stock} {item.unit}</span>
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-medium text-slate-800">
                      {item.unitPrice.toFixed(2)} €
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="inline-flex items-center space-x-1">
                        <button
                          onClick={() => onUpdateStock(item.id, -1)}
                          disabled={item.stock <= 0}
                          className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center disabled:opacity-30"
                          title="Consommer une unité"
                        >
                          -
                        </button>
                        <button
                          onClick={() => onUpdateStock(item.id, 1)}
                          className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center"
                          title="Réapprovisionner"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
