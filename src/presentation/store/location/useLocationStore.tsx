import { create } from 'zustand';
import { Location } from '../../../infrastructure/interfaces';
import { getCurrentLocation } from '../../../actions/location/location';

interface LocationState {
  lastKnownLocation: Location | null;

  getLocation: () => Promise<Location | null>;
}

export const useLocationStore = create<LocationState>()((set, get) => ({
  lastKnownLocation: null,
  getLocation: async () => {
    const location = await getCurrentLocation();
    set({ lastKnownLocation: location });
    return location;
  },
}));
