import { Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { Location } from '../../../infrastructure/interfaces';
import { Fab } from '../ui/Fab';
import { useEffect, useRef, useState } from 'react';
import { useLocationStore } from '../../store/location/useLocationStore';

interface Props {
  showUserLocation?: boolean;
  initialLocation: Location;
}

export const Map = ({ showUserLocation = true, initialLocation }: Props) => {
  const mapRef = useRef<MapView>();
  const cameraLocation = useRef<Location>(initialLocation);

  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [isShowingPopyline, setIsShowingPopyline] = useState(true);

  const {
    getLocation,
    lastKnownLocation,
    watchLocation,
    clearWatchLocation,
    userLocationsList,
  } = useLocationStore();

  const moveCameraToLocation = (location: Location) => {
    if (!mapRef.current) return;
    mapRef.current.animateCamera({
      center: location,
    });
  };

  const moveToCurrentLocation = async () => {
    if (!lastKnownLocation) {
      moveCameraToLocation(initialLocation);
    }
    const location = await getLocation();
    if (!location) return;
    moveCameraToLocation(location);
  };

  useEffect(() => {
    watchLocation();
    return () => {
      clearWatchLocation();
    };
  }, []);

  useEffect(() => {
    if (lastKnownLocation && isFollowingUser)
      moveCameraToLocation(lastKnownLocation);
  }, [lastKnownLocation, isFollowingUser]);

  return (
    <>
      <MapView
        ref={map => (mapRef.current = map!)}
        showsUserLocation={showUserLocation}
        provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE} // remove if not using Google Maps
        style={{ flex: 1 }}
        region={{
          latitude: cameraLocation.current.latitude,
          longitude: cameraLocation.current.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        onTouchStart={() => setIsFollowingUser(false)}>
        {/* <Marker
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324,
          }}
          title="Título del marcador"
          description="Descripción del marcador"
          image={require('../../../assets/custom-marker.png')}
        /> */}

        {isShowingPopyline && (
          <Polyline
            coordinates={userLocationsList}
            strokeColor="black"
            strokeWidth={5}
          />
        )}
      </MapView>

      <Fab
        iconName={isShowingPopyline ? 'eye-outline' : 'eye-off-outline'}
        onPress={() => setIsShowingPopyline(!isShowingPopyline)}
        style={{ bottom: 140, right: 20 }}
      />
      <Fab
        iconName={isFollowingUser ? 'walk-outline' : 'accessibility-outline'}
        onPress={() => setIsFollowingUser(!isFollowingUser)}
        style={{ bottom: 80, right: 20 }}
      />
      <Fab
        iconName="compass-outline"
        onPress={moveToCurrentLocation}
        style={{ bottom: 20, right: 20 }}
      />
    </>
  );
};
