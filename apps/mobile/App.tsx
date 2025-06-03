/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {requestUserPermission, setupFCM} from './src/config/fcm';
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
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import WorkVerification from './src/screens/WorkVerification';
import {getItem} from './src/helpers/utility';
import BusinessVerification from './src/screens/BusinessVerification';

// Configure XMLHttpRequest

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
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // Check authentication state
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

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#145886" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
});

export default App;
