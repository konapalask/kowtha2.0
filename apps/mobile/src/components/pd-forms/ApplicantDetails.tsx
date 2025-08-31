import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {colors} from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

export type AdditionalDetailsItem = {
  id: string;
  value: string;
  error?: string;
};

type AdditionalDetailsProps = {
  initialData?: AdditionalDetailsItem[];
  onSubmit: (data: AdditionalDetailsItem[]) => void;
  //   onValidationChange?: (isValid: boolean) => void;
};

const AdditionalDetails: React.FC<AdditionalDetailsProps> = ({
  initialData = [{id: Date.now().toString(), value: ''}],
  onSubmit,
  //   onValidationChange,
}) => {
  const [items, setItems] = useState<AdditionalDetailsItem[]>(initialData);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Validate all fields
  const validateAllFields = (
    itemsToValidate: AdditionalDetailsItem[],
  ): boolean => {
    return itemsToValidate.every(item => !validateField(item.value));
  };

  const validateField = (value: string): string => {
    if (!value.trim()) {
      return 'This field is required';
    }
    return '';
  };

  // Update validation status when items change
  //   useEffect(() => {
  //     const isValid = validateAllFields(items);
  //     onValidationChange?.(isValid);
  //   }, [items, onValidationChange]);

  const handleInputChange = (id: string, value: string) => {
    const updatedItems = items.map(item =>
      item.id === id ? {...item, value, error: validateField(value)} : item,
    );
    setItems(updatedItems);
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    const isValid = validateAllFields(items);

    if (isValid) {
      onSubmit(items);
    } else {
      // Add errors to all invalid fields
      setItems(prevItems =>
        prevItems.map(item => ({
          ...item,
          error: validateField(item.value),
        })),
      );
    }
  };

  const addNewField = () => {
    // Only allow adding if all current fields are valid
    if (validateAllFields(items)) {
      const newItem = {id: Date.now().toString(), value: ''};
      setItems(prevItems => [...prevItems, newItem]);
    }
  };

  const removeField = (id: string) => {
    if (items.length > 1) {
      const newItems = items.filter(item => item.id !== id);
      setItems(newItems);

      // If we've already submitted, re-validate after removal
      if (hasSubmitted) {
        const isValid = validateAllFields(newItems);
        if (isValid) {
          onSubmit(newItems);
        }
      }
    }
  };

  const isAddButtonDisabled = items.some(
    item => !item.value.trim() || validateField(item.value),
  );

  // Handle blur to validate individual field
  const handleBlur = (id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? {...item, error: validateField(item.value)} : item,
      ),
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {items.map((item, index) => (
          <View key={item.id} style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <TextInput
                style={[
                  styles.input,
                  item.error && styles.inputError,
                  styles.detailInput,
                ]}
                value={item.value}
                onChangeText={text => handleInputChange(item.id, text)}
                onBlur={() => handleBlur(item.id)}
                placeholder={`Additional detail #${index + 1}`}
                placeholderTextColor={colors.text.secondary}
                multiline
                numberOfLines={3}
              />
              {items.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeField(item.id)}>
                  <Icon name="remove-circle" size={24} color={colors.error} />
                </TouchableOpacity>
              )}
            </View>
            {item.error ? (
              <Text style={styles.errorText}>{item.error}</Text>
            ) : null}
          </View>
        ))}

        <TouchableOpacity
          style={[
            styles.addButton,
            isAddButtonDisabled && styles.addButtonDisabled,
          ]}
          onPress={addNewField}
          disabled={isAddButtonDisabled}>
          <Icon
            name="add-circle"
            size={24}
            color={isAddButtonDisabled ? colors.text.disabled : colors.primary}
          />
          <Text
            style={[
              styles.addButtonText,
              isAddButtonDisabled && styles.addButtonTextDisabled,
            ]}>
            Add Field
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailInput: {
    flex: 1,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  removeButton: {
    marginLeft: 8,
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    marginTop: 8,
  },
  addButtonDisabled: {
    borderColor: colors.border,
  },
  addButtonText: {
    color: colors.primary,
    marginLeft: 8,
    fontWeight: '500',
  },
  addButtonTextDisabled: {
    color: colors.text.disabled,
  },
  saveButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  saveButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdditionalDetails;
