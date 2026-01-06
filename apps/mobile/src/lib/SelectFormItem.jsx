import React, {useRef} from 'react';
import {Controller} from 'react-hook-form';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';

export const SelectFormItem = ({data}) => {
  const actionSheetRef = useRef(null);
  const scrollViewRef = useRef(null);
  const lastScrollTimeRef = useRef(0);
  const isScrollingRef = useRef(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {data.title}{' '}
        {data?.required !== false && <Text style={styles.required}>*</Text>}
      </Text>

      <Controller
        defaultValue={data?.defaultValue || ''}
        control={data.control}
        name={data.key}
        rules={{
          required: {value: data?.required !== false, message: 'Required'},
          ...data?.rules,
        }}
        render={({field: {onChange, value}, fieldState: {error}}) => {
          const selectedOption = data?.options?.find(opt => opt.id === value);
          const displayText = selectedOption?.name || 'Select an option';
          const hasValue = selectedOption !== undefined;

          return (
            <>
              <TouchableOpacity
                style={[styles.selector, error && styles.errorBorder]}
                onPress={() => {
                  isScrollingRef.current = false; // Reset scroll state when opening
                  lastScrollTimeRef.current = 0;
                  actionSheetRef.current?.show();
                }}>
                <Text
                  style={[{color: hasValue ? '#000' : '#999', fontSize: 14}]}>
                  {displayText}
                </Text>
              </TouchableOpacity>

              <ActionSheet
                ref={actionSheetRef}
                containerStyle={styles.actionSheet}
                onOpen={() => {
                  isScrollingRef.current = false;
                  lastScrollTimeRef.current = 0;
                }}>
                <View style={styles.actionSheetContent}>
                  <Text style={styles.sheetTitle}>{data.title}</Text>
                  <ScrollView
                    ref={scrollViewRef}
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                    onScrollBeginDrag={() => {
                      isScrollingRef.current = true;
                      lastScrollTimeRef.current = Date.now();
                    }}
                    onScrollEndDrag={() => {
                      lastScrollTimeRef.current = Date.now();
                      // Very short delay to ensure scroll has ended
                      setTimeout(() => {
                        isScrollingRef.current = false;
                      }, 50);
                    }}
                    onMomentumScrollBegin={() => {
                      isScrollingRef.current = true;
                      lastScrollTimeRef.current = Date.now();
                    }}
                    onMomentumScrollEnd={() => {
                      lastScrollTimeRef.current = Date.now();
                      setTimeout(() => {
                        isScrollingRef.current = false;
                      }, 50);
                    }}
                    scrollEventThrottle={16}>
                    {data?.options?.map(item => {
                      // Use onPressIn if 7 or fewer options (for immediate response)
                      // Use onPress if more than 7 options (to avoid conflicts with scrolling)
                      const hasManyOptions = (data?.options?.length || 0) > 7;

                      const handleSelect = () => {
                        if (!isScrollingRef.current) {
                          if (
                            !hasManyOptions ||
                            lastScrollTimeRef.current === 0
                          ) {
                            // Few options or no scroll has happened, allow immediate selection
                            onChange(item.id);
                            actionSheetRef.current?.hide();
                          } else {
                            // Many options and scroll has occurred - check if enough time has passed
                            const timeSinceScroll =
                              Date.now() - lastScrollTimeRef.current;
                            if (timeSinceScroll > 100) {
                              onChange(item.id);
                              actionSheetRef.current?.hide();
                            }
                          }
                        }
                      };

                      return (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.sheetItem}
                          activeOpacity={0.7}
                          {...(hasManyOptions
                            ? {onPress: handleSelect}
                            : {onPressIn: handleSelect})}
                          delayPressIn={0}>
                          <Text style={styles.sheetText}>{item.name}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </ActionSheet>
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {marginVertical: 8},
  label: {color: '#000', fontSize: 14, marginBottom: 4},
  required: {color: 'red'},
  selector: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
  },
  errorBorder: {
    borderColor: 'red',
  },
  errorText: {color: 'red', fontSize: 12, marginTop: 4, marginBottom: 4},
  actionSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  actionSheetContent: {
    padding: 16,
    paddingBottom: 50,
    // maxHeight: 500,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  scrollView: {
    maxHeight: 400,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sheetItem: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  sheetText: {fontSize: 16, color: '#000'},
});
