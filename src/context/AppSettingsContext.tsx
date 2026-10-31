import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AppSettings,
  UserLocation,
  PrayerMethod,
  DEFAULT_NOTIFICATION_TOGGLES,
} from '../types';
import {
  requestDeviceLocation,
  checkLocationPermissionInfo,
  DeviceLocationResult,
  LocationPermissionInfo,
  findNearestCity,
} from '../services/locationService';

const STORAGE_KEY = 'ramadan_companion_settings';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  location: {
    city: 'Jakarta',
    country: 'Indonesia',
    latitude: -6.2088,
    longitude: 106.8456,
    timezone: 'Asia/Jakarta',
  },
  prayerMethod: 'KEMENAG',
  arabicFontSize: 24,
  translationFontSize: 14,
  notificationsEnabled: false,
  notificationToggles: DEFAULT_NOTIFICATION_TOGGLES,
  reminderMinutesBefore: 0,
  notificationSoundEnabled: true,
  ihtiyatMinutes: 2,
};

interface AppSettingsContextValue {
  settings: AppSettings;
  isDetectingLocation: boolean;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  updateLocation: (location: UserLocation) => void;
  updatePrayerMethod: (method: PrayerMethod) => void;
  detectDeviceLocation: (options?: { preferGPSOnly?: boolean }) => Promise<DeviceLocationResult>;
  checkLocationPermission: () => Promise<LocationPermissionInfo>;
  resetSettings: () => void;
}

const AppSettingsContext = createContext<AppSettingsContextValue | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse saved settings, using defaults', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Apply theme class to document root
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else if (settings.theme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      // System
      const prefersDark =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    }
  }, [settings.theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const updateLocation = useCallback((location: UserLocation) => {
    setSettings((prev) => ({ ...prev, location }));
  }, []);

  const updatePrayerMethod = useCallback((prayerMethod: PrayerMethod) => {
    setSettings((prev) => ({ ...prev, prayerMethod }));
  }, []);

  const checkLocationPermission = useCallback(async (): Promise<LocationPermissionInfo> => {
    return await checkLocationPermissionInfo();
  }, []);

  const detectDeviceLocation = useCallback(
    async (options?: { preferGPSOnly?: boolean }): Promise<DeviceLocationResult> => {
      setIsDetectingLocation(true);
      try {
        const result = await requestDeviceLocation(options);
        setSettings((prev) => ({ ...prev, location: result.location }));
        return result;
      } finally {
        setIsDetectingLocation(false);
      }
    },
    []
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear settings from localStorage', e);
    }
  }, []);

  return (
    <AppSettingsContext.Provider
      value={{
        settings,
        isDetectingLocation,
        updateSettings,
        updateLocation,
        updatePrayerMethod,
        detectDeviceLocation,
        checkLocationPermission,
        resetSettings,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};
