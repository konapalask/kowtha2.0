import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  Animated,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {getFieldData} from '../services/field.services';
import Settings from '../components/Settings';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AttendanceCard from '../components/AttendanceCard';

type VerificationListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VerificationList'
>;

type NavigationPayload = {
  item: {
    name: string;
    applicationNumber: string;
  };
  verificationType: 'Work' | 'Business' | 'CurrentAddress' | 'PermanentAddress';
  userData: VerificationItem;
};

interface VerificationItem {
  id: string;
  type: 'AddressOne' | 'AddressTwo' | 'Work' | 'Business';
  status: 'Pending' | 'In Progress' | 'Completed';
  loanId: string;
  applicantAddress: string;
  loan: {
    applicantName: string;
    applicationNumber: string;
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
  const [selectedFilter, setSelectedFilter] = useState<string>('Pending');
  const [refreshing, setRefreshing] = useState(false);
  const [showAppNumberFilter, setShowAppNumberFilter] = useState(false);
  const [appNumberFilter, setAppNumberFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;
  const [showAttendanceModal, setShowAttendanceModal] = useState(true);

  const opacity = useRef(new Animated.Value(1)).current;
  // useEffect(() => {
  //   if (status === 'pending') {
  //     Animated.loop(
  //       Animated.sequence([
  //         Animated.timing(opacity, {
  //           toValue: 0,
  //           duration: 500,
  //           useNativeDriver: true,
  //         }),
  //         Animated.timing(opacity, {
  //           toValue: 1,
  //           duration: 500,
  //           useNativeDriver: true,
  //         }),
  //       ]),
  //     ).start();
  //   } else {
  //     opacity.setValue(1);
  //   }
  // }, [status]);

  const fetchData = async (page = 1, shouldAppend = false) => {
    try {
      setLoading(true);
      const response = await getFieldData(page, selectedFilter);
      const allData = response?.data?.data || [];
      // console.log(allData);

      // Handle pagination on frontend
      // const startIndex = (page - 1) * PAGE_SIZE;
      // const endIndex = startIndex + PAGE_SIZE;
      // const paginatedData = allData.slice(startIndex, endIndex);
      const totalPages = allData?.meta?.totalPages;

      setData(prevData =>
        shouldAppend ? [...prevData, ...allData?.items] : allData?.items,
      );
      setHasMore(page < totalPages);
      setPage(page);
    } catch (error) {
      console.error('Error fetching data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch verifications',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  // Call fetchData on initial mount
  useEffect(() => {
    fetchData(1, false);
  }, []);

  // Call fetchData when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchData(1, false);
    }, []),
  );

  // Call fetchData when filter changes
  useEffect(() => {
    fetchData(1, false);
  }, [selectedFilter]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(1, false);
    setRefreshing(false);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchData(page + 1, true);
    }
  };

  const filterOptions = ['Pending', 'Completed'];

  // const filteredData = data
  //   .filter(
  //     item =>
  //       selectedFilter === 'All' || item.verification.status === selectedFilter,
  //   )
  //   .filter(
  //     item =>
  //       !appNumberFilter ||
  //       (item.applicationNumber &&
  //         item.applicationNumber
  //           .toLowerCase()
  //           .includes(appNumberFilter.toLowerCase())),
  //   );

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 2,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    );

    if (data.some(item => item?.status === 'Pending')) {
      pulse.start();
    } else {
      scaleAnim.setValue(1);
      pulse.stop();
    }

    return () => pulse.stop();
  }, [data]);

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
      case 'AddressTwo':
        return '#4A90E2';
      case 'AddressOne':
        return '#893f91';
      case 'Work':
        return '#FF6B6B';
      default:
        return '#666';
    }
  };

  const getVerificationTypeLabel = (type: string) => {
    switch (type) {
      case 'AddressTwo':
        return 'Address 2';
      case 'AddressOne':
        return 'Address 1';
      default:
        return type;
    }
  };

  const renderFilterOptions = () => (
    <View style={styles.filterContainer}>
      <View style={styles.filterRow}>
        <View style={styles.statusFilters}>
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
        <TouchableOpacity
          style={[
            styles.filterIcon,
            showAppNumberFilter && styles.filterIconActive,
          ]}
          onPress={() => {
            setShowAppNumberFilter(!showAppNumberFilter);
            if (!showAppNumberFilter) {
              setAppNumberFilter('');
            }
          }}>
          <Icon
            name="filter-list"
            size={24}
            color={showAppNumberFilter ? '#007AFF' : '#666'}
          />
        </TouchableOpacity>
      </View>
      {showAppNumberFilter && (
        <View style={styles.appNumberFilterContainer}>
          <TextInput
            style={styles.appNumberInput}
            placeholder="Filter by application number"
            value={appNumberFilter}
            onChangeText={setAppNumberFilter}
            placeholderTextColor="#999"
            autoFocus={true}
          />
          {appNumberFilter ? (
            <TouchableOpacity
              style={styles.clearFilter}
              onPress={() => setAppNumberFilter('')}>
              <Icon name="close" size={20} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </View>
  );

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (item?.status === 'Pending') {
          const baseNavPayload = {
            name: item?.loan?.applicantName,
            applicationNumber: item?.loan?.applicationNumber || '',
            id: item?.id,
            verificationId: item?.loanId,
            address: item?.applicantAddress,
          };
          if (item?.type === 'Work') {
            navigation.navigate('WorkVerification' as any, {
              item: baseNavPayload,
              verificationType: 'Work',
              userData: item,
            });
          } else if (item?.type === 'Business') {
            navigation.navigate('BusinessVerification' as any, {
              item: baseNavPayload,
              verificationType: 'Business',
              userData: item,
            });
          } else {
            navigation.navigate('VerificationItemScreen' as any, {
              item: baseNavPayload,
              verificationType: item?.type,
              // item?.type === 'AddressOne'
              //   ? 'CurrentAddress'
              //   : 'PermanentAddress',
              userData: item,
            });
          }
        } else {
          Toast.show({
            type: 'info',
            text1: `${getVerificationTypeLabel(
              item?.type,
            )} verification is completed`,
            text2: `for application ${item?.applicationNumber || 'N/A'}.`,
            position: 'bottom',
            visibilityTime: 3000,
          });
        }
      }}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item?.loan.applicantName}</Text>

        <View style={styles.statusDotWrapper}>
          {item?.status === 'Pending' && (
            <Animated.View
              style={[
                styles.dotAura,
                {
                  transform: [{scale: scaleAnim}],
                  opacity: scaleAnim.interpolate({
                    inputRange: [1, 2],
                    outputRange: [0.4, 0],
                  }),
                },
              ]}
            />
          )}
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  item?.status === 'Pending'
                    ? '#FFA500'
                    : item?.status === 'Completed'
                    ? '#32CD32'
                    : 'transparent',
              },
            ]}
          />
        </View>
        {/* <Animated.View style={[styles.detailsRow,{item.verification.status==="Pending"?"orange":"green",opacity}]} /> */}
      </View>
      <View style={styles.detailsRow}>
        <Text style={styles.details}>{item?.loan?.applicationNumber}</Text>
        <View
          style={[
            styles.verificationTypeTag,
            {
              backgroundColor: getVerificationTypeColor(item?.type),
            },
          ]}>
          <Text style={styles.verificationTypeText}>
            {getVerificationTypeLabel(item?.type)}
          </Text>
        </View>
      </View>
      {item?.applicantAddress && (
        <Text style={[styles.details, styles.addressText]}>
          {item?.applicantAddress}
        </Text>
      )}
    </TouchableOpacity>
  );

  const handleCloseAttendanceModal = () => {
    setShowAttendanceModal(false);
    // Use the same toast as AttendanceCard's red cross
    if (typeof Toast !== 'undefined') {
      Toast.show({
        type: 'error',
        text1: 'Login Cancelled',
        text2: 'You cancelled the login.',
        position: 'bottom',
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Attendance Modal Overlay */}
      {showAttendanceModal && (
        <View style={styles.attendanceModalOverlay}>
          <Pressable style={styles.attendanceModalBackground} onPress={handleCloseAttendanceModal} />
          <View style={styles.attendanceModalContent}>
            <AttendanceCard />
            <TouchableOpacity onPress={handleCloseAttendanceModal} style={styles.closeAttendanceModalBtn}>
              <Icon name="close" size={28} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      )}
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
      {data?.length === 0 && !loading ? (
        <View style={styles.noResultsContainer}>
          <Icon name="search-off" size={48} color="#999" />
          <Text style={styles.noResultsText}>
            No matching applications found
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && hasMore ? (
              <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color="#007AFF" />
              </View>
            ) : null
          }
        />
      )}
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
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  addressText: {
    marginTop: 4,
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  statusFilters: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  filterIcon: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
  },
  filterIconActive: {
    backgroundColor: '#E3F2FD',
  },
  appNumberFilterContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  appNumberInput: {
    flex: 1,
    height: 40,
    color: '#333',
    fontSize: 14,
  },
  clearFilter: {
    padding: 4,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  statusDotWrapper: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    zIndex: 2,
  },

  dotAura: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 12,
    backgroundColor: '#FFA500',
    zIndex: 1,
  },
  loadingFooter: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  attendanceModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  attendanceModalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  attendanceModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    minWidth: 280,
    elevation: 10,
  },
  closeAttendanceModalBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    zIndex: 10,
  },
});

export default VerificationListScreen;
