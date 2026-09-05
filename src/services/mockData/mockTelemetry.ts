import { DeviceTelemetry } from '../../types';

export const INITIAL_DEVICE_TELEMETRY: DeviceTelemetry = {
  serialNumber: 'FSD-SPEC-7749-TN',
  firmwareVersion: 'v4.18.2-SECURE',
  batteryPercent: 88,
  isBluetoothConnected: true,
  laserCalibrationValid: true,
  calibrationDaysLeft: 19,
  reagentCartridgeRemaining: 18,
  cartridgeTotal: 25,
  chamberTempC: 22.4,
  lastSelfCheckPassed: true,
};
