import Geolocation from '@react-native-community/geolocation';
import { Location } from '../../infrastructure/interfaces';

export const getCurrentLocation = async (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      info => {
        resolve({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
      },
      error => {
        console.log('Cannot get current location');
        reject(error);
      },
      {
        enableHighAccuracy: true,
      },
    );
  });
};
