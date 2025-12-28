import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useForm, useFieldArray} from 'react-hook-form';
import {colors} from '../../constants/colors';
import {InputFormItem} from '../../lib/InputFormItem';
import {TextAreaFormItem} from '../../lib/TextAreaFormItem';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

interface Document {
  documentCategory: string;
  documentName: string;
  documentType: string;
  remarks: string;
}

interface DocumentsObservedFormData {
  documents: Document[];
}

interface DocumentsObservedProps {
  onSubmit: (data: DocumentsObservedFormData) => void;
  initialData?: DocumentsObservedFormData;
  maxDocuments?: number;
}

const DocumentsObserved: React.FC<DocumentsObservedProps> = ({
  onSubmit,
  initialData = {documents: []},
  maxDocuments,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm<DocumentsObservedFormData>({
    defaultValues: {
      documents:
        initialData?.documents?.length > 0
          ? initialData?.documents
          : [createEmptyDocument()],
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'documents',
  });

  function createEmptyDocument(): Document {
    return {
      documentCategory: '',
      documentName: '',
      documentType: '',
      remarks: '',
    };
  }

  const handleAddDocument = () => {
    if (maxDocuments && fields.length >= maxDocuments) {
      Toast.show({
        type: 'error',
        text1: 'Maximum Limit Reached',
        text2: `Cannot add more than ${maxDocuments} documents`,
        position: 'bottom',
      });
      return;
    }
    append(createEmptyDocument());
  };

  const onFormSubmit = (data: DocumentsObservedFormData) => {
    onSubmit(data);
  };

  const renderDocumentFields = (index: number) => {
    return (
      <View key={index} style={styles.documentContainer}>
        <View style={styles.documentHeader}>
          <Text style={styles.documentTitle}>Document {index + 1}</Text>
          {index > 0 && (
            <TouchableOpacity
              onPress={() => remove(index)}
              style={styles.removeButton}>
              <Icon name="delete" size={24} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>

        <InputFormItem
          data={{
            title: 'Document Category',
            key: `documents.${index}.documentCategory`,
            control,
            errors,
            required: true,
            placeholder: 'Enter document category',
          }}
        />

        <InputFormItem
          data={{
            title: 'Document Name',
            key: `documents.${index}.documentName`,
            control,
            errors,
            required: true,
            placeholder: 'Enter document name',
          }}
        />

        <InputFormItem
          data={{
            title: 'Document Type',
            key: `documents.${index}.documentType`,
            control,
            errors,
            required: true,
            placeholder: 'Enter document type',
          }}
        />

        <TextAreaFormItem
          data={{
            title: 'Remarks',
            key: `documents.${index}.remarks`,
            control,
            errors,
            required: true,
            placeholder: 'Enter remarks about the document...',
          }}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Documents Observed</Text>

      {fields.map((field, index) => renderDocumentFields(index))}

      <TouchableOpacity
        style={[
          styles.addButton,
          maxDocuments && fields.length >= maxDocuments
            ? styles.disabledButton
            : null,
        ]}
        onPress={handleAddDocument}
        disabled={maxDocuments ? fields.length >= maxDocuments : false}>
        <Text
          style={[
            styles.addButtonText,
            maxDocuments && fields.length >= maxDocuments
              ? styles.disabledButtonText
              : null,
          ]}>
          Add Document{' '}
          {maxDocuments ? `(${fields.length}/${maxDocuments})` : ''}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onFormSubmit)}>
        <Text style={styles.submitButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 16,
    color: colors.text.primary,
  },
  documentContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  removeButton: {
    padding: 4,
  },
  addButton: {
    backgroundColor: colors.button.secondary.background,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
  },
  addButtonText: {
    color: colors.button.secondary.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: colors.button.primary.background,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 16,
  },
  submitButtonText: {
    color: colors.button.primary.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    opacity: 0.7,
  },
  disabledButtonText: {
    color: '#9E9E9E',
  },
});

export default DocumentsObserved;
