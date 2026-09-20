import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function useAddToHomeScreen() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    
    const checkStandalone = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator.standalone === true);
      setIsStandalone(isStandalone);
    };
    
    checkStandalone();
    
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = () => {
      setIsStandalone(mediaQuery.matches || window.navigator.standalone === true);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) {
      
      showManualInstallInstructions();
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
    } catch (err) {
      console.error('Install prompt failed:', err);
      showManualInstallInstructions();
    }

    setDeferredPrompt(null);
  };

  const showManualInstallInstructions = () => {
    
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isAndroid = /android/i.test(navigator.userAgent);
    
    let message = 'For the best experience, add this app to your home screen:';
    
    if (isIOS) {
      message += '\n1. Tap the share button (⬆️)\n2. Scroll down and tap "Add to Home Screen"';
    } else if (isAndroid) {
      message += '\n1. Tap the menu button (⋮)\n2. Tap "Add to Home screen"';
    } else {
      message += '\nCheck your browser menu for "Install" or "Add to Home screen" option.';
    }
    
    toast.info(message, { autoClose: 8000 });
  };

  return { 
    isSupported: !!deferredPrompt, 
    isStandalone,
    promptInstall,
    showManualInstallInstructions 
  };
}