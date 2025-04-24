import { Capacitor } from '@capacitor/core';

export function getPlatform() {
  return Capacitor.getPlatform(); // 'android', 'ios', 'web'
}

export function isAndroid() {
  return getPlatform() === 'android';
}

export function isWeb() {
  return getPlatform() === 'web';
}