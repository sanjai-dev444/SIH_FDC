import { LocalNotifications } from '@capacitor/local-notifications';

export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const status = await LocalNotifications.requestPermissions();
    return status.display === 'granted';
  } catch {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }
};

export const scheduleLocalNotification = async (
  title: string,
  body: string,
  id: number = Date.now() % 100000
) => {
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id,
          schedule: { at: new Date(Date.now() + 500) },
          sound: 'beep.wav',
          smallIcon: 'ic_stat_icon_config_sample',
          actionTypeId: '',
          extra: null,
        }
      ]
    });
  } catch (err) {
    console.warn('Native LocalNotifications unavailable, falling back to Web Notification:', err);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.svg' });
    }
  }
};
