// Service to manage PWA Installation and Offline Detection
let deferredPrompt: any = null;

// Listen to beforeinstallprompt event globally
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });
}

export const isPWAInstallable = (): boolean => {
  return deferredPrompt !== null;
};

export const promptPWAInstall = async (): Promise<boolean> => {
  if (!deferredPrompt) {
    return false;
  }
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  deferredPrompt = null;
  return choice.outcome === 'accepted';
};

export const isAppRunningStandalone = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
};

