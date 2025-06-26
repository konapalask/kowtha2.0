import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Pressable,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {clearAll, clearItem, getItem} from '../helpers/utility';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import AttendanceCard from './AttendanceCard';
import dayjs from 'dayjs';

type SettingsListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VerificationList'
>;

const fetchUserDetails = async () => {
  return await getItem('userDetails');
};

const Settings: React.FC<{isLoggedIn: boolean; setIsLoggedIn: any}> = ({
  isLoggedIn,
  setIsLoggedIn,
}) => {
  const navigation = useNavigation<SettingsListScreenNavigationProp>();
  const [visible, setVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  // const userDetails: any = fetchUserDetails();
  // console.log(userDetails);
  const [userDetails, setUserDetails] = useState<any>({});
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const details = await getItem('userDetails');
        setUserDetails(details);
      } catch (error) {
        console.log(error);
      }
    };

    // const checkAttendance = async () => {
    //   try {
    //     const details = await getItem('attendance');
    //     const isLoggedIn = details?.date === dayjs().format('YYYY-MM-DD');
    //     setIsLoggedIn(isLoggedIn);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    fetchUserDetails();
    // checkAttendance();
  }, []);

  const toggleMenu = () => setVisible(!visible);

  const handleProfilePress = () => {
    setVisible(false);
    setTimeout(() => setProfileModalVisible(true), 200);
  };

  const handleLogout = () => {
    clearItem('accessToken');
    clearItem('refreshToken');
    // clearItem('attendance');
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={toggleMenu}>
          <Icon name="person-outline" size={24} color="#000" />
        </TouchableOpacity>

        <Modal
          visible={visible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setVisible(false)}>
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setVisible(false)}>
            <View style={styles.menuOverlay}>
              <Pressable style={styles.menuItem} onPress={handleProfilePress}>
                <Icon name="person" size={20} color="#000" />
                <Text style={styles.menuText}>Profile</Text>
              </Pressable>
              <Pressable style={styles.menuItem} onPress={handleLogout}>
                <Icon name="log-out-outline" size={20} color="#000" />
                <Text style={styles.menuText}>Logout</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      </View>

      <Modal
        visible={profileModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setProfileModalVisible(false)}>
        <Pressable
          style={styles.profileModalOverlay}
          onPress={() => setProfileModalVisible(false)}>
          <Pressable
            style={styles.profileModalContent}
            onPress={e => e.stopPropagation()}>
            {/* Top Card: Profile Info */}
            <View style={styles.profileCard}>
              <Text style={styles.profileTitle}>Profile</Text>
              <View style={styles.profileFieldRow}>
                <Text style={styles.profileFieldLabel}>Name:</Text>
                <Text style={styles.profileFieldValue}>
                  {userDetails?.name}
                </Text>
              </View>
              <View style={styles.profileFieldRow}>
                <Text style={styles.profileFieldLabel}>Employee Code:</Text>
                <Text style={styles.profileFieldValue}>
                  {userDetails?.employeeCode}
                </Text>
              </View>
              <View style={styles.profileFieldRow}>
                <Text style={styles.profileFieldLabel}>Role:</Text>
                <Text style={styles.profileFieldValue}>
                  {userDetails?.role}
                </Text>
              </View>
            </View>
            <AttendanceCard
              setVisible={setVisible}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  menuContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 45,
    paddingRight: 10,
  },
  menuOverlay: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#000',
  },
  profileModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileCard: {
    backgroundColor: '#e6ecf5',
    // backgroundColor: '#e6ecf5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profileFieldLabel: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  profileFieldValue: {
    flex: 1,
  },
});

export default Settings;
