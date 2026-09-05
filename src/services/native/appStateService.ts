import { App } from '@capacitor/app';

export const registerHardwareBackAction = (onBack: () => boolean | void) => {
  try {
    const listener = App.addListener('backButton', ({ canGoBack }) => {
      const handled = onBack();
      if (!handled && !canGoBack) {
        App.exitApp();
      }
    });

    return () => {
      listener.then(sub => sub.remove());
    };
  } catch (err) {
    console.debug('Hardware back button listener not active in web mode:', err);
    return () => {};
  }
};
