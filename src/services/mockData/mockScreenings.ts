import { ScreeningRecord, LabDispatch, AuditLogEntry } from '../../types';

export const INITIAL_SCREENINGS: ScreeningRecord[] = [
  {
    id: 'SCR-2026-4410',
    timestamp: '2026-09-04 22:15:30',
    officerBadge: 'TN-4812',
    officerName: 'SI K. Murugan',
    location: {
      lat: 13.0694,
      lng: 80.1948,
      address: 'Koyambedu Inter-State Bus Terminus (CMBT), Chennai'
    },
    subjectRef: 'SUBJ-TN-4410-X',
    substanceClass: 'Synthetic Opioid',
    primarySubstance: 'Fentanyl Analog (Illicit Press)',
    confidence: 98.6,
    adulterants: [
      { name: 'Xylazine (Veterinary Sedative Cut)', percentage: 34.2, risk: 'CRITICAL' },
      { name: 'Paracetamol / Starch Binder', percentage: 48.0, risk: 'MEDIUM' }
    ],
    pupillometry: {
      diameterMm: 1.8,
      responseTimeMs: 620,
      constrictionScore: 'Severe Pinpoint Miosis / Sluggish (Opioid Indicator)',
      nystagmus: true
    },
    lateralFlow: {
      fentanylStrip: 'POSITIVE',
      xylazineStrip: 'POSITIVE',
      methStrip: 'NEGATIVE'
    },
    spectroscopy: {
      matchScore: 98.4,
      libraryMatch: 'TN FSD Narcotics Library #9822 (Fentanyl Hydrochloride)',
      peakWavelength: 1650,
      waveformType: 'FTIR Raman Combined'
    },
    riskLevel: 'CRITICAL',
    chainOfCustody: {
      evidenceBagNumber: 'TN-FSD-EV-2026-0988',
      sealedBy: 'SI K. Murugan (Badge #TN-4812)',
      sealedAt: '2026-09-04 22:24:12',
      status: 'FIELD_SEALED',
      signatureHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      notes: 'Double sealed in puncture-resistant evidence sleeve under Section 52A NDPS Act.'
    },
    notes: 'Subject exhibited severe respiratory depression near CMBT platform 4. 108 Emergency Ambulance summoned; Naloxone administered on scene.'
  },
  {
    id: 'SCR-2026-4409',
    timestamp: '2026-09-04 18:35:10',
    officerBadge: 'TN-4812',
    officerName: 'SI K. Murugan',
    location: {
      lat: 13.0827,
      lng: 80.2755,
      address: 'Puratchi Thalaivar Dr. MGR Central Railway Station, Chennai'
    },
    subjectRef: 'SUBJ-TN-4409-M',
    substanceClass: 'CNS Stimulant',
    primarySubstance: 'Methamphetamine Hydrochloride (Ice)',
    confidence: 96.2,
    adulterants: [
      { name: 'Dimethyl sulfone (MSM Cut)', percentage: 12.5, risk: 'MEDIUM' }
    ],
    pupillometry: {
      diameterMm: 6.9,
      responseTimeMs: 140,
      constrictionScore: 'Mydriasis (Dilated) / Hyper-reactive',
      nystagmus: false
    },
    lateralFlow: {
      fentanylStrip: 'NEGATIVE',
      xylazineStrip: 'NEGATIVE',
      methStrip: 'POSITIVE'
    },
    spectroscopy: {
      matchScore: 96.5,
      libraryMatch: 'TN FSD Narcotics Library #4101 (d-Methamphetamine)',
      peakWavelength: 1420,
      waveformType: 'Raman Optical'
    },
    riskLevel: 'HIGH',
    chainOfCustody: {
      evidenceBagNumber: 'TN-FSD-EV-2026-0987',
      sealedBy: 'SI K. Murugan (Badge #TN-4812)',
      sealedAt: '2026-09-04 18:44:00',
      status: 'DISPATCHED_TO_LAB',
      signatureHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      notes: 'Dispatched to Forensic Sciences Department (FSD), Kamarajar Salai, Mylapore, Chennai.'
    },
    notes: 'Crystalline substance seized from transit passenger luggage.'
  }
];

export const INITIAL_LAB_DISPATCHES: LabDispatch[] = [
  {
    id: 'LAB-9041',
    caseId: 'CASE-2026-0888',
    caseNumber: 'TN-PEW-2026-CR-0888',
    labName: 'Forensic Sciences Department (FSD), Mylapore, Chennai',
    testType: 'GC-MS',
    trackingNo: 'TN-FSD-EXP-77291',
    dispatchedDate: '2026-09-04',
    estTurnaroundDays: 3,
    status: 'IN_ANALYSIS',
  },
  {
    id: 'LAB-9038',
    caseId: 'CASE-2026-0870',
    caseNumber: 'TN-NIB-2026-CR-0870',
    labName: 'Regional Forensic Science Laboratory (RFSL), Coimbatore',
    testType: 'LC-MS/MS',
    trackingNo: 'TN-FSD-EXP-77114',
    dispatchedDate: '2026-09-01',
    estTurnaroundDays: 0,
    status: 'CERTIFIED',
    certifiedSubstance: 'Synthetic Opioid Pressed Compound',
    purityPercent: 94.8
  },
  {
    id: 'LAB-9042',
    caseId: 'CASE-2026-0891',
    caseNumber: 'TN-PEW-2026-CR-0891',
    labName: 'Forensic Sciences Department (FSD), Mylapore, Chennai',
    testType: 'GC-MS',
    trackingNo: 'TN-FSD-EXP-77340',
    dispatchedDate: '2026-09-05',
    estTurnaroundDays: 4,
    status: 'DISPATCHED'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-8841',
    timestamp: '2026-09-05 08:30:12',
    action: 'DEVICE_SELF_CALIBRATION',
    performedBy: 'OPTICAL DETECTOR [FSD-SPEC-7749-TN]',
    details: 'Daily laser calibration routine passed. Baseline drift: 0.02nm (nominal).',
    hash: '8f6d21469e32a688d014ff94e09f538e1215bb4b8b609e259b32961d67069905',
    cjisClass: 'UNCLASSIFIED_FOUO'
  },
  {
    id: 'AUD-8840',
    timestamp: '2026-09-04 22:24:12',
    action: 'CHAIN_OF_CUSTODY_SEAL',
    performedBy: 'SI K. Murugan (Badge #TN-4812)',
    details: 'Sealed Bag #TN-FSD-EV-2026-0988 for Case TN-PEW-2026-CR-0891 under NDPS Sec 52A.',
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    cjisClass: 'LAW_ENFORCEMENT_SENSITIVE'
  },
  {
    id: 'AUD-8839',
    timestamp: '2026-09-04 22:15:40',
    action: 'MULTI_SIGNAL_SCREENING_EXECUTED',
    performedBy: 'SI K. Murugan (Badge #TN-4812)',
    details: 'Screening SCR-2026-4410: Critical Alert triggered for Synthetic Opioid + Xylazine.',
    hash: '3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b',
    cjisClass: 'LAW_ENFORCEMENT_SENSITIVE'
  },
  {
    id: 'AUD-8835',
    timestamp: '2026-09-04 18:44:00',
    action: 'LAB_DISPATCH_AUTHORIZED',
    performedBy: 'SI K. Murugan (Badge #TN-4812)',
    details: 'Evidence #TN-FSD-EV-2026-0987 released to Forensic Sciences Department, Chennai.',
    hash: '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5',
    cjisClass: 'LAW_ENFORCEMENT_SENSITIVE'
  }
];
