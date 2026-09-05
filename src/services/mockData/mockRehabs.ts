import { RehabCase, SafetyResource } from '../../types';

export const INITIAL_REHAB_CASES: RehabCase[] = [
  {
    id: 'REHAB-CBE-301',
    subjectInitials: 'P. K. (Case #CBE-0412)',
    programType: 'LEAD_DIVERSION',
    status: 'ACTIVE_COMPLIANT',
    compliancePercent: 96,
    assignedCounselor: 'Dr. M. Senthil, MD (CMCH Coimbatore De-Addiction Unit)',
    lastContact: 'Yesterday, 11:30',
    substanceType: 'Opioid Dependency'
  },
  {
    id: 'REHAB-CBE-302',
    subjectInitials: 'V. S. (Case #CBE-0398)',
    programType: 'COUNTY_DRUG_COURT',
    status: 'ACTIVE_COMPLIANT',
    compliancePercent: 88,
    assignedCounselor: 'S. Rajeshwari, MSW (Coimbatore Mental Health Center)',
    lastContact: '3 days ago',
    substanceType: 'Synthetic Stimulants'
  },
  {
    id: 'REHAB-CHN-303',
    subjectInitials: 'R. K. (Case #CHN-0840)',
    programType: 'HARM_REDUCTION_DETOX',
    status: 'MISSED_CHECKIN',
    compliancePercent: 54,
    assignedCounselor: 'Dr. S. Kanimozhi, MSW (RGGGH Chennai)',
    lastContact: '5 days ago',
    substanceType: 'Synthetic Sedatives'
  }
];

export const INITIAL_SAFETY_RESOURCES: SafetyResource[] = [
  // Coimbatore Centers
  {
    id: 'SAFE-CBE-01',
    name: '108 Emergency Ambulance Station - Gandhipuram',
    type: 'NARCAN_BOX',
    address: 'Near Central Bus Stand & Cross Cut Road, Gandhipuram, Coimbatore',
    distanceMiles: 0.3,
    phone: '108',
    hours: '24 Hours / 7 Days (Tamil Nadu 108 GVK EMRI)',
    naloxoneStock: 'HIGH',
    is24Hours: true
  },
  {
    id: 'SAFE-CBE-02',
    name: 'Coimbatore Medical College Hospital (CMCH) De-Addiction Unit',
    type: 'HARM_REDUCTION_CLINIC',
    address: 'Trichy Road, Opposite Collectorate, Coimbatore',
    distanceMiles: 0.9,
    phone: '0422-2300151',
    hours: '24 Hours Emergency Intake & Toxicology Ward',
    naloxoneStock: 'HIGH',
    is24Hours: true
  },
  {
    id: 'SAFE-CBE-03',
    name: 'ESI Medical College Hospital Emergency & Naloxone Station',
    type: 'HARM_REDUCTION_CLINIC',
    address: 'Kamrajar Road, Singanallur, Coimbatore',
    distanceMiles: 2.1,
    phone: '0422-2574383',
    hours: '24 Hours Emergency Ward',
    naloxoneStock: 'HIGH',
    is24Hours: true
  },
  {
    id: 'SAFE-CBE-04',
    name: 'Ukkadam Bus Terminal 108 First Aid Point',
    type: 'NARCAN_BOX',
    address: 'Ukkadam Junction & Bypass, Coimbatore',
    distanceMiles: 1.4,
    phone: '108',
    hours: '24 Hours Emergency Point',
    naloxoneStock: 'HIGH',
    is24Hours: true
  },
  // Chennai Centers
  {
    id: 'SAFE-CHN-01',
    name: 'Rajiv Gandhi Govt General Hospital (RGGGH) De-Addiction Unit',
    type: 'HARM_REDUCTION_CLINIC',
    address: 'EVR Periyar Salai, Park Town, Chennai',
    distanceMiles: 12.0,
    phone: '044-25305000',
    hours: '24 Hours Emergency Ward',
    naloxoneStock: 'HIGH',
    is24Hours: true
  }
];
