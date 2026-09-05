import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  Truck,
  Building,
  UserCheck
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { RehabCase } from '../../types';
import { triggerHapticTap, triggerHapticSuccess } from '../../services/native/hapticsService';

export interface RehabDiversionData {
  facility: string;
  facilityAddress: string;
  facilityPhone: string;
  pathway: RehabCase['programType'];
  counselor: string;
  requestAmbulance: boolean;
  notes: string;
}

interface RehabDiversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectRef: string;
  substanceName: string;
  currentCity: string;
  voltageReading?: number;
  onConfirmDiversion: (data: RehabDiversionData) => void;
}

interface FacilityOption {
  name: string;
  address: string;
  phone: string;
  city: string;
  defaultCounselor: string;
}

const TAMIL_NADU_FACILITIES: FacilityOption[] = [
  // Coimbatore Facilities
  {
    name: 'Coimbatore Medical College Hospital (CMCH) De-Addiction Unit',
    address: 'Trichy Road, Opposite Collectorate, Coimbatore',
    phone: '0422-2300151',
    city: 'Coimbatore',
    defaultCounselor: 'Dr. M. Senthil, MD (CMCH De-Addiction Unit)'
  },
  {
    name: 'ESI Medical College Hospital Detox & Emergency Ward',
    address: 'Kamarajar Road, Singanallur, Coimbatore',
    phone: '0422-2574383',
    city: 'Coimbatore',
    defaultCounselor: 'Dr. R. Anand, MD (ESI Psychiatric Ward)'
  },
  {
    name: 'PSG Hospitals Addiction Treatment & Crisis Center',
    address: 'Avinashi Road, Peelamedu, Coimbatore',
    phone: '0422-2570170',
    city: 'Coimbatore',
    defaultCounselor: 'Dr. K. Jayasree, MSW (PSG Care Unit)'
  },
  // Chennai Facilities
  {
    name: 'Rajiv Gandhi Govt General Hospital (RGGGH) De-Addiction Center',
    address: 'EVR Periyar Salai, Park Town, Chennai',
    phone: '044-25305000',
    city: 'Chennai',
    defaultCounselor: 'Dr. S. Kanimozhi, MSW (RGGGH Chennai)'
  },
  {
    name: 'Institute of Mental Health (IMH) De-Addiction Unit',
    address: 'Medavakkam Tank Road, Kilpauk, Chennai',
    phone: '044-26442686',
    city: 'Chennai',
    defaultCounselor: 'Dr. P. Vasanth, MD (IMH Kilpauk)'
  },
  {
    name: 'TTK Hospital De-Addiction & Rehabilitation Center',
    address: '4th Main Road, Besant Nagar, Chennai',
    phone: '044-24912948',
    city: 'Chennai',
    defaultCounselor: 'Dr. V. Thirumagal, Ph.D (TTK Center)'
  },
  // Madurai Facilities
  {
    name: 'Govt Rajaji Hospital De-Addiction Ward',
    address: 'Panagal Road, Alwarpuram, Madurai',
    phone: '0452-2532535',
    city: 'Madurai',
    defaultCounselor: 'Dr. K. Ramanathan, MD (GRH Madurai)'
  },
  // Salem Facilities
  {
    name: 'Govt Mohan Kumaramangalam Medical College Hospital',
    address: 'Steel Plant Road, Salem',
    phone: '0427-2211516',
    city: 'Salem',
    defaultCounselor: 'Dr. T. Murugesan, MD (GMKMC Salem)'
  }
];

export const RehabDiversionModal: React.FC<RehabDiversionModalProps> = ({
  isOpen,
  onClose,
  subjectRef,
  substanceName,
  currentCity,
  voltageReading = 3.42,
  onConfirmDiversion,
}) => {
  // Filter facilities by city or fallback to all
  const cityFacilities = TAMIL_NADU_FACILITIES.filter(
    (f) => f.city.toLowerCase() === currentCity.toLowerCase()
  );
  const availableFacilities = cityFacilities.length > 0 ? cityFacilities : TAMIL_NADU_FACILITIES;

  const [selectedFacilityIndex, setSelectedFacilityIndex] = useState(0);
  const [pathway, setPathway] = useState<RehabCase['programType']>('LEAD_DIVERSION');
  const [requestAmbulance, setRequestAmbulance] = useState(true);
  const [counselor, setCounselor] = useState(availableFacilities[0]?.defaultCounselor || '');
  const [officerNotes, setOfficerNotes] = useState('Subject cooperative. Recommended for medical diversion instead of penal detention.');

  // Update counselor when facility changes
  useEffect(() => {
    if (availableFacilities[selectedFacilityIndex]) {
      setCounselor(availableFacilities[selectedFacilityIndex].defaultCounselor);
    }
  }, [selectedFacilityIndex, currentCity]);

  const handleConfirm = () => {
    triggerHapticSuccess();
    const facility = availableFacilities[selectedFacilityIndex];
    onConfirmDiversion({
      facility: facility.name,
      facilityAddress: facility.address,
      facilityPhone: facility.phone,
      pathway,
      counselor,
      requestAmbulance,
      notes: officerNotes,
    });
    onClose();
  };

  const selectedFacility = availableFacilities[selectedFacilityIndex];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transfer to Rehabilitation Center"
      subtitle={`Tamil Nadu Police De-Addiction Diversion • ${currentCity} Jurisdiction`}
      maxHeight="max-h-[92vh]"
    >
      <div className="space-y-4">
        {/* Positive Detection Banner */}
        <div className="bg-rose-950/70 border border-rose-600/70 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
          <div>
            <span className="text-[10px] text-rose-400 font-bold block uppercase">
              FIELD TEST STATUS: POSITIVE ({voltageReading.toFixed(2)}V)
            </span>
            <span className="text-white font-bold">{substanceName}</span>
            <span className="text-slate-400 block text-[11px] mt-0.5">Subject: {subjectRef}</span>
          </div>
          <span className="bg-rose-900 text-rose-200 border border-rose-700 px-2 py-1 rounded text-[10px] font-bold">
            CONTRABAND DETECTED
          </span>
        </div>

        {/* Legal Mandate & Statutory Protection Notice */}
        <div className="bg-emerald-950/60 border border-emerald-600/60 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center space-x-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs font-bold font-mono uppercase tracking-wide">
              NDPS Act 1985 Section 64A & LEAD Framework
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            Under Section 64A of the NDPS Act, persons dependent on narcotics who voluntarily submit to certified hospital detoxification are granted statutory immunity from penal prosecution.
          </p>
        </div>

        {/* Step 1: Select Rehabilitation Center */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
            1. Select Approved De-Addiction Facility ({currentCity})
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {availableFacilities.map((f, idx) => {
              const isSelected = selectedFacilityIndex === idx;
              return (
                <div
                  key={f.name}
                  onClick={() => {
                    triggerHapticTap();
                    setSelectedFacilityIndex(idx);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-tactical-950 border-emerald-500 shadow glow-emerald'
                      : 'bg-tactical-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Building className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <h4 className="text-xs font-bold text-white leading-tight">{f.name}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                        <span>{f.address}</span>
                      </p>
                      <p className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                        <Phone className="w-2.5 h-2.5 flex-shrink-0" />
                        <span>{f.phone}</span>
                      </p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-tactical-950 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Diversion Pathway */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-slate-400 uppercase block font-bold">
            2. Legal & Treatment Pathway
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              {
                id: 'LEAD_DIVERSION' as const,
                title: 'Tamil Nadu Police LEAD Diversion',
                desc: 'Voluntary medical admission & community recovery escort'
              },
              {
                id: 'COUNTY_DRUG_COURT' as const,
                title: 'NDPS Act Section 64A Immunity Order',
                desc: 'Official pre-charge de-addiction undertaking under Magistrate supervision'
              },
              {
                id: 'HARM_REDUCTION_DETOX' as const,
                title: 'Govt Hospital Inpatient Detoxification',
                desc: 'Immediate clinical toxicology stabilization & medical monitoring'
              }
            ].map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  triggerHapticTap();
                  setPathway(p.id);
                }}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  pathway === p.id
                    ? 'bg-emerald-950/40 border-emerald-500 text-white'
                    : 'bg-tactical-950 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">{p.title}</span>
                    <span className="text-[10px] text-slate-400">{p.desc}</span>
                  </div>
                  {pathway === p.id && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3: Medical Transport Toggle (108 Ambulance) */}
        <div className="bg-tactical-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 pr-2">
            <div className="w-9 h-9 rounded-xl bg-teal-950 border border-teal-600 text-teal-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                Dispatch 108 Emergency Ambulance
              </span>
              <span className="text-[10px] font-mono text-teal-300">
                Direct medical escort to {selectedFacility?.city || currentCity} facility
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={requestAmbulance}
            onChange={(e) => {
              triggerHapticTap();
              setRequestAmbulance(e.target.checked);
            }}
            className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
          />
        </div>

        {/* Step 4: Assigned Counselor */}
        <div>
          <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
            Designated Physician / De-Addiction Counselor
          </label>
          <input
            type="text"
            value={counselor}
            onChange={(e) => setCounselor(e.target.value)}
            className="w-full bg-tactical-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-xs font-mono"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-tactical-950 font-black py-3 rounded-xl text-xs font-mono flex items-center justify-center space-x-2 shadow-lg glow-emerald active:scale-95 transition-all"
          >
            <HeartHandshake className="w-4 h-4 stroke-[2.5]" />
            <span>DISPATCH TO REHABILITATION CENTER</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
