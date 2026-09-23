import { Equipment, Intervention, SparePart, MaintenanceSchedule, EquipmentDocument, Supplier, MaintenanceProcedure } from '../types';

export const INITIAL_EQUIPMENTS: Equipment[] = [
  {
    id: 'cpr-01',
    name: 'Compresseur 1',
    group: 'Énergies > Compresseurs',
    manufacturer: 'Atlas Copco Airpower',
    type: 'Compresseur à vis lubrifiée GA 37 VSD',
    serialNumber: 'SN-4820194-BE',
    location: 'Bâtiment B - Salle des Énergies',
    tag: 'CPR-01',
    workshop: 'Atelier Nord',
    documentation: 'Personnalisée & protocole obligatoire disponible',
    commissioningDate: '2020-04-15',
    runningHours: 12450,
    loadHours: 9820,
    powerKw: 37,
    pressureBar: 8.5,
    status: 'operational',
    imageUrl: '/assets/images/compressor.jpg',
    notes: 'Compresseur principal de distribution réseau 7.5 bars usine. Révision annuelle sous contrat constructeur.',
    nextRegulatoryDate: '2026-11-15'
  },
  {
    id: 'cpr-02',
    name: 'Compresseur 2 (Secours)',
    group: 'Énergies > Compresseurs',
    manufacturer: 'Kaeser Kompressoren',
    type: 'Compresseur à vis CSD 105 SFC',
    serialNumber: 'KS-992104-DE',
    location: 'Bâtiment B - Salle des Énergies',
    tag: 'CPR-02',
    workshop: 'Atelier Nord',
    documentation: 'Notice technique & plan de graissage',
    commissioningDate: '2022-01-10',
    runningHours: 4620,
    loadHours: 2110,
    powerKw: 55,
    pressureBar: 10.0,
    status: 'warning',
    imageUrl: '/assets/images/compressor.jpg',
    notes: 'Compresseur en réserve redondante. Vidange à prévoir prochainement.',
    nextRegulatoryDate: '2027-02-01'
  },
  {
    id: 'gf-01',
    name: 'Groupe Froid Chiller 1',
    group: 'Climatisation & Froid Industriel',
    manufacturer: 'Carrier Transicold',
    type: 'Refroidisseur d’eau AquaSnap 30RB',
    serialNumber: 'CAR-77391-FR',
    location: 'Toiture technique Bâtiment A',
    tag: 'GF-01',
    workshop: 'Centrale Froid',
    documentation: 'Registre des fluides frigorigènes (F-Gaz) à jour',
    commissioningDate: '2019-06-20',
    runningHours: 18900,
    loadHours: 15400,
    powerKw: 90,
    pressureBar: 4.2,
    status: 'operational',
    imageUrl: '/assets/images/compressor.jpg',
    notes: 'Contrôle étanchéité réglementaire semestriel obligatoire.',
    nextRegulatoryDate: '2026-10-30'
  }
];

export const INITIAL_INTERVENTIONS: Intervention[] = [
  // Compresseur 1 initial state has 0 or can have some historical completed ones, 
  // and user can toggle or create new ones
];

export const DEMO_PRELOADED_INTERVENTIONS: Intervention[] = [
  {
    id: 'int-001',
    equipmentId: 'cpr-01',
    code: 'INT-2026-042',
    title: 'Remplacement kit cartouche séparatrice et préfiltres 8000h',
    type: 'preventive',
    priority: 'normal',
    status: 'completed',
    assignedType: 'internal',
    assignee: 'Équipe Maintenance Mécanique (Jean D.)',
    createdAt: '2026-08-10',
    scheduledDate: '2026-08-14',
    completedDate: '2026-08-14',
    durationMinutes: 150,
    estimatedDuration: '02:30',
    actualDuration: '02:15',
    cost: 420,
    description: 'Changement préventif des cartouches filtrantes selon prescription 8000h constructeur.',
    partsUsed: ['Filtre à air Réf. 1621-0094-00', 'Cartouche séparatrice d’huile Réf. 1622-0871-00'],
    report: 'Remplacement effectué avec succès. Contrôle des pressions différentielles conforme.'
  },
  {
    id: 'int-002',
    equipmentId: 'cpr-01',
    code: 'INT-2026-089',
    title: 'Audit annuel acoustique & contrôle vibratoire paliers',
    type: 'regulatory',
    priority: 'low',
    status: 'completed',
    assignedType: 'external',
    assignee: 'Sous-traitant expert',
    contractorName: 'Atlas Copco Service France',
    createdAt: '2026-06-02',
    scheduledDate: '2026-06-15',
    completedDate: '2026-06-15',
    durationMinutes: 240,
    estimatedDuration: '04:00',
    actualDuration: '03:45',
    cost: 1150,
    description: 'Analyse spectrale vibratoire du groupe moteur-vis et contrôle serrage accouplements.',
    report: 'Spectre vibratoire dans les tolérances classe ISO 10816-3. Prochain contrôle dans 1 an.'
  }
];

export const INITIAL_SPARE_PARTS: SparePart[] = [
  {
    id: 'art-01',
    equipmentId: 'cpr-01',
    code: 'ART-FIL-01',
    name: 'Filtre d’aspiration d’air haute efficacité',
    reference: '1621-0094-00',
    manufacturer: 'Atlas Copco',
    stock: 4,
    minStock: 2,
    unit: 'Pièce',
    unitPrice: 85.50,
    location: 'Magasin Central - Travée C-12'
  },
  {
    id: 'art-02',
    equipmentId: 'cpr-01',
    code: 'ART-SEP-02',
    name: 'Cartouche séparatrice d’huile 8000h',
    reference: '1622-0871-00',
    manufacturer: 'Atlas Copco',
    stock: 2,
    minStock: 1,
    unit: 'Pièce',
    unitPrice: 240.00,
    location: 'Magasin Central - Travée C-14'
  },
  {
    id: 'art-03',
    equipmentId: 'cpr-01',
    code: 'ART-HUI-03',
    name: 'Huile synthétique Roto-Inject Fluid (Bidon 20L)',
    reference: '2901-0522-00',
    manufacturer: 'Atlas Copco',
    stock: 60,
    minStock: 40,
    unit: 'Litres',
    unitPrice: 18.20,
    location: 'Armoire Produits Chimiques / Huiles'
  },
  {
    id: 'art-04',
    equipmentId: 'cpr-01',
    code: 'ART-KSO-04',
    name: 'Kit maintenance soupape de décharge minimale',
    reference: '2901-1399-00',
    manufacturer: 'Atlas Copco',
    stock: 1,
    minStock: 1,
    unit: 'Kit',
    unitPrice: 310.00,
    location: 'Magasin Central - Travée C-15'
  },
  {
    id: 'art-05',
    equipmentId: 'cpr-01',
    code: 'ART-CRS-05',
    name: 'Courroie trapézoïdale renforcée Optibelt',
    reference: 'OPT-XPZ-1400',
    manufacturer: 'Optibelt',
    stock: 3,
    minStock: 2,
    unit: 'Pièce',
    unitPrice: 42.00,
    location: 'Magasin Central - Travée B-08'
  }
];

export const INITIAL_SCHEDULES: MaintenanceSchedule[] = [
  {
    id: 'sch-01',
    equipmentId: 'cpr-01',
    title: 'Contrôle périodique de niveau d’huile & purge des condensats',
    frequency: 'Hebdomadaire (50 h)',
    lastDoneDate: '2026-09-18',
    nextDueDate: '2026-09-25',
    legalRequirement: false,
    status: 'ok',
    assignedTo: 'Opérateur de quart / Maintenance 1er niveau'
  },
  {
    id: 'sch-02',
    equipmentId: 'cpr-01',
    title: 'Révision intermédiaire 4 000 heures (Filtre à air & Huile)',
    frequency: '4 000 h / 12 mois',
    targetHours: 16000,
    lastDoneDate: '2026-03-12',
    nextDueDate: '2026-11-15',
    legalRequirement: false,
    status: 'ok',
    assignedTo: 'Maintenance interne'
  },
  {
    id: 'sch-03',
    equipmentId: 'cpr-01',
    title: 'Inspection réglementaire réservoir sous pression (DESP)',
    frequency: '40 mois (Réglementaire APAVE / Bureau Veritas)',
    lastDoneDate: '2023-05-10',
    nextDueDate: '2026-11-15',
    legalRequirement: true,
    status: 'due_soon',
    assignedTo: 'Organisme de contrôle agréé'
  },
  {
    id: 'sch-04',
    equipmentId: 'cpr-01',
    title: 'Grande révision 8 000 heures (Séparateur, Soupapes & Échangeur)',
    frequency: '8 000 h / 24 mois',
    targetHours: 20000,
    lastDoneDate: '2025-04-18',
    nextDueDate: '2027-04-18',
    legalRequirement: false,
    status: 'ok',
    assignedTo: 'Constructeur Atlas Copco'
  }
];

export const INITIAL_DOCUMENTS: EquipmentDocument[] = [
  {
    id: 'doc-01',
    equipmentId: 'cpr-01',
    name: 'Manuel_Utilisateur_Entretien_GA37_AtlasCopco.pdf',
    category: 'manual',
    dateAdded: '2020-04-15',
    size: '14.2 Mo',
    fileType: 'PDF',
    author: 'Service Méthodes'
  },
  {
    id: 'doc-02',
    equipmentId: 'cpr-01',
    name: 'Certificat_Conformite_CE_Directive_Machines.pdf',
    category: 'certificate',
    dateAdded: '2020-04-15',
    size: '1.1 Mo',
    fileType: 'PDF',
    author: 'Bureau Contrôle Qualité'
  },
  {
    id: 'doc-03',
    equipmentId: 'cpr-01',
    name: 'Schema_Electrique_Et_P_and_ID_GA37.dwg',
    category: 'diagram',
    dateAdded: '2020-05-02',
    size: '8.7 Mo',
    fileType: 'DWG / PDF',
    author: 'Bureau d’études Électrique'
  },
  {
    id: 'doc-04',
    equipmentId: 'cpr-01',
    name: 'PV_Epreuve_Cuve_Sous_Pression_DESP_2023.pdf',
    category: 'report',
    dateAdded: '2023-05-12',
    size: '2.4 Mo',
    fileType: 'PDF',
    author: 'APAVE Organisme Agréé'
  },
  {
    id: 'doc-05',
    equipmentId: 'cpr-01',
    name: 'Procedure_Consignation_LOTO_Compresseur.pdf',
    category: 'procedure',
    dateAdded: '2024-01-18',
    size: '950 Ko',
    fileType: 'PDF',
    author: 'Responsable HSE'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-01',
    name: 'Atlas Copco Service France',
    category: 'contractor',
    contactPerson: 'Éric Levêque (Chargé de contrat)',
    phone: '+33 1 39 09 30 00',
    email: 'service.france@atlascopco.com',
    address: 'Z.I. des Béthunes, 95310 Saint-Ouen-l\'Aumône',
    contractNumber: 'CTR-AC-2024-88',
    rating: 5,
    specialties: ['Compresseurs à vis', 'Sécheurs d\'air', 'Contrats d\'entretien 8000h', 'Audit énergétique air comprimé'],
    activeContract: true,
    equipmentCount: 2,
    interventionsCount: 6
  },
  {
    id: 'sup-02',
    name: 'APAVE Exploitation & Contrôle',
    category: 'inspection_body',
    contactPerson: 'Marc Delorme (Inspecteur Agréé DESP)',
    phone: '+33 2 40 18 25 00',
    email: 'contact.industrie@apave.com',
    address: '191 Rue de Vaugirard, 75015 Paris',
    contractNumber: 'REG-APV-2023-01',
    rating: 5,
    specialties: ['Équipements sous pression (DESP)', 'Contrôles réglementaires annuels', 'Soupapes de sécurité', 'Épreuves hydrauliques'],
    activeContract: true,
    equipmentCount: 3,
    interventionsCount: 4
  },
  {
    id: 'sup-03',
    name: 'Kaeser Compresseurs SAS',
    category: 'manufacturer',
    contactPerson: 'Stéphane Bernard (Technico-commercial)',
    phone: '+33 4 72 23 45 67',
    email: 'service.france@kaeser.com',
    address: 'Parc d\'Activités de Chesnes, 38070 Saint-Quentin-Fallavier',
    contractNumber: 'CTR-KS-2025-14',
    rating: 4,
    specialties: ['Compresseurs à vis SFC', 'Traitement air comprimé', 'Kits pièces d\'origine'],
    activeContract: true,
    equipmentCount: 1,
    interventionsCount: 2
  },
  {
    id: 'sup-04',
    name: 'TotalEnergies Lubrifiants Industriels',
    category: 'spare_parts',
    contactPerson: 'Corinne Masson',
    phone: '+33 1 41 35 40 00',
    email: 'lub.industrie@totalenergies.com',
    address: '24 Cours Michelet, 92800 Puteaux',
    contractNumber: 'ACH-TOT-2026-90',
    rating: 5,
    specialties: ['Huiles synthétiques compresseurs', 'Fluides frigorigènes', 'Graisses industrielles haute température'],
    activeContract: true,
    equipmentCount: 3,
    interventionsCount: 0
  },
  {
    id: 'sup-05',
    name: 'Carrier Transicold & Service Réfrigération',
    category: 'contractor',
    contactPerson: 'David Roche (Chef d\'agence froid)',
    phone: '+33 4 72 45 10 10',
    email: 'hvac.service@carrier.com',
    address: 'Route de Thil, 01120 Montluel',
    contractNumber: 'CTR-CAR-2024-52',
    rating: 4,
    specialties: ['Groupes froid AquaSnap', 'Attestation F-Gaz', 'Recherche de fuite fluide frigorigène', 'Compresseurs frigorifiques'],
    activeContract: true,
    equipmentCount: 1,
    interventionsCount: 3
  }
];

export const INITIAL_MAINTENANCE_PROCEDURES: MaintenanceProcedure[] = [
  {
    id: 'proc-01',
    code: 'GMP-CPR-500H',
    title: 'Gamme 500h / Hebdo : Contrôle niveaux, étanchéité & purge condensats',
    equipmentCategory: 'Compresseurs d\'air',
    type: 'preventive',
    frequencyType: 'hours',
    frequencyLabel: '500 h (ou Hebdomadaire)',
    intervalHours: 500,
    intervalMonths: 1,
    description: 'Vérification de premier niveau du bon fonctionnement mécanique, thermique et des purges automatiques.',
    checkpoints: [
      'Contrôle visuel du niveau d\'huile sur le voyant en charge',
      'Vérification du fonctionnement de la purge automatique des condensats',
      'Contrôle de la température de refoulement (norme: 75°C - 90°C)',
      'Contrôle de la pression de service réseau et delta P préfiltres',
      'Dépoussiérage externe des grilles d\'aspiration et du radiateur'
    ],
    estimatedDuration: '00:30',
    requiredParts: ['Chiffons industriels', 'Huile d\'appoint Roto-Inject si besoin'],
    safetyInstructions: 'Port des gants, lunettes et protection auditive. Attention aux surfaces chaudes.',
    status: 'active'
  },
  {
    id: 'proc-02',
    code: 'GMP-CPR-2000H',
    title: 'Gamme 2 000h : Remplacement préfiltre & analyse d\'huile',
    equipmentCategory: 'Compresseurs d\'air',
    type: 'preventive',
    frequencyType: 'hours',
    frequencyLabel: '2 000 h (ou 6 mois)',
    intervalHours: 2000,
    intervalMonths: 6,
    description: 'Maintenance intermédiaire pour préserver le bloc vis et l\'échangeur huile/air.',
    checkpoints: [
      'Remplacement du filtre d\'aspiration d\'air (Réf. 1621-0094-00)',
      'Prélèvement d\'échantillon d\'huile pour analyse physico-chimique en laboratoire',
      'Contrôle et resserrage des connexions électriques de puissance',
      'Nettoyage à l\'air comprimé de l\'échangeur thermique air/huile',
      'Contrôle tension des courroies ou accouplement élastique'
    ],
    estimatedDuration: '01:30',
    requiredParts: ['Filtre à air haute efficacité', 'Kit flacon de prélèvement d\'huile'],
    safetyInstructions: 'Consignation électrique LOTO obligatoire avant ouverture des capots.',
    status: 'active'
  },
  {
    id: 'proc-03',
    code: 'GMP-CPR-4000H',
    title: 'Gamme 4 000h : Vidange complète huile & filtre à huile',
    equipmentCategory: 'Compresseurs d\'air',
    type: 'preventive',
    frequencyType: 'hours',
    frequencyLabel: '4 000 h (ou Annuelle)',
    intervalHours: 4000,
    intervalMonths: 12,
    description: 'Régénération complète de la lubrification et du circuit de refroidissement.',
    checkpoints: [
      'Vidange complète du circuit d\'huile à chaud',
      'Remplacement de la cartouche filtre à huile',
      'Remplissage avec huile neuve homologuée Roto-Inject Fluid',
      'Nettoyage du clapet anti-retour et de la ligne de récupération d\'huile',
      'Test de déclenchement arrêt d\'urgence et sécurités thermiques',
      'Mise à jour du compteur horaire et réinitialisation de l\'alerte sur pupitre'
    ],
    estimatedDuration: '02:30',
    requiredParts: ['Bidon 20L Huile Roto-Inject', 'Filtre à huile', 'Joints de bouchon de vidange'],
    safetyInstructions: 'Consignation fluidique et électrique. Récupération des huiles usagées en bac étanche.',
    status: 'active'
  },
  {
    id: 'proc-04',
    code: 'GMP-CPR-8000H',
    title: 'Gamme 8 000h : Grande révision & cartouche séparatrice',
    equipmentCategory: 'Compresseurs d\'air',
    type: 'preventive',
    frequencyType: 'hours',
    frequencyLabel: '8 000 h (ou 24 mois)',
    intervalHours: 8000,
    intervalMonths: 24,
    description: 'Révision majeure avec changement de la cartouche séparatrice air/huile et réfection des soupapes.',
    checkpoints: [
      'Remplacement de la cartouche séparatrice d\'huile (Réf. 1622-0871-00)',
      'Réfection du kit clapet de pression minimale (soupape MPV)',
      'Réfection du clapet thermostatique de régulation température huile',
      'Graissage des roulements moteur électrique (graisse haute température)',
      'Contrôle vibratoire spectral classe ISO 10816-3'
    ],
    estimatedDuration: '04:00',
    requiredParts: ['Cartouche séparatrice d\'huile', 'Kit clapet MPV', 'Kit thermostat', 'Filtres air & huile'],
    safetyInstructions: 'Opération réalisée par personnel certifié ou constructeur. Dépressurisation totale du réservoir.',
    status: 'active'
  },
  {
    id: 'proc-05',
    code: 'REG-DESP-40M',
    title: 'Contrôle Réglementaire DESP : Réservoir sous pression & Soupape',
    equipmentCategory: 'Équipements sous pression',
    type: 'regulatory',
    frequencyType: 'calendar',
    frequencyLabel: '40 mois (Réglementaire)',
    intervalMonths: 40,
    description: 'Inspection périodique obligatoire selon arrêté ministériel du 20 novembre 2017 relatif aux ESP.',
    checkpoints: [
      'Inspection visuelle interne et externe du réservoir d\'air / séparateur',
      'Mesure d\'épaisseur résiduelle des parois métalliques par ultrasons',
      'Vérification et tarage sur banc de la soupape de sécurité décharge',
      'Contrôle des organes de sécurité, manomètre étalonné et pressostat',
      'Rédaction du Procès-Verbal de visite d\'inspection périodique APAVE/Bureau Veritas'
    ],
    estimatedDuration: '03:00',
    safetyInstructions: 'Opération réservée à un organisme de contrôle habilité et personne compétente reconnue.',
    status: 'active'
  }
];

