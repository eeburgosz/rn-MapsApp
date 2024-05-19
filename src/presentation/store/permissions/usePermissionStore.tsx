import { create } from 'zustand';
import { PermissionStatus } from '../../../infrastructure/interfaces';
import {
  checkLocationPermission,
  requestLocationPermission,
} from '../../../actions';

interface PermissionsState {
  locationStatus: PermissionStatus;

  requestLocationPermission: () => Promise<PermissionStatus>; //! O void
  checkLocationPermission: () => Promise<PermissionStatus>; //! O void
}

export const usePermissionStore = create<PermissionsState>()(set => ({
  locationStatus: 'undetermined',

  requestLocationPermission: async () => {
    const status = await requestLocationPermission();
    set({ locationStatus: status });
    return status;
  },

  checkLocationPermission: async () => {
    const status = await checkLocationPermission();
    set({ locationStatus: status });
    return status;
  },
}));
