export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const getAIResponse = (
  userMessage: string,
  mode: 'officer' | 'civilian',
  currentCity: string = 'Coimbatore'
): string => {
  const q = userMessage.toLowerCase();

  if (mode === 'officer') {
    // Officer AI Field Assistant responses
    if (q.includes('hardware') || q.includes('voltage') || q.includes('colorimet') || q.includes('positive') || q.includes('negative')) {
      return `🔬 **Hardware Sensor Guidance**:
Our handheld device measures colorimetric optical density (OD) and converts chemical dye change into an electrical voltage signal.
• **Cutoff Threshold**: 2.50V (or > 0.65 OD).
• **Voltage ≥ 2.50V**: **POSITIVE** (target narcotic / adulterant detected).
• **Voltage < 2.50V**: **NEGATIVE** (sample within normal baseline).
*Tip: Ensure the cuvette/strip chamber is wiped clean with isopropyl alcohol between tests to prevent residual voltage drift.*`;
    }

    if (q.includes('section 50') || q.includes('sec 50') || q.includes('search') || q.includes('ndps')) {
      return `⚖️ **NDPS Act Section 50 Compliance Mandate**:
1. Inform suspect in writing of their statutory right to be searched before a Gazetted Officer or a Judicial Magistrate.
2. If suspect requests a Magistrate, escort them to the nearest Judicial Magistrate in ${currentCity}.
3. Female suspects must only be searched by a female officer.
4. Prepare seizure memo and log the digital hash stamp immediately under Section 52A.`;
    }

    if (q.includes('coimbatore') || q.includes('location') || q.includes('jurisdiction')) {
      return `📍 **${currentCity} Field Operations**:
• Current interdiction sector: **${currentCity} Central Jurisdiction**.
• Nearest Government Forensic Facility: Regional Forensic Science Laboratory (RFSL), Coimbatore.
• Nearest emergency hospital: Coimbatore Medical College Hospital (CMCH), Trichy Road.
• Emergency Coordination: Dial 108 for emergency medical support or 100/112 for police dispatch.`;
    }

    if (q.includes('rehab') || q.includes('diversion') || q.includes('transfer') || q.includes('64a') || q.includes('sec 64a') || q.includes('de-addiction') || q.includes('hospital')) {
      return `🏥 **NDPS Act Section 64A & Rehabilitation Diversion Protocol**:
• **Statutory Immunity**: Section 64A grants immunity from prosecution to any drug-dependent person who voluntarily submits to medical treatment in an approved de-addiction facility.
• **Tamil Nadu LEAD Policy**: Officers can divert first-time or small-quantity positive cases directly to hospital care instead of filing criminal remand.
• **108 Medical Transport**: Tap "Move Subject to Rehabilitation Center" on the positive verdict card to automatically log the diversion and request a 108 Emergency Ambulance for safe clinical escort.
• **Facilities in ${currentCity}**: Coimbatore Medical College Hospital (CMCH) De-Addiction Unit, Trichy Road (0422-2300151), or ESI Hospital Singanallur.`;
    }

    if (q.includes('safety') || q.includes('fentanyl') || q.includes('precaution')) {
      return `⚠️ **Officer Field Safety Protocol**:
• Wear dual nitrile gloves and N95 mask. Do not sniff or taste unknown powders.
• Keep Naloxone spray accessible on your duty belt.
• In case of accidental contact, wash skin with cool running water and soap. Do NOT use alcohol sanitizer as it increases dermal absorption.`;
    }

    return `Hello Officer. I am your **AI Field Assistant** for Tamil Nadu Police. I can assist you with:
• Interpreting hardware sensor voltage & colorimetry readings (cutoff: 2.50V).
• Diverting positive cases to rehabilitation centers (NDPS Section 64A & LEAD).
• NDPS Act Section 50 search & Section 52A seizure protocols.
• Evidence packaging and RFSL laboratory submission in ${currentCity}.`;
  }

  // Civilian AI Care & Harm Reduction Helpline
  if (q.includes('108') || q.includes('overdose') || q.includes('unconscious') || q.includes('emergency') || q.includes('help')) {
    return `🚨 **EMERGENCY OVERDOSE PROTOCOL**:
1. **Dial 108 immediately** for Tamil Nadu Emergency Ambulance.
2. Check breathing. Rub knuckles hard on their breastbone (sternal rub).
3. If they are unresponsive, administer Naloxone (Narcan) nasal spray if available.
4. Turn them onto their side into the **Recovery Position** so they do not choke.
*Remember: Under Indian Good Samaritan laws, you cannot be arrested or harassed for seeking emergency medical care.*`;
  }

  if (q.includes('strip') || q.includes('test') || q.includes('read') || q.includes('line')) {
    return `🧪 **How to Read Rapid Test Strips**:
• **2 Lines** = **NEGATIVE** (Safe / Drug not detected). Even a faint second line means negative!
• **1 Line** = **POSITIVE** (Dangerous adulterant / Fentanyl detected! Do not consume).
• **0 Lines** = Invalid test. Retest with fresh strip.
*Always dilute properly: dissolve 10mg of powder in 1 teaspoon of water before dipping.*`;
  }

  if (q.includes('coimbatore') || q.includes('hospital') || q.includes('rehab') || q.includes('clinic')) {
    return `🏥 **Support in ${currentCity}**:
• **Coimbatore Medical College Hospital (CMCH)**: 24/7 De-addiction & Emergency Intake on Trichy Road (Phone: 0422-2300151).
• **108 Emergency Ambulance**: Free 24/7 dispatch across Coimbatore.
• **Tamil Nadu Anti-Drug Helpline**: **10581** (Toll-free / Confidential).
• **National Helpline**: **14446** (Govt of India de-addiction helpline).`;
  }

  if (q.includes('anonymous') || q.includes('police') || q.includes('privacy')) {
    return `🔒 **Your Privacy is 100% Protected**:
This app does not store your name, phone number, or IP address. Reports submitted here are sent anonymously to community harm reduction teams to issue batch warnings and save lives.`;
  }

  return `Hello. I am your **24/7 AI Health & Safety Companion**.
I am here to support you without judgment. Ask me about:
• Overdose first-aid & 108 Emergency Ambulance help.
• How to check test strips (reading 1 vs 2 lines).
• Free confidential de-addiction centers in ${currentCity}.
• Anonymous community safety alerts.`;
};
