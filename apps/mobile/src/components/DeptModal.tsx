import React from 'react';
import {View, Text, Modal, StyleSheet, TouchableOpacity} from 'react-native';
import {setItem} from '../helpers/utility';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface DeptModalProps {
  currentDept: string;
  setCurrentDept: (value: string) => void;
  openDeptModal: boolean;
  setOpenDeptModal: (value: boolean) => void;
  availableDepartments: string[];
}

const DeptModal: React.FC<DeptModalProps> = ({
  setCurrentDept,
  currentDept,
  openDeptModal,
  setOpenDeptModal,
  availableDepartments,
}) => {
  const handleDeptSelect = async (dept: string) => {
    try {
      setCurrentDept(dept);
      await setItem('dept', dept);
      //   setOpenDeptModal(false);
    } catch (error) {
      console.error('Error saving department:', error);
    }
  };

  return (
    <Modal
      visible={openDeptModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setOpenDeptModal(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Select Department</Text>

          {availableDepartments.map(dept => (
            <TouchableOpacity
              key={dept}
              style={[
                styles.optionButton,
                {
                  backgroundColor:
                    currentDept === dept ? '#f0f0f0' : 'transparent',
                },
              ]}
              onPress={() => handleDeptSelect(dept)}>
              <Text style={styles.optionText}>{dept}</Text>
              {currentDept === dept && (
                <Icon name="check" size={24} color="green" />
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setOpenDeptModal(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
  },
  cancelButtonText: {
    color: 'red',
    fontSize: 16,
  },
});

export default DeptModal;
