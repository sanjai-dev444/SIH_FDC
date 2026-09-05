import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export const triggerHapticTap = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  }
};

export const triggerHapticMedium = async () => {
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch {
    if ('vibrate' in navigator) {
      navigator.vibrate(40);
    }
  }
};

export const triggerHapticSuccess = async () => {
  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 50, 40]);
    }
  }
};

export const triggerHapticWarning = async () => {
  try {
    await Haptics.notification({ type: NotificationType.Warning });
  } catch {
    if ('vibrate' in navigator) {
      navigator.vibrate([80, 40, 80]);
    }
  }
};

export const triggerHapticCritical = async () => {
  try {
    await Haptics.notification({ type: NotificationType.Error });
  } catch {
    if ('vibrate' in navigator) {
      navigator.vibrate([150, 60, 200, 60, 300]);
    }
  }
};
