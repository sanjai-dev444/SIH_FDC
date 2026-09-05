import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tn.fieldscreening',
  appName: 'Field Screening Companion',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#06b6d4',
      sound: 'beep.wav',
    },
    Camera: {
      presentationStyle: 'fullscreen',
    },
  },
  android: {
    backgroundColor: '#060a0f',
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  }
};

export default config;
