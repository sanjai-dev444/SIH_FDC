# Digital Field Drug Screening Companion

> **Mobile-First React + Vite Web Application Engineered for Native Android Packaging with Capacitor.**
> **Localized for Tamil Nadu Law Enforcement & Community Harm Reduction.**

A dual-mode mobile platform designed for rapid field drug screening using colorimetric optical & electrical sensor inputs, evidence chain-of-custody preservation under the NDPS Act (1985), and community harm reduction with 108 emergency dispatch.

---

## Key Architecture & Features

### 🛡️ Dual Operating Modes

#### 1. Officer Enforcement & Field Triage Mode
* **HUD Dashboard**: Real-time tactical status, today's screening count, active critical adulterant alerts, pending lab confirmations, hardware battery & BLE link status.
* **New Field Screening (4-Stage Wizard)**:
  1. *Context & GPS*: Automatic geolocation fix, anonymized subject ID, officer observations.
  2. *Multi-Signal Sensor Acquisition*:
     - **Optical Pupillometry**: Interactive pupil diameter slider (1.5mm–8.0mm), constriction latency ms, and Horizontal Gaze Nystagmus (HGN) test.
     - **Lateral Flow Immunoassay Reader**: Real-time camera viewfinder or strip toggle for Fentanyl, Xylazine (Tranq), and Methamphetamine.
     - **FTIR / Raman Optical Spectrometer**: Non-destructive laser trigger simulation with peak wavelength analysis.
  3. *Algorithmic Signal Fusion*: Weighted multi-signal calculation, chemical class identification, adulterant risk scoring (Critical / High / Moderate), and safety mandates.
  4. *Chain of Custody Sealing*: Evidence bag barcode tag, officer digital signature, and SHA-256 cryptographic tamper hash.
* **Multi-Signal Results**: Deep-dive spectral absorption curves (400–3600 cm⁻¹), sensor breakdown, and lab dispatch trigger.
* **Case Management**: Active cases, custody logs, witness and investigative notes thread.
* **Confirmatory Testing**: GC-MS & LC-MS/MS crime lab dispatch tracking, turnaround time estimation, courier tracking numbers, certified toxicology records.
* **Confirmed Cases Archive**: Judicial archive of adjudicated cases with printable court packets.
* **Tactical Drug Heatmap**: Interactive radar map with GPS hotspot cluster nodes, substance filters, and Tranq/Xylazine warning alerts.
* **Rehab & LEAD Diversion Tracking**: Pre-booking diversion monitoring, treatment plan compliance meters, counselor check-in logging.
* **Device Hardware Status**: Spectrometer serial telemetry, battery %, laser calibration days left, reagent cartridge capacity, automated self-diagnostic routine.
* **Reports & Audit Logs**: Tamper-evident CJIS Policy Area 5 audit logs with SHA-256 integrity stamps, printable PDF view, and CSV audit export.
* **Officer Profile & Security**: Badge credential info, offline evidence vault sync toggle, session inactivity auto-lock.

#### 2. Civilian Harm Reduction & Care Mode
* **Harm Reduction Hub**: Warm, approachable interface with 100% anonymity guarantee (no account, no tracking).
* **Personal Self-Check**:
  - Dilution instructions and step-by-step test-strip dipping guide.
  - Optical camera scanner assist to verify 1 vs 2 lines on test strips.
  - Confidential physical symptom triage checklist with overdose danger alerts.
* **Report Suspicious Activity / Contaminated Batch**:
  - Zero-knowledge submission (EXIF stripped from photos, no IP or phone numbers stored).
  - Categorized reports (Tranq, fake M30 pills, hazardous waste).
  - Anonymous tracking PIN generation.
* **🆘 Emergency SOS Overdose Beacon**:
  - High-visibility emergency screen with 1-tap **911 / EMS direct calling**.
  - Current street address and GPS coordinates display for the 911 dispatcher.
  - Step-by-step Naloxone (Narcan) administration checklist and rescue breathing guide.
* **Local Safety Map**:
  - Interactive map of free 24/7 NaloxBoxes, syringe service programs, and crisis centers.
  - Walking distances, phone numbers, hours, and 1-tap Google Maps navigation.
* **24/7 Helpline Directory**: Direct tap-to-call for SAMHSA (1-800-662-4357), Never Use Alone buddy line (1-800-484-3731), and 988 Suicide & Crisis Lifeline.
* **My Reports**: Locally encrypted ledger of submitted tips and their triage review status.
* **Privacy & Stealth Controls**:
  - **Panic Calculator Disguise**: Instantly converts the app into a working standard calculator.
  - **Zero-Trace Data Sanitization**: 1-tap purge of all local storage and cached data.
  - Biometric fingerprint lock toggle.

---

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite 6
- **Styling**: Tailwind CSS, Mobile Safe-Area utilities (`env(safe-area-inset-top)` / `env(safe-area-inset-bottom)`)
- **Icons**: Lucide React
- **Native Android Container**: Capacitor v7 (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`)
- **Native Plugin Abstraction Layer**:
  - Camera (`@capacitor/camera` + HTML5 fallback)
  - Geolocation (`@capacitor/geolocation` + Web Geolocation fallback)
  - Haptics (`@capacitor/haptics` + Web Vibration fallback)
  - Local Notifications (`@capacitor/local-notifications` + Web Notifications fallback)
  - Preferences / Storage (`@capacitor/preferences` + localStorage fallback)
  - Device (`@capacitor/device` + browser fallback)
  - App Lifecycle (`@capacitor/app` + Android hardware back button handler)

---

## Quick Start (Web Development)

```bash
# Navigate to project directory
cd aegis-app

# Install dependencies
npm install

# Start local mobile dev server
npm run dev
```

Visit `http://localhost:3000` in your browser. Use your browser's Developer Tools Device Mode (Ctrl+Shift+M or Cmd+Shift+M) and select a mobile viewport such as **Pixel 7** or **Samsung Galaxy S20**.

---

## Packaging for Android (Capacitor)

Follow the detailed instructions in [ANDROID_SETUP.md](ANDROID_SETUP.md) to generate APK and AAB files. Quick summary:

```bash
# 1. Build production assets
npm run build

# 2. Add Android platform
npx cap add android

# 3. Synchronize plugins & assets
npx cap sync

# 4. Open in Android Studio
npx cap open android
```

From Android Studio or CLI:
- **Debug APK**: `cd android && ./gradlew assembleDebug`
- **Release APK**: `cd android && ./gradlew assembleRelease`
- **Google Play AAB**: `cd android && ./gradlew bundleRelease`
