import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  Button,
} from 'react-native';
import {colors} from '../../constants/colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import GetLocation from 'react-native-get-location';
import {getItem} from '../../helpers/utility';
import dayjs from 'dayjs';
import {verificationRetryApi} from '../../services/field.services';
import {useForm, Controller} from 'react-hook-form';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';

interface InvestigableProps {
  isInvestigable: boolean | null;
  setIsInvestigable: (value: boolean | null) => void;
  // reason?: string;
  // setReason?: (value: string) => void;
  onYes: () => void;
  item: any;
}

const Investigable: React.FC<InvestigableProps> = ({
  isInvestigable,
  setIsInvestigable,
  onYes,
  item,
  // reason,
  // setReason,
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useForm<{
    reason: string;
    date: Date | null;
    geoTag: string;
  }>({
    defaultValues: {
      reason: '',
      date: dayjs().toDate(),
      geoTag: '',
    },
  });
  const navigation = useNavigation<any>();
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  // const geoTag = watch('geoTag');
  const selectedDate = watch('date');
  const [userDetails, setUserDetails] = useState<any>({});
  // console.log(userDetails);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const details = await getItem('userDetails');
        setUserDetails(details);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        const {latitude, longitude} = location;
        setValue('geoTag', `${latitude},${longitude}`);
      })
      .catch(error => {
        console.error('Error getting location:', error);
        setValue('geoTag', 'Location not available');
      });
  }, [setValue]);

  // useEffect(() => {
  //   if (Platform.OS === 'android') {
  //     RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
  //       interval: 10000,
  //     })
  //       .then(data => {
  //         // Location enabled
  //       })
  //       .catch(err => {
  //         Alert.alert(
  //           'Location Required',
  //           'Please enable GPS/location services to continue.',
  //           [
  //             {
  //               text: 'OK',
  //               onPress: () => {},
  //             },
  //           ],
  //           {cancelable: false},
  //         );
  //       });
  //   }
  // }, []);

  const handleConfirm = (date: Date) => {
    setValue('date', date);
    setDatePickerVisible(false);
  };

  const formattedDate = selectedDate
    ? dayjs(selectedDate).format('DD-MM-YYYY')
    : '';

  const onSubmit = async (data: any) => {
    // if (!data.geoTag || !data.date || !data.reason) {
    //   Alert.alert('Error', 'Geo Tag, Date, and Reason are mandatory.');
    //   return;
    // }
    try {
      const payload = {
        verificationId: item?.id,
        date: dayjs(data.date).toISOString(),
        geotag: data.geoTag,
        address: item?.address,
        reason: data.reason,
        fieldExecutiveId: Number(userDetails?.sub),
      };
      await verificationRetryApi(payload);
      Toast.show({
        type: 'success',
        text1: 'Submitted Successfully',
        position: 'top',
      });
      navigation.goBack();
    } catch (error: any) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || '',
        position: 'top',
      });
    }
  };

  return (
    <View style={styles.card}>
      {/* <Text style={styles.question}>Can this loan be investigated?</Text> */}
      <View style={styles.radioGroup}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => {
            setIsInvestigable(true);
            onYes();
          }}>
          <View
            style={[
              styles.radioCircle,
              isInvestigable === true && styles.selectedRadio,
            ]}
          />
          <Text style={styles.radioLabel}>No</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setIsInvestigable(false)}>
          <View
            style={[
              styles.radioCircle,
              isInvestigable === false && styles.selectedRadio,
            ]}
          />
          <Text style={styles.radioLabel}>Yes</Text>
        </TouchableOpacity>
      </View>
      {isInvestigable === false && (
        <View style={styles.inputContainer}>
          {/* Geo Tag Field */}
          <Text style={styles.label}>Geo Tag</Text>
          <Controller
            control={control}
            name="geoTag"
            rules={{required: true}}
            render={({field: {value}}) => (
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={value}
                editable={false}
                placeholder="Geo Tag"
              />
            )}
          />
          {errors.geoTag && (
            <Text style={{color: 'red'}}>Geo Tag is required</Text>
          )}
          {/* Date Picker Field */}
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.dateField}
            onPress={() => setDatePickerVisible(true)}>
            <Text style={styles.dateText}>
              {formattedDate || 'Select date'}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={() => setDatePickerVisible(false)}
            minimumDate={dayjs().toDate()}
          />
          {errors.date && <Text style={{color: 'red'}}>Date is required</Text>}
          {/* Reason Input */}
          <Text style={styles.label}>Please specify reason</Text>
          <Controller
            control={control}
            name="reason"
            rules={{required: true}}
            render={({field: {onChange, value}}) => (
              <TextInput
                numberOfLines={4}
                style={styles.input}
                placeholder="Enter reason"
                value={value}
                onChangeText={onChange}
                multiline
              />
            )}
          />
          {errors.reason && (
            <Text style={{color: 'red'}}>Reason is required</Text>
          )}
          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}>
            <Text style={styles.submitButtonText}>Submit Verification</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 16,
    margin: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text.primary,
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  selectedRadio: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  radioLabel: {
    fontSize: 16,
    color: colors.text.primary,
  },
  inputContainer: {
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: colors.background,
    minHeight: 40,
  },
  dateField: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    backgroundColor: colors.background,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  disabledInput: {
    backgroundColor: colors.border,
    color: colors.text.primary,
  },
  submitButton: {
    backgroundColor: colors.button.primary.background,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonText: {
    color: colors.button.primary.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Investigable;
