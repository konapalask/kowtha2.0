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
  Linking,
  Pressable,
  // Pressable,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {getFieldData} from '../services/field.services';
import Settings from '../components/Settings';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AttendanceCard from '../components/AttendanceCard';
import {getItem, setItem} from '../helpers/utility';
import dayjs from 'dayjs';
import DeptModal from '../components/DeptModal';
import {useUser} from '../contexts/UserContext';
import {NativeModules} from 'react-native';
const {BuildConfigModule} = NativeModules;

type VerificationListScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'VerificationList'
>;

// type NavigationPayload = {
//   item: {
//     name: string;
//     applicationNumber: string;
//   };
//   verificationType: 'Work' | 'Business' | 'CurrentAddress' | 'PermanentAddress';
//   userData: VerificationItem;
// };

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

const VerificationListScreen = () => {
  const navigation = useNavigation<VerificationListScreenNavigationProp>();
  const {
    currentDept,
    setCurrentDept,
    hasMultipleDepartments,
    availableDepartments,
  } = useUser();
  const [data, setData] = useState<VerificationItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('Pending');
  const [refreshing, setRefreshing] = useState(false);
  const [showAppNumberFilter, setShowAppNumberFilter] = useState(false);
  const [appNumberFilter, setAppNumberFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showAttendanceModal, setShowAttendanceModal] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const disabled = !isLoggedIn;
  const [testUser, setTestUser] = useState(false);
  const [openDeptModal, setOpenDeptModal] = useState(false);
  const [isInternal, setIsInternal] = useState<boolean>(false);
  // const disabled = false;
  // const testUser = await getItem('testUser');
  // const opacity = useRef(new Animated.Value(1)).current;

  const fetchData = async (page = 1, shouldAppend = false, dept?: string) => {
    try {
      setLoading(true);
      const response = await getFieldData(
        page,
        selectedFilter,
        appNumberFilter,
        dept ?? currentDept ?? 'FI',
      );
      await setItem('attendance', {
        status: response?.data?.isAvailableToday ? 'Available' : null,
        date: dayjs().format('YYYY-MM-DD'),
      });
      checkAttendance();
      const allData = response?.data?.data || [];
      const totalPages = allData?.meta?.totalPages;

      setData(prevData =>
        shouldAppend ? [...prevData, ...allData?.items] : allData?.items,
      );
      setHasMore(page < totalPages);
      setPage(page);
    } catch (error) {
      if (!testUser) {
        console.error('Error fetching data:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to fetch verifications',
          position: 'top',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentDept = (dept: string) => {
    setCurrentDept(dept);
    setOpenDeptModal(false);
    // fetchData(1, false, dept);
  };

  useEffect(() => {
    const checkTestUserAndSetData = async () => {
      const testUser = await getItem('testUser');
      setTestUser(testUser);
      if (testUser) {
        // Use the provided dummy data structure
        const dummyItems: VerificationItem[] = [
          {
            id: '206',
            loanId: '99',
            type: 'Business',
            status: 'Pending',
            applicantAddress: 'Sree krishna sai residency, Kondapur',
            loan: {
              applicationNumber: 'ABHF-00020',
              applicantName: 'Prem',
            },
          },
          {
            id: '166',
            loanId: '78',
            type: 'AddressOne',
            status: 'Pending',
            applicantAddress: 'Kondapur',
            loan: {
              applicationNumber: 'ABHF-00002',
              applicantName: 'Conduit',
            },
          },
          {
            id: '300',
            loanId: '120',
            type: 'Work',
            status: 'Completed',
            applicantAddress: 'Madhapur',
            loan: {
              applicationNumber: 'ABHF-00099',
              applicantName: 'Test Completed',
            },
          },
        ];
        setData(dummyItems);
        setHasMore(false);
      } else {
        fetchData(1, false);
      }
    };
    checkTestUserAndSetData();
  }, []);

  const checkAttendance = async () => {
    try {
      const details = await getItem('attendance');
      const currentTime = dayjs();
      const isToday = details?.date === currentTime.format('YYYY-MM-DD');
      isToday && details?.status === 'Available'
        ? setIsLoggedIn(true)
        : setIsLoggedIn(false);
    } catch (error) {
      console.log(error);
    }
  };

  const validTime = () => {
    const currentTime = dayjs();
    const start = currentTime.clone().hour(9).minute(0).second(0);
    const end = currentTime.clone().hour(12).minute(0).second(0);

    if (currentTime.isAfter(start) && currentTime.isBefore(end)) {
      return true;
    }
    return false;
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData(1, false, currentDept);
      checkAttendance();
    }, [currentDept]),
  );

  useEffect(() => {
    fetchData(1, false);
  }, [selectedFilter, appNumberFilter]);

  useEffect(() => {
    // Check if this is an internal build
    const checkIsInternal = async () => {
      try {
        const result = await BuildConfigModule.isInternal();
        setIsInternal(result === true);
      } catch (error) {
        console.error('Error checking isInternal:', error);
        setIsInternal(false);
      }
    };
    checkIsInternal();
  }, []);

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

  // export const applicantTypeOptions = [
  //   { label: "Primary Applicant", value: "Primary Applicant" },
  //   { label: "Co-applicant 1 ", value: "Co-applicant 1" },
  //   { label: "Co-applicant 2 ", value: "Co-applicant 2" },
  //   { label: "Co-applicant 3 ", value: "Co-applicant 3" },
  //   { label: "Co-applicant 4 ", value: "Co-applicant 4" },
  //   { label: "Co-applicant 5 ", value: "Co-applicant 5" },
  //   { label: "Co-applicant 6 ", value: "Co-applicant 6" },
  //   { label: "Guarantor", value: "Guarantor" },
  // ];

  // const getApplicantTypeColor = (type: string) => {
  //   switch (type) {
  //     case 'Primary Applicant':
  //       return '#2563EB';
  //     case 'Co-applicant 1':
  //       return '#10B981';
  //     case 'Co-applicant 2':
  //       return '#10B981';
  //     case 'Co-applicant 3':
  //       return '#10B981';
  //     case 'Co-applicant 4':
  //       return '#10B981';
  //     case 'Co-applicant 5':
  //       return '#10B981';
  //     case 'Co-applicant 6':
  //       return '#10B981';
  //     case 'Guarantor':
  //       return '#A16207';
  //     default:
  //       return '#666';
  //   }
  // };

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

  const formattedLoanAmount = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return num.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    });
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

  const handleGetStarted = (item: any) => {
    // console.log('item', item);
    // onPress={() => {
    if (!disabled) {
      if (item?.status === 'Pending') {
        const baseNavPayload = {
          name: item?.loan?.applicantName,
          applicationNumber: item?.loan?.applicationNumber || '',
          id: item?.id,
          verificationId: item?.loanId,
          address: item?.applicantAddress,
          businessName: item?.businessName,
          currentOfficeName: item?.currentOfficeName,
        };
        if (item?.type === 'Work') {
          navigation.navigate('WorkVerification' as any, {
            item: baseNavPayload,
            verificationType: 'Work',
            userData: item,
          });
        } else if (item?.type === 'Business') {
          navigation.navigate(
            currentDept === 'FI'
              ? 'BusinessVerification'
              : ('PDVerification' as any),
            {
              item: baseNavPayload,
              verificationType: 'Business',
              userData: item,
            },
          );
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
          // text2: `for application ${item?.applicationNumber || 'N/A'}.`,
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } else {
      Toast.show({
        type: 'info',
        text1: 'Please sign in your attendance',
        // text2: `for application ${item?.applicationNumber || 'N/A'}.`,
        position: 'top',
        visibilityTime: 3000,
      });
    }
    // }}
  };

  const callNumber = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderItem = ({item}: {item: any}) => (
    <View
      // disabled={disabled}
      style={styles.card}>
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
      </View>
      <View style={styles.detailsRow}>
        <View
          style={[
            styles.verificationTypeTag,
            {
              backgroundColor: '#64748B',
            },
          ]}>
          <Text style={styles.verificationTypeText}>
            {item?.loan?.applicationNumber}
          </Text>
        </View>
        {!!item?.loan?.loanAmount && (
          <View>
            {currentDept === 'FI' && <View style={styles.verticalDivider} />}
            <Text style={styles.details}>
              ₹{formattedLoanAmount(item?.loan?.loanAmount)}
            </Text>

            {currentDept === 'FI' && <View style={styles.verticalDivider} />}
          </View>
        )}
        {currentDept === 'FI' && (
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
        )}
      </View>
      <View style={styles.detailsRow}>
        <Text style={styles.details}>{item?.loan?.applicantType}</Text>
        {item?.loan?.applicantMobile && (
          <TouchableOpacity
            onPress={() => {
              callNumber(item?.loan?.applicantMobile);
            }}>
            <Text style={[styles.details, styles.mobileText]}>
              +91-{item?.loan?.applicantMobile}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {item?.loan?.loanType && currentDept === 'FI' && (
        <Text style={[styles.details, styles.addressText]}>
          {item?.loan?.loanType}
        </Text>
      )}
      {item?.businessName && (
        <Text style={[styles.details, styles.addressText]}>
          {item?.businessName}
        </Text>
      )}
      {item?.loan?.bankName && (
        <Text style={[styles.details, styles.addressText]}>
          {item?.displayName}
        </Text>
      )}
      {item?.applicantAddress && (
        <Text style={[styles.details, styles.addressText, {marginBottom: 12}]}>
          {item?.applicantAddress}
        </Text>
      )}
      {item?.status === 'Pending' && (
        <TouchableOpacity
          style={[
            styles.getStartedButton,
            !isLoggedIn && styles.disabledButton,
          ]}
          onPress={async () => {
            if (!isLoggedIn) {
              setShowAttendanceModal(true);
              Toast.show({
                type: 'error',
                text1: 'Please sign in your attendance',
                position: 'top',
                visibilityTime: 3000,
              });
              return;
            }
            handleGetStarted(item);
          }}>
          <View style={styles.getStartedButtonAlignment}>
            <Text style={styles.getStartedButtonText}>
              {currentDept === 'FI' ? 'Proceed' : 'Start'}
            </Text>
            <Icon
              name="arrow-forward"
              size={16}
              color="orange" // or any color that fits your style
              style={{marginLeft: 6}}
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {showAttendanceModal && !isLoggedIn && validTime() && (
        <View style={styles.attendanceModalOverlay}>
          <View style={styles.attendanceModalContent}>
            <AttendanceCard
              setVisible={setShowAttendanceModal}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              dept={currentDept}
            />
          </View>
        </View>
      )}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Verification List</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            elevation: 1000,
            zIndex: 1000,
          }}>
          {hasMultipleDepartments ? (
            <Pressable
              onPress={() => {
                setOpenDeptModal(true);
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text>{currentDept}</Text>
                <Icon name="repeat" size={24} color="#666" />
              </View>
            </Pressable>
          ) : (
            // availableDepartments.length > 0 && (
            //   <View style={styles.deptTag}>
            //     <Text style={styles.deptTagText}>{currentDept}</Text>
            //   </View>
            // )
            <></>
          )}
          <Settings isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </View>
      </View>
      {renderFilterOptions()}
      {data?.length === 0 && !loading ? (
        <View style={styles.noResultsContainer}>
          <Icon name="search-off" size={48} color="#999" />
          <Text style={styles.noResultsText}>
            No matching applications found
          </Text>
          <TouchableOpacity onPress={() => fetchData(1, false)}>
            <Text
              style={{
                color: '#007AFF',
                marginTop: 12,
                fontWeight: 'bold',
                fontSize: 16,
              }}>
              Refresh
            </Text>
          </TouchableOpacity>
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
      {/* <View>
        <Text>{BuildConfigModule.isInternal()}</Text>
      </View> */}
      {openDeptModal && (
        <DeptModal
          currentDept={currentDept}
          setCurrentDept={updateCurrentDept}
          openDeptModal={openDeptModal}
          setOpenDeptModal={setOpenDeptModal}
          availableDepartments={availableDepartments}
        />
      )}

      {/* QA Forms Testing FAB - Development Only */}
      {isInternal && (
        <TouchableOpacity
          style={styles.qaFab}
          onPress={() => navigation.navigate('QAFormTesting' as any)}>
          <Icon name="assignment" size={24} color="#fff" />
          <Text style={styles.qaFabText}>QA Internal</Text>
        </TouchableOpacity>
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
  deptTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  deptTagText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
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
  mobileText: {
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
  getStartedButton: {
    backgroundColor: 'transparent',
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
    // borderColor: 'orange',
    // borderWidth: 1,
    // marginTop: 8,
  },
  getStartedButtonText: {
    color: 'orange',
    fontWeight: '600',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
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
    top: 10,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    // justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  attendanceModalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  attendanceModalContent: {
    backgroundColor: '#e6ecf5',
    borderRadius: 12,
    // padding: 10,
    alignItems: 'center',
    minWidth: 280,
    elevation: 10,
    height: 120,
  },
  closeAttendanceModalBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    zIndex: 10,
  },
  verticalDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E5E7EB', // Tailwind's gray-200
    marginHorizontal: 1,
  },
  getStartedButtonAlignment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qaFab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF9500',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1000,
  },
  qaFabText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
});

export default VerificationListScreen;
