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
import {View, Text, StyleSheet, Platform, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// Configure XMLHttpRequest

export type RootStackParamList = {
  Login: undefined;
  VerificationList: undefined;
  VerificationItem: {item: {name: string; age: number; sex: string}};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {!isConnected && (
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineText}>No Internet</Text>
        </View>
      )}
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="VerificationList"
            component={VerificationListScreen}
            options={{title: 'Verification List'}}
          />
          <Stack.Screen
            name="VerificationItem"
            component={VerificationItemScreen}
            options={({route}) => ({
              title: `${route.params.item.name}, ${
                route.params.item.age
              } ${route.params.item.sex.charAt(0).toUpperCase()}`,
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
});

export default App;
