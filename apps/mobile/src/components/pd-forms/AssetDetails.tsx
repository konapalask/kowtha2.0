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
import {SelectFormItem} from '../../lib/SelectFormItem';
import {TextAreaFormItem} from '../../lib/TextAreaFormItem';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

interface Asset {
  address: string;
  areaMeasured: string;
  purchaseCost: string;
  purchaseYear: string;
  marketValue: string;
  ownerName: string;
  mortgaged: string;
}

interface AssetDetailsFormData {
  assets: Asset[];
  liquidMoveableMonetaryItems: string;
  lifeInsuranceMediclaim: string;
  capitalInvestedBusiness: string;
  vehicles: string;
  existingEMIsLoans: string;
  tpc: string;
  observations: string;
  otherIncome: string;
  siteCoordinates: string;
  remarks: string;
  status: string;
}

interface AssetDetailsProps {
  onSubmit: (data: AssetDetailsFormData) => void;
  initialData?: AssetDetailsFormData;
  maxAssets?: number;
}

const YES_NO_OPTIONS = [
  {id: 'yes', name: 'Yes'},
  {id: 'no', name: 'No'},
];

const STATUS_OPTIONS = [
  {id: 'positive', name: 'Positive'},
  {id: 'negative', name: 'Negative'},
];

const AssetDetails: React.FC<AssetDetailsProps> = ({
  onSubmit,
  initialData,
  maxAssets,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<AssetDetailsFormData>({
    defaultValues: initialData || {
      assets: [createEmptyAsset()],
      liquidMoveableMonetaryItems: '',
      lifeInsuranceMediclaim: '',
      capitalInvestedBusiness: '',
      vehicles: '',
      //   existingEMIsLoans: '',
      //   tpc: '',
      observations: '',
      otherIncome: '',
      siteCoordinates: '',
      remarks: '',
      status: '',
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: 'assets',
  });

  function createEmptyAsset(): Asset {
    return {
      address: '',
      areaMeasured: '',
      purchaseCost: '',
      purchaseYear: '',
      marketValue: '',
      ownerName: '',
      mortgaged: '',
    };
  }

  const handleAddAsset = () => {
    if (maxAssets && fields.length >= maxAssets) {
      Toast.show({
        type: 'error',
        text1: 'Maximum Limit Reached',
        text2: `Cannot add more than ${maxAssets} assets`,
        position: 'bottom',
      });
      return;
    }
    append(createEmptyAsset());
  };

  const onFormSubmit = (data: AssetDetailsFormData) => {
    onSubmit(data);
  };

  const renderAssetFields = (index: number) => {
    return (
      <View key={index} style={styles.assetContainer}>
        <View style={styles.assetHeader}>
          <Text style={styles.assetTitle}>Asset {index + 1}</Text>
          {index > 0 && (
            <TouchableOpacity
              onPress={() => remove(index)}
              style={styles.removeButton}>
              <Icon name="delete" size={24} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>

        <TextAreaFormItem
          data={{
            title: 'Address',
            key: `assets.${index}.address`,
            control,
            errors,
            required: true,
            placeholder: 'Enter asset address',
          }}
        />

        <InputFormItem
          data={{
            title: 'Area Measured (in sq.ft)',
            key: `assets.${index}.areaMeasured`,
            control,
            errors,
            required: true,
            placeholder: 'Enter area in sq.ft',
            keyboardType: 'numeric',
          }}
        />

        <InputFormItem
          data={{
            title: 'Purchase Cost (in lac)',
            key: `assets.${index}.purchaseCost`,
            control,
            errors,
            required: true,
            placeholder: 'Enter purchase cost in lac',
            keyboardType: 'numeric',
          }}
        />

        <InputFormItem
          data={{
            title: 'Purchase Year',
            key: `assets.${index}.purchaseYear`,
            control,
            errors,
            required: true,
            placeholder: 'Enter purchase year',
            keyboardType: 'numeric',
          }}
        />

        <InputFormItem
          data={{
            title: 'Market Value (in lac)',
            key: `assets.${index}.marketValue`,
            control,
            errors,
            required: true,
            placeholder: 'Enter market value in lac',
            keyboardType: 'numeric',
          }}
        />

        <InputFormItem
          data={{
            title: 'Owner Name',
            key: `assets.${index}.ownerName`,
            control,
            errors,
            required: true,
            placeholder: 'Enter owner name',
          }}
        />

        <SelectFormItem
          data={{
            title: 'Mortgaged',
            key: `assets.${index}.mortgaged`,
            control,
            errors,
            required: true,
            options: YES_NO_OPTIONS,
          }}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Dynamic Asset Information</Text>
      {fields.map((field, index) => renderAssetFields(index))}

      <TouchableOpacity
        style={[
          styles.addButton,
          maxAssets && fields.length >= maxAssets
            ? styles.disabledButton
            : null,
        ]}
        onPress={handleAddAsset}
        disabled={maxAssets ? fields.length >= maxAssets : false}>
        <Text
          style={[
            styles.addButtonText,
            maxAssets && fields.length >= maxAssets
              ? styles.disabledButtonText
              : null,
          ]}>
          Add Asset {maxAssets ? `(${fields.length}/${maxAssets})` : ''}
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Static Asset Information</Text>

      <TextAreaFormItem
        data={{
          title:
            'Any Liquid, Moveable & Monetary items such as Cash, Gold, FD, RD, Mutual Fund Holdings, Shares, Bonds, Securities',
          key: 'liquidMoveableMonetaryItems',
          control,
          errors,
          required: false,
          placeholder: 'Enter details of liquid, moveable & monetary items',
        }}
      />

      <TextAreaFormItem
        data={{
          title:
            'Life Insurance, Mediclaim, Property/Asset Insurance (premium & sum assured)',
          key: 'lifeInsuranceMediclaim',
          control,
          errors,
          required: false,
          placeholder: 'Enter insurance details',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Capital Invested in any business, loans & advances given',
          key: 'capitalInvestedBusiness',
          control,
          errors,
          required: false,
          placeholder: 'Enter capital investment details',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Car, Bike and any other vehicle (Company name and model)',
          key: 'vehicles',
          control,
          errors,
          required: false,
          placeholder: 'Enter vehicle details',
        }}
      />

      {/* <TextAreaFormItem
        data={{
          title: 'Existing EMIs/Loans',
          key: 'existingEMIsLoans',
          control,
          errors,
          required: false,
          placeholder: 'Enter existing EMI/loan details',
        }}
      /> */}

      {/* <TextAreaFormItem
        data={{
          title: 'TPC',
          key: 'tpc',
          control,
          errors,
          required: false,
          placeholder: 'Enter TPC details',
        }}
      /> */}

      <TextAreaFormItem
        data={{
          title: 'Observations',
          key: 'observations',
          control,
          errors,
          required: false,
          placeholder: 'Enter observations',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Other Income: (Income from other than initiated business)',
          key: 'otherIncome',
          control,
          errors,
          required: false,
          placeholder: 'Enter other income details',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Site Coordinates',
          key: 'siteCoordinates',
          control,
          errors,
          required: false,
          placeholder: 'Enter site coordinates',
        }}
      />

      <TextAreaFormItem
        data={{
          title: 'Remarks',
          key: 'remarks',
          control,
          errors,
          required: false,
          placeholder: 'Enter remarks',
        }}
      />

      <SelectFormItem
        data={{
          title: 'Status',
          key: 'status',
          control,
          errors,
          required: true,
          options: STATUS_OPTIONS,
        }}
      />

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
  assetContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  assetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  assetTitle: {
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

export default AssetDetails;
