import {Linking, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const setItem = async (key: string, value: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting item:', error);
  }
};

export const getItem = async (key: string): Promise<any> => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting item:', error);
    return null;
  }
};

export const clearItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing item:', error);
  }
};

export const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing all items:', error);
  }
};

export const switchAll = async (selectedUser: any): Promise<void> => {
  try {
    await setItem('user', selectedUser);
    await setItem('organisation_id', selectedUser?.organization);
    await setItem('patient_id', selectedUser?.id);
  } catch (error) {
    console.error('Error switching user:', error);
  }
};

export const forceUpdateRequired = (version: {
  force_update_version: string;
}): boolean => {
  if (
    Platform.OS === 'android' &&
    DeviceInfo.getVersion() < version.force_update_version
  ) {
    return true;
  }
  return false;
};

export const newVersionAvailable = (version: {
  latest_version?: string;
}): boolean => {
  if (
    Platform.OS === 'android' &&
    DeviceInfo.getVersion() < (version?.latest_version || '')
  ) {
    return true;
  }
  return false;
};

export const launchURL = async (url: string): Promise<void> => {
  try {
    await Linking.openURL(url);
  } catch (error) {
    console.error('Error launching URL:', error);
  }
};

export const convertToFormData = (
  res: {data: {fields: Record<string, string>}},
  file: any,
): FormData => {
  const formData = new FormData();
  for (const key in res.data.fields) {
    formData.append(key, res.data.fields[key]);
  }
  formData.append('file', file);
  return formData;
};

export const capitalizeFirstLetter = (status: string): string => {
  if (typeof status !== 'string' || status.length === 0) {
    return status;
  }

  return status
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const calculateDurationInDays = (startDate: string): number => {
  const startDateObj = new Date(startDate);
  const currentDate = new Date();

  const differenceInTime = currentDate.getTime() - startDateObj.getTime();
  const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

  return differenceInDays + 1;
};

export const extractTime = (dateString: string): string => {
  return dayjs.utc(dateString).format('h:mm A');
};
