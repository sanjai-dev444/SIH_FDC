import React, { useState, useEffect } from 'react';
import { AppMode, OfficerTab, CivilianTab, ScreeningRecord, CaseRecord, LabDispatch, RehabCase, CivilianTip, AuditLogEntry, DeviceTelemetry } from './types';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { OfficerDrawer } from './components/navigation/OfficerDrawer';
import { CivilianDrawer } from './components/navigation/CivilianDrawer';
import { CalculatorDisguise } from './components/civilian/CalculatorDisguise';
import { AIAssistantModal } from './components/common/AIAssistantModal';
import { Bot, Sparkles } from 'lucide-react';

// Mock Initial Data
import { INITIAL_SCREENINGS, INITIAL_LAB_DISPATCHES, INITIAL_AUDIT_LOGS } from './services/mockData/mockScreenings';
import { INITIAL_CASES } from './services/mockData/mockCases';
import { INITIAL_HOTSPOTS } from './services/mockData/mockHeatmap';
import { INITIAL_REHAB_CASES, INITIAL_SAFETY_RESOURCES } from './services/mockData/mockRehabs';
import { INITIAL_DEVICE_TELEMETRY } from './services/mockData/mockTelemetry';

// Pages
import { SplashLoginScreen } from './pages/splash/SplashLoginScreen';
import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { NewScreeningPage } from './pages/officer/NewScreeningPage';
import { MultiSignalResultsPage } from './pages/officer/MultiSignalResultsPage';
import { CaseManagementPage } from './pages/officer/CaseManagementPage';
import { ConfirmatoryTestingPage } from './pages/officer/ConfirmatoryTestingPage';
import { ConfirmedCasesPage } from './pages/officer/ConfirmedCasesPage';
import { DrugHeatmapPage } from './pages/officer/DrugHeatmapPage';
import { RehabTrackingPage } from './pages/officer/RehabTrackingPage';
import { DeviceStatusPage } from './pages/officer/DeviceStatusPage';
import { ReportsAuditLogsPage } from './pages/officer/ReportsAuditLogsPage';
import { OfficerProfilePage } from './pages/officer/OfficerProfilePage';

import { CivilianDashboard } from './pages/civilian/CivilianDashboard';
import { PersonalSelfCheckPage } from './pages/civilian/PersonalSelfCheckPage';
import { ReportSuspiciousActivityPage } from './pages/civilian/ReportSuspiciousActivityPage';
import { SOSPage } from './pages/civilian/SOSPage';
import { LocalSafetyMapPage } from './pages/civilian/LocalSafetyMapPage';
import { RehabHelplineDirectoryPage } from './pages/civilian/RehabHelplineDirectoryPage';
import { MyReportsPage } from './pages/civilian/MyReportsPage';
import { PrivacySettingsPage } from './pages/civilian/PrivacySettingsPage';

// Services
import { registerHardwareBackAction } from './services/native/appStateService';
import { getStoredItem, setStoredItem } from './services/native/storageService';
import { getCurrentPosition } from './services/native/locationService';
import { triggerHapticSuccess, triggerHapticTap } from './services/native/hapticsService';

export const App: React.FC = () => {
  // Navigation State
  const [mode, setMode] = useState<AppMode>('splash');
  const [officerTab, setOfficerTab] = useState<OfficerTab>('dashboard');
  const [civilianTab, setCivilianTab] = useState<CivilianTab>('home');
  const [isOfficerDrawerOpen, setIsOfficerDrawerOpen] = useState(false);
  const [isCivilianDrawerOpen, setIsCivilianDrawerOpen] = useState(false);
  const [stealthActive, setStealthActive] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState('Coimbatore');

  // Core Data State
  const [screenings, setScreenings] = useState<ScreeningRecord[]>(INITIAL_SCREENINGS);
  const [cases, setCases] = useState<CaseRecord[]>(INITIAL_CASES);
  const [hotspots, setHotspots] = useState(INITIAL_HOTSPOTS);
  const [rehabCases, setRehabCases] = useState<RehabCase[]>(INITIAL_REHAB_CASES);
  const [safetyResources, setSafetyResources] = useState(INITIAL_SAFETY_RESOURCES);
  const [telemetry, setTelemetry] = useState<DeviceTelemetry>(INITIAL_DEVICE_TELEMETRY);
  const [labDispatches, setLabDispatches] = useState<LabDispatch[]>(INITIAL_LAB_DISPATCHES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [civilianTips, setCivilianTips] = useState<CivilianTip[]>([
    {
      id: 'TIP-CBE-8419',
      timestamp: '2026-09-04 19:20',
      incidentType: 'Contaminated Street Batch Alert (Tranq / Synthetic)',
      description: 'Spurious packets causing rapid skin ulceration and unconsciousness near Gandhipuram bus bays.',
      location: { lat: 11.0168, lng: 76.9672, address: 'Gandhipuram Central Sector, Coimbatore' },
      hasPhoto: true,
      status: 'TRIAGED_HIGH_PRIORITY',
      anonymousPin: '492811'
    }
  ]);

  // Load saved state on mount & detect location
  useEffect(() => {
    getStoredItem('field_screening_last_mode').then((savedMode) => {
      if (savedMode && ['officer', 'civilian'].includes(savedMode)) {
        setMode(savedMode as AppMode);
      }
    });

    // Detect GPS location
    getCurrentPosition().then((pos) => {
      if (pos.city) setCurrentCity(pos.city);
    });

    const cleanupBack = registerHardwareBackAction(() => {
      if (isAIAssistantOpen) {
        setIsAIAssistantOpen(false);
        return true;
      }
      if (stealthActive) {
        setStealthActive(false);
        return true;
      }
      if (isOfficerDrawerOpen) {
        setIsOfficerDrawerOpen(false);
        return true;
      }
      if (isCivilianDrawerOpen) {
        setIsCivilianDrawerOpen(false);
        return true;
      }
      if (mode === 'officer' && officerTab !== 'dashboard') {
        setOfficerTab('dashboard');
        return true;
      }
      if (mode === 'civilian' && civilianTab !== 'home') {
        setCivilianTab('home');
        return true;
      }
      if (mode !== 'splash') {
        setMode('splash');
        return true;
      }
      return false;
    });

    return cleanupBack;
  }, [mode, officerTab, civilianTab, isOfficerDrawerOpen, isCivilianDrawerOpen, stealthActive, isAIAssistantOpen]);

  const handleSetMode = (newMode: AppMode) => {
    setMode(newMode);
    if (newMode !== 'splash') {
      setStoredItem('field_screening_last_mode', newMode);
    }
  };

  const handleLogout = () => {
    setMode('splash');
    setStoredItem('field_screening_last_mode', 'splash');
    setOfficerTab('dashboard');
    setCivilianTab('home');
    setIsAIAssistantOpen(false);
  };

  const handleCompleteScreening = (newScreening: ScreeningRecord) => {
    triggerHapticSuccess();
    setScreenings([newScreening, ...screenings]);

    const newCase: CaseRecord = {
      id: `CASE-${newScreening.id.replace('SCR-', '')}`,
      caseNumber: `TN-PEW-2026-CR-${Math.floor(1000 + Math.random() * 9000)}`,
      date: newScreening.timestamp,
      incidentType: `NDPS Field Screening [${newScreening.primarySubstance}]`,
      primaryDrug: newScreening.primarySubstance,
      status: 'ACTIVE_INVESTIGATION',
      officerBadge: `${newScreening.officerName} (#${newScreening.officerBadge})`,
      evidenceCount: 1,
      location: newScreening.location.address,
      riskLevel: newScreening.riskLevel,
      screeningId: newScreening.id,
    };
    setCases([newCase, ...cases]);

    const auditEntry: AuditLogEntry = {
      id: `AUD-TN-${Math.floor(8800 + Math.random() * 1000)}`,
      timestamp: newScreening.timestamp,
      action: 'NDPS_FIELD_SCREENING_EXECUTED',
      performedBy: `${newScreening.officerName} (#${newScreening.officerBadge})`,
      details: `Screening ${newScreening.id} sealed under NDPS Sec 52A with bag ${newScreening.chainOfCustody.evidenceBagNumber}. Risk: ${newScreening.riskLevel}.`,
      hash: newScreening.chainOfCustody.signatureHash,
      cjisClass: 'LAW_ENFORCEMENT_SENSITIVE'
    };
    setAuditLogs([auditEntry, ...auditLogs]);

    setOfficerTab('results');
  };

  const handleMoveToRehab = (
    screening: ScreeningRecord,
    facility: string,
    pathway: RehabCase['programType'],
    counselor: string,
    requestAmbulance: boolean
  ) => {
    triggerHapticSuccess();

    // 1. Add/Update screening record
    const existingIndex = screenings.findIndex(s => s.id === screening.id);
    if (existingIndex >= 0) {
      const updated = [...screenings];
      updated[existingIndex] = screening;
      setScreenings(updated);
    } else {
      setScreenings([screening, ...screenings]);
    }

    // 2. Add / Update case record with status DIVERTED_TO_REHAB
    const newCase: CaseRecord = {
      id: `CASE-${screening.id.replace('SCR-', '')}`,
      caseNumber: `TN-PEW-2026-DIV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: screening.timestamp,
      incidentType: `NDPS LEAD Diversion [${screening.primarySubstance}]`,
      primaryDrug: screening.primarySubstance,
      status: 'DIVERTED_TO_REHAB',
      officerBadge: `${screening.officerName} (#${screening.officerBadge})`,
      evidenceCount: 1,
      location: screening.location.address,
      riskLevel: screening.riskLevel,
      screeningId: screening.id,
    };
    setCases([newCase, ...cases]);

    // 3. Add to Rehab Cases
    const newRehabCase: RehabCase = {
      id: `REHAB-${currentCity.slice(0, 3).toUpperCase()}-${Math.floor(300 + Math.random() * 700)}`,
      subjectInitials: `${screening.subjectRef} (Field Positive Diverted)`,
      programType: pathway,
      status: 'REFERRED',
      compliancePercent: 100,
      assignedCounselor: counselor,
      lastContact: requestAmbulance
        ? `Just now (108 Ambulance dispatched to ${facility})`
        : `Just now (Referred to ${facility})`,
      substanceType: screening.primarySubstance
    };
    setRehabCases([newRehabCase, ...rehabCases]);

    // 4. Add Audit Log
    const auditEntry: AuditLogEntry = {
      id: `AUD-TN-${Math.floor(8800 + Math.random() * 1000)}`,
      timestamp: screening.timestamp,
      action: 'NDPS_SECTION_64A_REHAB_DIVERSION',
      performedBy: `${screening.officerName} (#${screening.officerBadge})`,
      details: `Subject ${screening.subjectRef} tested POSITIVE. Diverted to ${facility} under ${pathway}.${requestAmbulance ? ' 108 Ambulance medical escort dispatched.' : ''}`,
      hash: screening.chainOfCustody.signatureHash,
      cjisClass: 'LAW_ENFORCEMENT_SENSITIVE'
    };
    setAuditLogs([auditEntry, ...auditLogs]);

    // 5. Navigate to Rehab Tracking tab to inspect new referral!
    setOfficerTab('rehab');
  };

  const handleDispatchToLab = (screening: ScreeningRecord | CaseRecord) => {
    const caseNum = 'caseNumber' in screening ? screening.caseNumber : `TN-PEW-2026-CR-${screening.id.replace('SCR-', '')}`;
    const newDispatch: LabDispatch = {
      id: `LAB-TN-${Math.floor(9000 + Math.random() * 1000)}`,
      caseId: screening.id,
      caseNumber: caseNum,
      labName: 'Forensic Sciences Department (FSD), Mylapore, Chennai',
      testType: 'GC-MS',
      trackingNo: `TN-FSD-EXP-${Math.floor(10000 + Math.random() * 90000)}`,
      dispatchedDate: new Date().toISOString().split('T')[0],
      estTurnaroundDays: 4,
      status: 'DISPATCHED'
    };
    setLabDispatches([newDispatch, ...labDispatches]);
    triggerHapticSuccess();
    setOfficerTab('confirmatory');
  };

  const handleSubmitTip = (tip: CivilianTip) => {
    setCivilianTips([tip, ...civilianTips]);
  };

  if (stealthActive) {
    return <CalculatorDisguise onDeactivate={() => setStealthActive(false)} />;
  }

  if (mode === 'splash') {
    return <SplashLoginScreen onSelectMode={handleSetMode} />;
  }

  return (
    <div className={`h-full w-full flex flex-col ${mode === 'officer' ? 'bg-tactical-950' : 'bg-slate-950'}`}>
      {/* Top Header with AI Help & City Badge */}
      <Header
        mode={mode}
        onLogout={handleLogout}
        onSwitchMode={handleSetMode}
        deviceBattery={telemetry.batteryPercent}
        isBleConnected={telemetry.isBluetoothConnected}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        currentCity={currentCity}
      />

      {/* Main Content Area (Mobile Scrollable) */}
      <main className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-4 relative">
        <div className="max-w-md mx-auto">
          {mode === 'officer' && (
            <>
              {officerTab === 'dashboard' && (
                <OfficerDashboard
                  onNavigate={setOfficerTab}
                  screenings={screenings}
                  cases={cases}
                  onSelectScreening={() => setOfficerTab('results')}
                />
              )}
              {officerTab === 'screening' && (
                <NewScreeningPage
                  onCompleteScreening={handleCompleteScreening}
                  onCancel={() => setOfficerTab('dashboard')}
                  onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                  onMoveToRehab={handleMoveToRehab}
                />
              )}
              {officerTab === 'results' && (
                <MultiSignalResultsPage
                  screenings={screenings}
                  onDispatchToLab={handleDispatchToLab}
                  onMoveToRehab={handleMoveToRehab}
                />
              )}
              {officerTab === 'cases' && (
                <CaseManagementPage
                  cases={cases}
                  onDispatchCaseToLab={handleDispatchToLab}
                />
              )}
              {officerTab === 'confirmatory' && (
                <ConfirmatoryTestingPage
                  dispatches={labDispatches}
                  onAddNewDispatch={(d) => setLabDispatches([d, ...labDispatches])}
                />
              )}
              {officerTab === 'confirmed' && (
                <ConfirmedCasesPage cases={cases} />
              )}
              {officerTab === 'heatmap' && (
                <DrugHeatmapPage 
                  hotspots={hotspots}
                  currentCity={currentCity}
                  onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                />
              )}
              {officerTab === 'rehab' && (
                <RehabTrackingPage
                  rehabCases={rehabCases}
                  onAddRehabCase={(r) => setRehabCases([r, ...rehabCases])}
                />
              )}
              {officerTab === 'device' && (
                <DeviceStatusPage
                  telemetry={telemetry}
                  onUpdateTelemetry={setTelemetry}
                />
              )}
              {officerTab === 'reports' && (
                <ReportsAuditLogsPage logs={auditLogs} />
              )}
              {officerTab === 'profile' && (
                <OfficerProfilePage
                  onLogout={handleLogout}
                  onSwitchMode={handleSetMode}
                />
              )}
            </>
          )}

          {mode === 'civilian' && (
            <>
              {civilianTab === 'home' && (
                <CivilianDashboard
                  onNavigate={setCivilianTab}
                  resources={safetyResources}
                />
              )}
              {civilianTab === 'selfcheck' && (
                <PersonalSelfCheckPage />
              )}
              {civilianTab === 'report' && (
                <ReportSuspiciousActivityPage onSubmitTip={handleSubmitTip} />
              )}
              {civilianTab === 'sos' && (
                <SOSPage />
              )}
              {civilianTab === 'safetymap' && (
                <LocalSafetyMapPage 
                  resources={safetyResources}
                  currentCity={currentCity}
                  onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                />
              )}
              {civilianTab === 'directory' && (
                <RehabHelplineDirectoryPage />
              )}
              {civilianTab === 'myreports' && (
                <MyReportsPage
                  tips={civilianTips}
                  onClearTips={() => setCivilianTips([])}
                />
              )}
              {civilianTab === 'privacy' && (
                <PrivacySettingsPage
                  onSwitchMode={handleSetMode}
                  onActivateStealth={() => setStealthActive(true)}
                />
              )}
            </>
          )}
        </div>

        {/* Floating Quick AI Button */}
        <button
          onClick={() => {
            triggerHapticTap();
            setIsAIAssistantOpen(true);
          }}
          className={`fixed bottom-20 right-4 z-40 p-3 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-95 ${
            mode === 'officer'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-tactical-950 glow-cyan ring-2 ring-cyan-400/40'
              : 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 shadow-lg ring-2 ring-teal-400/40'
          }`}
          title="Open AI Chatbox / Helpline"
        >
          <Bot className="w-5 h-5 stroke-[2.5]" />
          <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-amber-300 animate-pulse" />
        </button>
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        mode={mode}
        officerTab={officerTab}
        civilianTab={civilianTab}
        onSelectOfficerTab={setOfficerTab}
        onSelectCivilianTab={setCivilianTab}
        onOpenOfficerDrawer={() => setIsOfficerDrawerOpen(true)}
        onOpenCivilianDrawer={() => setIsCivilianDrawerOpen(true)}
      />

      {/* Slide-out Menu Drawers */}
      <OfficerDrawer
        isOpen={isOfficerDrawerOpen}
        onClose={() => setIsOfficerDrawerOpen(false)}
        activeTab={officerTab}
        onSelectTab={setOfficerTab}
        onLogout={handleLogout}
      />

      <CivilianDrawer
        isOpen={isCivilianDrawerOpen}
        onClose={() => setIsCivilianDrawerOpen(false)}
        activeTab={civilianTab}
        onSelectTab={setCivilianTab}
        onReturnToSplash={handleLogout}
      />

      {/* AI Assistant / Chatbox Helpline Modal */}
      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        mode={mode === 'officer' ? 'officer' : 'civilian'}
        currentCity={currentCity}
      />
    </div>
  );
};
