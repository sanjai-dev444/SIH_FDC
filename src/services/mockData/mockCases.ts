import { CaseRecord } from '../../types';

export const INITIAL_CASES: CaseRecord[] = [
  {
    id: 'CASE-2026-0891',
    caseNumber: 'TN-PEW-2026-CR-0891',
    date: '2026-09-04 22:15',
    incidentType: 'NDPS Interdiction / CMBT Parcel Check',
    primaryDrug: 'Fentanyl Analog + Xylazine Cut',
    status: 'ACTIVE_INVESTIGATION',
    officerBadge: '#TN-4812 (SI K. Murugan)',
    evidenceCount: 3,
    location: 'Koyambedu Inter-State Bus Terminus, Chennai',
    riskLevel: 'CRITICAL',
    screeningId: 'SCR-2026-4410'
  },
  {
    id: 'CASE-2026-0888',
    caseNumber: 'TN-PEW-2026-CR-0888',
    date: '2026-09-04 18:40',
    incidentType: 'Railway Platform Transit Screening',
    primaryDrug: 'Methamphetamine (High Purity Ice)',
    status: 'PENDING_LAB_CONFIRM',
    officerBadge: '#TN-4812 (SI K. Murugan)',
    evidenceCount: 2,
    location: 'Chennai Central Station (Puratchi Thalaivar Dr. MGR Central)',
    riskLevel: 'HIGH',
    screeningId: 'SCR-2026-4409'
  },
  {
    id: 'CASE-2026-0882',
    caseNumber: 'TN-PEW-2026-CR-0882',
    date: '2026-09-03 14:10',
    incidentType: 'Pre-charge De-Addiction Diversion Triage',
    primaryDrug: 'Brown Sugar / Crude Heroin',
    status: 'DIVERTED_TO_REHAB',
    officerBadge: '#TN-4812 (SI K. Murugan)',
    evidenceCount: 1,
    location: 'T. Nagar Ranganathan Street Area, Chennai',
    riskLevel: 'MODERATE',
    screeningId: 'SCR-2026-4402'
  },
  {
    id: 'CASE-2026-0870',
    caseNumber: 'TN-NIB-2026-CR-0870',
    date: '2026-09-01 03:25',
    incidentType: 'Overdose Scene Field Analysis',
    primaryDrug: 'Synthetic Opioid Pressed Pills',
    status: 'CLOSED_ADJUDICATED',
    officerBadge: '#TN-3190 (Inspector S. Ravichandran)',
    evidenceCount: 4,
    location: 'Gandhipuram Cross Cut Road, Coimbatore',
    riskLevel: 'CRITICAL',
    screeningId: 'SCR-2026-4389'
  }
];
