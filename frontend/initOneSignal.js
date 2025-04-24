import OneSignal from 'react-onesignal';

export const initializeOneSignal = async () => {
  try {
    await OneSignal.init({
      appId: 'YOUR_ONESIGNAL_APP_ID', // Replace with your OneSignal App ID
      safari_web_id: 'YOUR_SAFARI_WEB_ID', // Optional, for Safari support
      allowLocalhostAsSecureOrigin: true, // For development only
      autoResubscribe: true,
    });

    // Prompt user for notification permission
    OneSignal.showSlidedownPrompt();
  } catch (error) {
    console.error('Error initializing OneSignal:', error);
  }
};