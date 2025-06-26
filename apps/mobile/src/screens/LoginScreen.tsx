import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {requestAllPermissions} from '../utils/permissions';
import {setItem} from '../helpers/utility';
import {generateOTP, verifyOTP} from '../services/auth';
import {colors} from '../constants/colors';
import KowthaLightIcon from '../assets/Images/KowthaLightIcon.png';
import KowthaDarkIcon from '../assets/Images/KowthaDarkIcon.png';
import Toast from 'react-native-toast-message';
import loginBackground from '../assets/Images/loginBackground.jpg';
import DeviceInfo from 'react-native-device-info';
import {getUserDetailsApi} from '../services/user.services';
// import {get} from 'http';
// import {REACT_APP_BASE_URL} from '@env';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

const getDeviceId = async () => {
  const deviceId = await DeviceInfo.getUniqueId();
  console.log('Device ID:', deviceId);
  return deviceId;
};

const LoginScreen = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  // console.log('REACT_APP_BASE_URL', REACT_APP_BASE_URL);

  const handleSendOtp = async () => {
    if (mobileNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setLoading(true);
      await generateOTP(mobileNumber);
      // Alert.alert('Success', 'OTP has been sent to your mobile number');
      Toast.show({
        text1: 'OTP has been sent to your mobile number',
        type: 'success',
      });
      setShowOtpInput(true);
    } catch (error: any) {
      // Alert.alert(
      //   'Error',
      //   error?.response?.data?.message ||
      //     'Failed to send OTP. Please try again.',
      // );
      console.log('AXIOS ERROR', error);
      console.log('FULL ERROR', JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    // if (otp.length !== 6) {
    //   Alert.alert('Error', 'Please enter a valid 6-digit OTP');
    //   return;
    // }

    try {
      const deviceId = await getDeviceId();
      setLoading(true);
      const response = await verifyOTP(mobileNumber, otp, deviceId);
      // Store the tokens
      await setItem('accessToken', response?.accessToken);
      await setItem('refreshToken', response?.refreshToken);

      // Request all permissions after successful login
      await requestAllPermissions();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'VerificationList'}],
        }),
      );
      try {
        const userDetails = await getUserDetailsApi();
        // console.log(userDetails);
        await setItem('userDetails', userDetails?.data);
      } catch (error) {
        console.log(error);
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          'Invalid OTP. Please check and try again.',
      );
      // console.log('invalid');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    Toast.show({
      text1: 'New OTP has been sent to your mobile number',
      type: 'success',
    });
  };

  const handleBackToLogin = () => {
    setShowOtpInput(false);
    setOtp('');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={loginBackground}
        style={styles.background}
        resizeMode="cover">
        <View style={styles.container}>
          <Image
            source={KowthaDarkIcon}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>
            {showOtpInput ? 'Verify OTP' : 'Login'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            value={mobileNumber}
            onChangeText={(value: string) => {
              // Only accept numeric input
              if (/^\d*$/.test(value)) {
                setMobileNumber(value);
              }
            }}
            keyboardType="numeric"
            maxLength={10}
            placeholderTextColor={'#c8c8c8'}
            editable={!showOtpInput}
          />
          {!showOtpInput ? (
            <TouchableOpacity
              style={[styles.button, loading && styles.disabledButton]}
              onPress={handleSendOtp}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                value={otp}
                onChangeText={(value: string) => {
                  // Only accept numeric input
                  if (/^\d*$/.test(value)) {
                    setOtp(value);
                  }
                }}
                keyboardType="numeric"
                maxLength={12}
                placeholderTextColor={'#c8c8c8'}
                editable={!loading}
              />
              <TouchableOpacity
                style={[styles.button, loading && styles.disabledButton]}
                onPress={handleVerifyOtp}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Verify OTP</Text>
                )}
              </TouchableOpacity>
              <View style={styles.linkButtonsContainer}>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={handleBackToLogin}
                  disabled={loading}>
                  <Text style={styles.linkButtonText}>Back to Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={handleResendOtp}
                  disabled={loading}>
                  <Text style={styles.linkButtonText}>Resend OTP</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  logo: {
    width: 200,
    height: 80,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.text.primary,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.input.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: colors.input.text,
    backgroundColor: colors.input.background,
  },
  button: {
    backgroundColor: colors.button.primary.background,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: colors.gray[400],
  },
  buttonText: {
    color: colors.button.primary.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  linkButton: {
    padding: 10,
  },
  linkButtonText: {
    color: colors.button.primary.background,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;
