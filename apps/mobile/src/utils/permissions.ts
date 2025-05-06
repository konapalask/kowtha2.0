import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Platform} from 'react-native';

const getAndroidPermissions = () => {
  const permissions = [
    PERMISSIONS.ANDROID.CAMERA,
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
  ];

  // Filter out any undefined permissions
  return permissions.filter(permission => permission !== undefined);
};

export const requestAllPermissions = async () => {
  try {
    const permissions = getAndroidPermissions();
    const results = [];

    for (const permission of permissions) {
      try {
        const currentStatus = await check(permission);

        if (currentStatus === RESULTS.GRANTED) {
          results.push({permission, status: RESULTS.GRANTED});
          continue;
        }

        const requestedStatus = await request(permission);
        results.push({permission, status: requestedStatus});
      } catch (error) {
        console.warn(`Error handling permission ${permission}:`, error);
        // Continue with next permission even if one fails
        continue;
      }
    }

    return results;
  } catch (error) {
    console.error('Error in requestAllPermissions:', error);
    throw error;
  }
};
