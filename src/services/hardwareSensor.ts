export interface SensorReading {
  voltage: number; // e.g. 0.0V - 5.0V
  thresholdVoltage: number; // e.g. 2.50V
  opticalAbsorbance: number; // OD (Optical Density)
  result: 'POSITIVE' | 'NEGATIVE';
  status: 'IDLE' | 'READING' | 'COMPLETED' | 'ERROR';
  detectedClass: string;
  notes: string;
}

export const SENSOR_THRESHOLDS = {
  narcoticCutoffVoltage: 2.50, // Volts
  opticalCutoffOD: 0.65, // Absorbance OD
};

/**
 * Evaluates an electrical / colorimetric sensor reading into a clear Positive / Negative
 */
export const evaluateSensorInput = (
  voltage: number,
  opticalOD: number,
  sampleType: 'Narcotic Opioid' | 'Synthetic Drug' | 'Stimulant' | 'General Screen' = 'General Screen'
): SensorReading => {
  const isVoltagePositive = voltage >= SENSOR_THRESHOLDS.narcoticCutoffVoltage;
  const isOpticalPositive = opticalOD >= SENSOR_THRESHOLDS.opticalCutoffOD;

  // Positive if electrical or colorimetric threshold breached
  const isPositive = isVoltagePositive || isOpticalPositive;

  return {
    voltage: Number(voltage.toFixed(2)),
    thresholdVoltage: SENSOR_THRESHOLDS.narcoticCutoffVoltage,
    opticalAbsorbance: Number(opticalOD.toFixed(2)),
    result: isPositive ? 'POSITIVE' : 'NEGATIVE',
    status: 'COMPLETED',
    detectedClass: isPositive ? sampleType : 'Clear / Negative',
    notes: isPositive
      ? `Signal Voltage (${voltage.toFixed(2)}V) exceeded cutoff (${SENSOR_THRESHOLDS.narcoticCutoffVoltage}V). Contraband reaction detected.`
      : `Signal Voltage (${voltage.toFixed(2)}V) below cutoff. No target narcotics detected.`,
  };
};
