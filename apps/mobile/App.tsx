/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useLayoutEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {requestUserPermission, setupFCM} from './src/config/fcm';
import LoginScreen from './src/screens/LoginScreen';
import VerificationListScreen from './src/screens/VerificationListScreen';
import VerificationItemScreen from './src/screens/VerificationItemScreen';
import NetInfo from '@react-native-community/netinfo';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  ActivityIndicator,
  Modal,
  Pressable,
  Linking,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import WorkVerification from './src/screens/WorkVerification';
import {getItem} from './src/helpers/utility';
import BusinessVerification from './src/screens/BusinessVerification';
import {getPlaystoreVersion} from './src/services/auth';
import DeviceInfo from 'react-native-device-info';
import PD from './src/screens/PD';
import QAFormTesting from './src/screens/QAFormTesting';

export type RootStackParamList = {
  Login: undefined;
  VerificationList: undefined;
  VerificationItemScreen: {
    item: {name: string; applicationNumber: string};
    verificationType: 'CurrentAddress' | 'PermanentAddress';
  };
  WorkVerification: {
    item: {name: string; applicationNumber: string};
    verificationType: 'Work';
  };
  BusinessVerification: {
    item: {name: string; applicationNumber: string};
    verificationType: 'Business';
  };
  PDVerification: {
    item: {name: string; applicationNumber: string};
    verificationType: 'Business';
  };
  QAFormTesting: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function isVersionLess(current: string, latest: string) {
  const cur = current.split('.').map(Number);
  const lat = latest.split('.').map(Number);
  for (let i = 0; i < Math.max(cur.length, lat.length); i++) {
    const c = cur[i] || 0;
    const l = lat[i] || 0;
    if (c < l) return true;
    if (c > l) return false;
  }
  return false;
}

const APP_VERSION = DeviceInfo.getVersion();

const App = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [forceUpdate, setForceUpdate] = useState<{
    show: boolean;
    playStoreUrl?: string;
  }>({show: false});

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    const checkAuth = async () => {
      try {
        const accessToken = await getItem('accessToken');
        const refreshToken = await getItem('refreshToken');
        setIsAuthenticated(!!accessToken && !!refreshToken);
      } catch (error) {
        console.error('Error checking auth state:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    return () => {
      unsubscribe();
    };
  }, []);

  useLayoutEffect(() => {
    const checkForceUpdate = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await getPlaystoreVersion();
        const {version, playStoreUrl} = res.data;
        if (version && isVersionLess(APP_VERSION, version)) {
          setForceUpdate({show: true, playStoreUrl});
        }
      } catch (e) {
        console.log('Error checking latest deployment', e);
      }
    };
    checkForceUpdate();
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#145886" />
      </View>
    );
  }

  if (forceUpdate.show) {
    return (
      <Modal visible transparent animationType="fade">
        <View style={styles.forceUpdateContainer}>
          <View style={styles.forceUpdateBox}>
            <Text style={styles.forceUpdateTitle}>Update Required</Text>
            <Text style={styles.forceUpdateText}>
              A new version of the app is available. Please update to continue.
            </Text>
            <Pressable
              style={styles.forceUpdateButton}
              onPress={() => {
                if (forceUpdate.playStoreUrl) {
                  Linking.openURL(forceUpdate.playStoreUrl);
                }
              }}>
              <Text style={styles.forceUpdateButtonText}>Update Now</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar /> */}
      {!isConnected && (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}>No Internet</Text>
        </View>
      )}
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isAuthenticated ? 'VerificationList' : 'Login'}>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="VerificationList"
            component={VerificationListScreen}
            options={{
              // title: 'Verification List',
              headerShown: false,
              gestureEnabled: false,
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="VerificationItemScreen"
            component={VerificationItemScreen}
            options={({route}) => ({
              title: route.params?.item
                ? `${route.params.item.name}, ${route.params.item.applicationNumber}`
                : 'Verification Details',
            })}
          />

          <Stack.Screen
            name="WorkVerification"
            component={WorkVerification}
            options={({route}) => ({
              title: route.params?.item
                ? `${route.params.item.name}, ${route.params.item.applicationNumber}`
                : 'Work Verification',
            })}
          />

          <Stack.Screen
            name="BusinessVerification"
            component={BusinessVerification}
            options={({route}) => ({
              title: route.params?.item
                ? `${route.params.item.name}, ${route.params.item.applicationNumber}`
                : 'Business Verification',
            })}
          />
          <Stack.Screen
            name="PDVerification"
            component={PD}
            options={({route}) => ({
              headerShown: false,
              title: route.params?.item
                ? `${route.params.item.name}, ${route.params.item.applicationNumber}`
                : 'PD Verification',
              // headerStyle: {
              //   height: 0,
              // },
            })}
          />
          <Stack.Screen
            name="QAFormTesting"
            component={QAFormTesting}
            options={{
              headerShown: false,
              title: 'QA Form Testing',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    zIndex: 1,
  },
  offlineText: {
    color: '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  forceUpdateContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forceUpdateBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 24,
    alignItems: 'center',
    width: 300,
  },
  forceUpdateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#145886',
  },
  forceUpdateText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  forceUpdateButton: {
    backgroundColor: '#145886',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  forceUpdateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
