//! Solicitud de un permiso. Lógica de negocio

import {
  PERMISSIONS,
  PermissionStatus as RNPermissionStatus,
  check,
  openSettings,
  request,
} from 'react-native-permissions';
import type { PermissionStatus } from '../../infrastructure/interfaces';
import { Platform } from 'react-native';

export const requestLocationPermission =
  async (): Promise<PermissionStatus> => {
    let status: RNPermissionStatus = 'unavailable';

    if (Platform.OS === 'ios') {
      status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else if (Platform.OS === 'android') {
      status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    } else {
      throw new Error('Platform not supported');
    }

    if (status === 'blocked') {
      await openSettings();
      // return await checkLocationPermission()
      //Todo: checkLocationPermission()
    }

    const permissionMapper: Record<RNPermissionStatus, PermissionStatus> = {
      granted: 'granted',
      denied: 'denied',
      blocked: 'blocked',
      unavailable: 'unavailable',
      limited: 'limited',
    };

    return permissionMapper[status] ?? 'unavailable';
  };

export const checkLocationPermission = async (): Promise<PermissionStatus> => {
  let status: RNPermissionStatus = 'unavailable';
  if (Platform.OS === 'ios') {
    status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  } else if (Platform.OS === 'android') {
    status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  } else {
    throw new Error('Platform not supported');
  }

  const permissionMapper: Record<RNPermissionStatus, PermissionStatus> = {
    granted: 'granted',
    denied: 'denied',
    blocked: 'blocked',
    unavailable: 'unavailable',
    limited: 'limited',
  };

  return permissionMapper[status] ?? 'unavailable';
};
