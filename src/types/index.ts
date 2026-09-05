export type AppMode = 'splash' | 'officer' | 'civilian';

export type OfficerTab = 
  | 'dashboard'
  | 'screening'
  | 'results'
  | 'cases'
  | 'confirmatory'
  | 'confirmed'
  | 'heatmap'
  | 'rehab'
  | 'device'
  | 'reports'
  | 'profile';

export type CivilianTab = 
  | 'home'
  | 'selfcheck'
  | 'report'
  | 'sos'
  | 'safetymap'
  | 'directory'
  | 'myreports'
  | 'privacy';

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export interface Adulterant {
  name: string;
  percentage: number;
  risk: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface PupillometryData {
  diameterMm: number;
  responseTimeMs: number;
  constrictionScore: string;
  nystagmus: boolean;
}

export interface LateralFlowData {
  fentanylStrip: 'POSITIVE' | 'NEGATIVE' | 'INVALID';
  xylazineStrip: 'POSITIVE' | 'NEGATIVE' | 'INVALID';
  methStrip: 'POSITIVE' | 'NEGATIVE' | 'INVALID';
}

export interface SpectroscopyData {
  matchScore: number;
  libraryMatch: string;
  peakWavelength: number;
  waveformType: string;
}

export interface ChainOfCustody {
  evidenceBagNumber: string;
  sealedBy: string;
  sealedAt: string;
  status: 'FIELD_SEALED' | 'DISPATCHED_TO_LAB' | 'LAB_CONFIRMED' | 'COURT_EVIDENCE';
  signatureHash: string;
  notes?: string;
}

export interface ScreeningRecord {
  id: string;
  timestamp: string;
  officerBadge: string;
  officerName: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  subjectRef: string;
  substanceClass: string;
  primarySubstance: string;
  confidence: number;
  adulterants: Adulterant[];
  pupillometry: PupillometryData;
  lateralFlow: LateralFlowData;
  spectroscopy: SpectroscopyData;
  riskLevel: RiskLevel;
  chainOfCustody: ChainOfCustody;
  notes: string;
  photoUrl?: string;
}

export interface CaseRecord {
  id: string;
  caseNumber: string;
  date: string;
  incidentType: string;
  primaryDrug: string;
  status: 'ACTIVE_INVESTIGATION' | 'PENDING_LAB_CONFIRM' | 'CLOSED_ADJUDICATED' | 'DIVERTED_TO_REHAB';
  officerBadge: string;
  evidenceCount: number;
  location: string;
  riskLevel: RiskLevel;
  screeningId?: string;
}

export interface LabDispatch {
  id: string;
  caseId: string;
  caseNumber: string;
  labName: string;
  testType: 'GC-MS' | 'LC-MS/MS' | 'FTIR_CONFIRM';
  trackingNo: string;
  dispatchedDate: string;
  estTurnaroundDays: number;
  status: 'DISPATCHED' | 'RECEIVED' | 'IN_ANALYSIS' | 'CERTIFIED';
  certifiedSubstance?: string;
  purityPercent?: number;
}

export interface DrugHotspot {
  id: string;
  lat: number;
  lng: number;
  neighborhood: string;
  substance: string;
  riskLevel: RiskLevel;
  adulterantAlert?: string;
  incidentCount: number;
  lastReported: string;
}

export interface RehabCase {
  id: string;
  subjectInitials: string;
  programType: 'LEAD_DIVERSION' | 'COUNTY_DRUG_COURT' | 'HARM_REDUCTION_DETOX';
  status: 'ACTIVE_COMPLIANT' | 'MISSED_CHECKIN' | 'COMPLETED' | 'REFERRED';
  compliancePercent: number;
  assignedCounselor: string;
  lastContact: string;
  substanceType: string;
}

export interface DeviceTelemetry {
  serialNumber: string;
  firmwareVersion: string;
  batteryPercent: number;
  isBluetoothConnected: boolean;
  laserCalibrationValid: boolean;
  calibrationDaysLeft: number;
  reagentCartridgeRemaining: number;
  cartridgeTotal: number;
  chamberTempC: number;
  lastSelfCheckPassed: boolean;
}

export interface CivilianTip {
  id: string;
  timestamp: string;
  incidentType: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  hasPhoto: boolean;
  status: 'SUBMITTED' | 'TRIAGED_HIGH_PRIORITY' | 'UNDER_REVIEW' | 'REFERRED_TO_OUTREACH';
  anonymousPin: string;
}

export interface SafetyResource {
  id: string;
  name: string;
  type: 'NARCAN_BOX' | 'HARM_REDUCTION_CLINIC' | 'SYRINGE_EXCHANGE' | 'SHELTER';
  address: string;
  distanceMiles: number;
  phone: string;
  hours: string;
  naloxoneStock: 'HIGH' | 'LIMITED' | 'CALL_AHEAD';
  is24Hours: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  details: string;
  hash: string;
  cjisClass: 'UNCLASSIFIED_FOUO' | 'LAW_ENFORCEMENT_SENSITIVE';
}
