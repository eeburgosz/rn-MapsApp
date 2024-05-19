import { PropsWithChildren, useEffect } from 'react';
import { AppState } from 'react-native';
import { usePermissionStore } from '../store/permissions/usePermissionStore';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../navigation/StackNavigation';

export const PermissionsChecker = ({ children }: PropsWithChildren) => {
  const { locationStatus, checkLocationPermission } = usePermissionStore();

  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  useEffect(() => {
    if (locationStatus === 'granted') {
      // navigation.navigate('MapScreen'); //! El .nagigate me permite volver a la página anterior y no debo poder hacerlo.
      navigation.reset({
        routes: [{ name: 'MapScreen' }],
      });
    } else if (locationStatus !== 'undetermined') {
      // navigation.navigate('PermissionsScreen');
      navigation.reset({
        routes: [{ name: 'PermissionsScreen' }],
      });
    }
  }, [locationStatus]);

  //! Esto va a verificar los permisos la primera vez que se inicia la app.
  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // console.log('AppState: ', nextAppState);
      if (nextAppState === 'active') {
        checkLocationPermission();
      }
    });
    //* Siempre que se hace este tipo de suscripciones, es importante limpiarlas cuando no se usen más
    return () => {
      subscription.remove();
    };
  }, []);

  return <>{children}</>;
};
