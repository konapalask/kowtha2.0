import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import {postAttendanceApi} from '../services/user.services';
import dayjs from 'dayjs';
import {getItem, setItem} from '../helpers/utility';

const handleLoginTick = async (
  setVisible: (val: boolean) => void,
  setIsLoggedIn: any,
) => {
  try {
    const payload = {
      status: 'Available',
      date: dayjs().format('YYYY-MM-DD'),
    };
    await postAttendanceApi(payload);

    Toast.show({
      type: 'success',
      text1: 'Login Successful',
      position: 'top',
    });
    await setItem('attendance', payload);
  } catch (error: any) {
    console.log(error?.response?.data?.message);
    if (
      error?.response?.data?.message ===
      'Attendance record already exists for this date'
    ) {
      const payload = {
        status: 'Available',
        date: dayjs().format('YYYY-MM-DD'),
      };
      await setItem('attendance', payload);
      setIsLoggedIn(true);
    }
    Toast.show({
      type: 'error',
      text1: error?.response?.data?.message || 'Login unsuccessful',
      position: 'top',
    });
  } finally {
    setVisible(false);
  }
};

const handleLoginCross = (setVisible: (val: boolean) => void) => {
  setVisible(false);
  Toast.show({
    type: 'error',
    text1: 'Login Cancelled',
    position: 'top',
  });
};

const AttendanceCard: React.FC<{
  setVisible: (val: boolean) => void;
  isLoggedIn: any;
  setIsLoggedIn: any;
}> = ({setVisible, isLoggedIn, setIsLoggedIn}) => {
  // const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const checkAttendance = async () => {
      try {
        const details = await getItem('attendance');
        const currentTime = dayjs();
        const isToday = details?.date === currentTime.format('YYYY-MM-DD');
        setIsLoggedIn(isToday);
      } catch (error) {
        console.log(error);
      }
    };
    checkAttendance();
  }, []);

  const isValidTime = () => {
    const currentTime = dayjs();

    const start = currentTime.clone().hour(9).minute(0).second(0);
    const end = currentTime.clone().hour(12).minute(0).second(0);
    if (currentTime.isAfter(start) && currentTime.isBefore(end)) {
      // console.log('in bounds');
      return true;
    }
    return false;
  };
  return (
    <View style={styles.loginCard}>
      {!isLoggedIn && isValidTime() ? (
        <>
          <Text style={styles.loginText}>Login for the day</Text>
          <View style={styles.loginActions}>
            <Pressable
              onPress={() => {
                handleLoginTick(setVisible, setIsLoggedIn);
              }}
              style={styles.iconButton}>
              <Icon name="checkmark-circle" size={28} color="green" />
            </Pressable>
            <Pressable
              onPress={() => {
                handleLoginCross(setVisible);
              }}
              style={styles.iconButton}>
              <Icon name="close-circle" size={28} color="red" />
            </Pressable>
          </View>
        </>
      ) : (
        <View style={{}}>
          <Icon name="information-circle-outline" size={28} color={'green'} />
          <Text
            style={[styles.loginText, {textAlign: 'left', fontWeight: '400'}]}>
            Login available from 9AM to 12AM
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loginCard: {
    backgroundColor: '#e6ecf5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  loginText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  loginActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
  },
});

export default AttendanceCard;
