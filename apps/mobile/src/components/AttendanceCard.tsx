import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

const handleLoginTick = () => {
  Toast.show({
    type: 'success',
    text1: 'Login Successful',
    text2: 'You have logged in for the day!',
    position: 'bottom',
  });
};

const handleLoginCross = () => {
  Toast.show({
    type: 'error',
    text1: 'Login Cancelled',
    text2: 'You cancelled the login.',
    position: 'bottom',
  });
};

const AttendanceCard = () => (
  <View style={styles.loginCard}>
    <Text style={styles.loginText}>Login for the day</Text>
    <View style={styles.loginActions}>
      <Pressable onPress={handleLoginTick} style={styles.iconButton}>
        <Icon name="checkmark-circle" size={28} color="green" />
      </Pressable>
      <Pressable onPress={handleLoginCross} style={styles.iconButton}>
        <Icon name="close-circle" size={28} color="red" />
      </Pressable>
    </View>
  </View>
);

const styles = StyleSheet.create({
  loginCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  loginText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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