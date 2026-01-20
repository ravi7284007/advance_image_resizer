'use client';

import { useState, useEffect } from 'react';
import { ImageResizerSettings } from '../types';

const defaultSettings: ImageResizerSettings = {
  outputWidth: 832,
  outputHeight: 832,
  removeBackground: false,
  bgType: 'transparent',
  backgroundColor: '#ffffff',
  blurIntensity: 26,
  fadeEffect: 60,
  overlayOpacity: 0.08,
  overlayColor: '#000000',
  outputFormat: 'png',
  quality: 92,
  watermarkText: '',
  watermarkPosition: 'bottom-center',
  watermarkSize: 24,
  watermarkOpacity: 0.6,
  watermarkColor: '#ffffff',
  watermarkFont: 'Arial',
  repeatSpacing: 150,
  repeatRotation: -45,
  borderWidth: 0,
  borderColor: '#ffffff',
  brightness: 100,
  contrast: 100,
  saturation: 100
};

export function useImageResizerSettings() {
  const [settings, setSettings] = useState<ImageResizerSettings>(defaultSettings);

  useEffect(() => {
    const savedSettings = localStorage.getItem('imageResizerSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<ImageResizerSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('imageResizerSettings', JSON.stringify(updated));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem('imageResizerSettings', JSON.stringify(defaultSettings));
  };

  return { settings, updateSettings, resetSettings };
}