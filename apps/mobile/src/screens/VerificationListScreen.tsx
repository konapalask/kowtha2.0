import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {getItem} from '../helpers/utility';
import {getFieldData, getUserDetails} from '../services/field.services';
import Settings from '../components/Settings';

type VerificationListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VerificationList'
>;

interface VerificationItem {
  id: string;
  applicantName: string;
  age?: number;
  sex?: string;
  applicationNumber?: string;
  applicantAddress?: string;
  verification: {
    id: string;
    type: 'CurrentAddress' | 'PermanentAddress' | 'Work';
    status: 'Pending' | 'In Progress' | 'Completed';
  };
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
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const response = await getFieldData();
      const transformedData = response?.data?.data?.reduce(
        (acc: any[], curr: any) => {
          const {verifications, ...rest} = curr;
          const verificationItems = verifications.map((verification: any) => ({
            ...rest,
            verification: verification,
          }));
          return [...acc, ...verificationItems];
        },
        [],
      );
      setData(transformedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Call fetchData on initial mount
  useEffect(() => {
    fetchData();
  }, []);

  // Call fetchData when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const filterOptions = ['All', 'Pending', 'Completed'];

  const filteredData =
    selectedFilter === 'All'
      ? data
      : data.filter(item => item.verification.status === selectedFilter);

  const getProgressColor = (progress: string) => {
    switch (progress) {
      case 'Pending':
        return '#FFA500';
      case 'In Progress':
        return '#1E90FF';
      case 'Completed':
        return '#32CD32';
      case 'All':
        return '#9370DB';
      default:
        return '#666';
    }
  };

  const getVerificationTypeColor = (type: string) => {
    switch (type) {
      case 'CurrentAddress':
        return '#4A90E2';
      case 'PermanentAddress':
        return '#50C878';
      case 'Work':
        return '#FF6B6B';
      default:
        return '#666';
    }
  };

  const getVerificationTypeLabel = (type: string) => {
    switch (type) {
      case 'CurrentAddress':
        return 'Current Address';
      case 'PermanentAddress':
        return 'Permanent Address';
      case 'Work':
        return 'Work Address';
      default:
        return type;
    }
  };

  const renderFilterOptions = () => (
    <View style={styles.filterContainer}>
      {filterOptions.map(option => (
        <TouchableOpacity
          key={option}
          style={[
            styles.filterBadge,
            selectedFilter === option && [
              styles.selectedFilterBadge,
              {
                backgroundColor: getProgressColor(option),
                borderColor: getProgressColor(option),
              },
            ],
            ,
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
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        const baseNavPayload = {
          name: item.applicantName,
          id: item.id,
          applicationNumber: item.applicationNumber, // Main application ID
          verificationId: item.verification.loanId,
        };

        if (item.verification.type === 'Work') {
          navigation.navigate('WorkVerification', {
            item: baseNavPayload,
            verificationType: 'Work', // Explicitly 'Work'
            userData: item,
          });
        } else {
          // Types for VerificationItemScreen are 'CurrentAddress' or 'PermanentAddress'
          navigation.navigate('VerificationItemScreen', {
            item: baseNavPayload,
            verificationType: item.verification.type, // This will be 'CurrentAddress' or 'PermanentAddress'
            userData: item,
          });
        }
      }}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.applicantName}</Text>
        <View
          style={[
            styles.progressTag,
            {
              backgroundColor: getProgressColor(item.verification.status),
            },
          ]}>
          <Text style={styles.progressText}>{item.verification.status}</Text>
        </View>
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.leftDetails}>
          <Text style={styles.details}>{item.applicationNumber}</Text>
          <Text style={styles.details}>
            Verification Type: {item.verification.type}
          </Text>
        </View>
      </View>
      <Text style={styles.details}>Address: {item.applicantAddress}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Verification List</Text>
        <View
          style={{
            flex: 1,
            alignItems: 'flex-end',
            elevation: 1000,
            zIndex: 1000,
          }}>
          <Settings />
        </View>
      </View>
      {renderFilterOptions()}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.verification.id}
        // keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
    // backgroundColor: '#007AFF',
    // borderColor: '#007AFF',
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
    borderWidth: 1,
    // borderColor: '#666',
  },
  verificationButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    // borderColor: '#666',
    // borderWidth: 1,
    // borderRadius: 8,
  },
});

export default VerificationListScreen;
