import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {getItem} from '../helpers/utility';
import {getFieldData, getUserDetails} from '../services/field.services';

type VerificationListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VerificationList'
>;

interface VerificationItem {
  id: string;
  applicantName: string;
  age: number;
  sex: string;
  address: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  verificationType: 'CurrentAddress' | 'PermanentAddress' | 'Work';
  verifications: Array<{
    type: 'CurrentAddress' | 'PermanentAddress' | 'Work';
  }>;
}

// Dummy data
// const dummyData: VerificationItem[] = [
//   {
//     id: '1',
//     name: 'B. Yedukondalu',
//     age: 25,
//     sex: 'Male',
//     address: 'H.no: 123, Street: 1, City: Amalapuram',
//     status: 'In Progress',
//     verificationType: 'Current Address',
//   },
//   {
//     id: '2',
//     name: 'B. Mudukondalu',
//     age: 30,
//     sex: 'Male',
//     address: 'H.no: 456, Street: 2, City: Amalapuram',
//     status: 'Completed',
//     verificationType: 'Work Address',
//   },
//   // Add more dummy data as needed
// ];

const VerificationListScreen = () => {
  const navigation = useNavigation<VerificationListScreenNavigationProp>();
  const [data, setData] = useState<VerificationItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  useEffect(() => {
    getFieldData().then((response: any) => {
      console.log(response?.data?.data);
      setData(response?.data?.data);
    });
  }, []);

  const filterOptions = ['All', 'Pending', 'In Progress', 'Completed'];

  const filteredData =
    selectedFilter === 'All'
      ? data
      : data.filter(item => item.status === selectedFilter);

  const getProgressColor = (progress: string) => {
    switch (progress) {
      case 'Pending':
        return '#FFA500';
      case 'In Progress':
        return '#1E90FF';
      case 'Completed':
        return '#32CD32';
      default:
        return '#666';
    }
  };

  const getVerificationTypeColor = (type: string) => {
    switch (type) {
      case 'Current Address':
        return '#4A90E2';
      case 'Permanent Address':
        return '#50C878';
      case 'Work Address':
        return '#FF6B6B';
      default:
        return '#666';
    }
  };

  const renderFilterOptions = () => (
    <View style={styles.filterContainer}>
      {filterOptions.map(option => (
        <TouchableOpacity
          key={option}
          style={[
            styles.filterBadge,
            selectedFilter === option && styles.selectedFilterBadge,
          ]}
          onPress={() => setSelectedFilter(option)}>
          <Text
            style={[
              styles.filterText,
              selectedFilter === option && styles.selectedFilterText,
            ]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderItem = ({item}: {item: VerificationItem}) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.applicantName}</Text>
        <View
          style={[
            styles.verificationTypeTag,
            {backgroundColor: getVerificationTypeColor(item.verificationType)},
          ]}>
          <Text style={styles.verificationTypeText}>
            {item.verificationType}
          </Text>
        </View>
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.leftDetails}>
          <Text style={styles.details}>Age: {item.age}</Text>
          <Text style={styles.details}>Sex: {item.sex}</Text>
        </View>
        <View
          style={[
            styles.progressTag,
            {backgroundColor: getProgressColor(item.status)},
          ]}>
          <Text style={styles.progressText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.details}>Address: {item.address}</Text>
      <View style={styles.verificationButtonsContainer}>
        {item.verifications.map((verification, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.verificationButton,
              {backgroundColor: getVerificationTypeColor(verification.type)},
            ]}
            onPress={() => {
              if (verification.type === 'Work') {
                navigation.navigate('WorkVerification', {
                  item: {
                    name: item.applicantName || 'bheem',
                    age: item.age || 23,
                    sex: item.sex || 'Male',
                    id: item.id,
                  },
                  verificationType: verification.type,
                });
              } else {
                navigation.navigate('VerificationItemScreen', {
                  item: {
                    name: item.applicantName || 'bheem',
                    age: item.age || 23,
                    sex: item.sex || 'Male',
                    id: item.id,
                  },
                  verificationType: verification.type,
                });
              }
            }}>
            <Text style={styles.verificationButtonText}>
              {verification.type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderFilterOptions()}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leftDetails: {
    flexDirection: 'row',
    gap: 12,
  },
  details: {
    fontSize: 14,
    color: '#666',
  },
  tagContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  progressTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verificationTypeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  verificationTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
    gap: 8,
  },
  filterBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedFilterBadge: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  selectedFilterText: {
    color: '#fff',
  },
  verificationButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 12,
  },
  verificationButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  verificationButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default VerificationListScreen;
