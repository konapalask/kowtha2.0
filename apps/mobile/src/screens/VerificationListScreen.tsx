import React, {useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type VerificationListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VerificationList'
>;

interface VerificationItem {
  id: string;
  name: string;
  age: number;
  sex: string;
  address: string;
  progress: 'Pending' | 'In Progress' | 'Completed';
}

// Dummy data
const dummyData: VerificationItem[] = [
  {
    id: '1',
    name: 'B. Yedukondalu',
    age: 25,
    sex: 'Male',
    address: 'H.no: 123, Street: 1, City: Amalapuram',
    progress: 'In Progress',
  },
  {
    id: '2',
    name: 'B. Mudukondalu',
    age: 30,
    sex: 'Male',
    address: 'H.no: 456, Street: 2, City: Amalapuram',
    progress: 'Completed',
  },
  // Add more dummy data as needed
];

const VerificationListScreen = () => {
  const navigation = useNavigation<VerificationListScreenNavigationProp>();
  const [data, setData] = useState<VerificationItem[]>(dummyData);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const filterOptions = ['All', 'Pending', 'In Progress', 'Completed'];

  const filteredData =
    selectedFilter === 'All'
      ? data
      : data.filter(item => item.progress === selectedFilter);

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
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('VerificationItem', {item})}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <View
          style={[
            styles.progressTag,
            {backgroundColor: getProgressColor(item.progress)},
          ]}>
          <Text style={styles.progressText}>{item.progress}</Text>
        </View>
      </View>
      <Text style={styles.details}>Age: {item.age}</Text>
      <Text style={styles.details}>Sex: {item.sex}</Text>
      <Text style={styles.details}>Address: {item.address}</Text>
    </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  progressTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  progressText: {
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
});

export default VerificationListScreen;
