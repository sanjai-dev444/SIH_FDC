import { DrugHotspot } from '../../types';

export const INITIAL_HOTSPOTS: DrugHotspot[] = [
  // Coimbatore Hotspots (Prominent)
  {
    id: 'HOT-CBE-01',
    lat: 11.0168,
    lng: 76.9672,
    neighborhood: 'Gandhipuram Central Bus Stand, Coimbatore',
    substance: 'Synthetic Opioid / Adulterated Powder',
    riskLevel: 'CRITICAL',
    adulterantAlert: 'High potency adulterant alert - Colorimetry testing indicated > 3.4V threshold',
    incidentCount: 14,
    lastReported: '15 min ago'
  },
  {
    id: 'HOT-CBE-02',
    lat: 10.9935,
    lng: 76.9602,
    neighborhood: 'Ukkadam Bus Terminal & Bypass, Coimbatore',
    substance: 'Brown Sugar / Crude Opioids',
    riskLevel: 'HIGH',
    incidentCount: 9,
    lastReported: '1 hr ago'
  },
  {
    id: 'HOT-CBE-03',
    lat: 11.0264,
    lng: 77.0028,
    neighborhood: 'Peelamedu Transit & College Belt, Coimbatore',
    substance: 'Methamphetamine (Ice) & Synthetic Stimulants',
    riskLevel: 'CRITICAL',
    adulterantAlert: 'Counterfeit tablets detected with colorimetry positive reaction',
    incidentCount: 11,
    lastReported: '2 hrs ago'
  },
  {
    id: 'HOT-CBE-04',
    lat: 11.0112,
    lng: 76.9538,
    neighborhood: 'RS Puram & DB Road Commercial Sector, Coimbatore',
    substance: 'Spurious Sedatives / Counterfeit Tablets',
    riskLevel: 'MODERATE',
    incidentCount: 6,
    lastReported: '4 hrs ago'
  },
  // Chennai Hotspots
  {
    id: 'HOT-CHN-01',
    lat: 13.0694,
    lng: 80.1948,
    neighborhood: 'Koyambedu CMBT / Market Terminal, Chennai',
    substance: 'Synthetic Opioid + Xylazine Cut',
    riskLevel: 'CRITICAL',
    adulterantAlert: 'Severe respiratory depression alert',
    incidentCount: 18,
    lastReported: '30 min ago'
  },
  {
    id: 'HOT-CHN-02',
    lat: 13.0827,
    lng: 80.2755,
    neighborhood: 'Chennai Central Station / Elephant Gate Sector',
    substance: 'Methamphetamine HCl',
    riskLevel: 'HIGH',
    incidentCount: 8,
    lastReported: '3 hrs ago'
  },
  // Madurai Hotspot
  {
    id: 'HOT-MDU-01',
    lat: 9.9542,
    lng: 78.1565,
    neighborhood: 'Mattuthavani Integrated Bus Terminal, Madurai',
    substance: 'Spurious Buprenorphine Cocktail',
    riskLevel: 'MODERATE',
    incidentCount: 5,
    lastReported: '6 hrs ago'
  }
];
