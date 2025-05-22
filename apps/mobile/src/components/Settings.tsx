import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Pressable,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {clearAll, clearItem} from '../helpers/utility';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type SettingsListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VerificationList'
>;

const Settings = () => {
  const navigation = useNavigation<SettingsListScreenNavigationProp>();
  const [visible, setVisible] = useState(false);

  const toggleMenu = () => setVisible(!visible);

  const handleProfilePress = () => {
    // Handle profile navigation here
    setVisible(false);
  };

  const handleLogout = () => {
    clearItem('accessToken');
    clearItem('refreshToken');
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
});

export default Settings;
