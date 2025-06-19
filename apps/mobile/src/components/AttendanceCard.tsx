import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import {postAttendanceApi} from '../services/user.services';
import dayjs from 'dayjs';
import {getItem, setItem} from '../helpers/utility';

const handleLoginTick = async (setVisible: (val: boolean) => void) => {
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
}> = ({setVisible}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const checkAttendance = async () => {
      try {
        const details = await getItem('attendance');
        const currentTime = dayjs();
        const isToday = details?.date === currentTime.format('YYYY-MM-DD');

        const start = currentTime.clone().hour(7).minute(0).second(0);
        const end = currentTime.clone().hour(11).minute(0).second(0);

        if (currentTime.isAfter(start) && currentTime.isBefore(end)) {
          console.log('in bounds');
          setIsLoggedIn(isToday);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkAttendance();
  }, []);
  return (
    <View style={styles.loginCard}>
      {!isLoggedIn && (
        <>
          <Text style={styles.loginText}>Login for the day</Text>
          <View style={styles.loginActions}>
            <Pressable
              onPress={() => {
                handleLoginTick(setVisible);
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
      )}
      {isLoggedIn && (
        <View style={{}}>
          <Icon name="information-circle-outline" size={28} color={'green'} />
          <Text
            style={[styles.loginText, {textAlign: 'left', fontWeight: '400'}]}>
            Login available from 7AM to 11AM
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
