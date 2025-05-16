import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {clearAll} from '../helpers/utility';
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
    clearAll();
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

        {visible && (
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
        )}
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
  menuOverlay: {
    position: 'absolute',
    top: 35,
    right: 0,
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
