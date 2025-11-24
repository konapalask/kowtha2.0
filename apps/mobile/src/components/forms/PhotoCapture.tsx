import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  MediaType,
  Asset,
} from 'react-native-image-picker';
// Safe import for DocumentPicker - handle case where module might not be available
let DocumentPicker: any = null;
try {
  const DocumentPickerModule = require('@react-native-documents/picker');
  // Handle different export structures
  if (DocumentPickerModule && typeof DocumentPickerModule === 'object') {
    DocumentPicker = DocumentPickerModule.default || DocumentPickerModule;
  } else if (DocumentPickerModule) {
    DocumentPicker = DocumentPickerModule;
  }
} catch (error) {
  console.warn('@react-native-documents/picker not available:', error);
  DocumentPicker = null;
}
import RNLocation from 'react-native-get-location';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geocoding from 'react-native-geocoding';
import {UploadedItem} from '../../types/verification';
import {colors} from '../../constants/colors';
import {getImageUploadPresignedUrl} from '../../services/field.services';
import Icons from 'react-native-vector-icons/AntDesign';
import compress from 'react-native-compressor';
import dayjs from 'dayjs';
import Pdf from 'react-native-pdf';
import ReactNativeBlobUtil from 'react-native-blob-util';

const DEFAULT_MAX_UPLOADS = 20;

// Predefined document types
const DOCUMENT_TYPES = [
  'ITRS',
  'GST CERTIFICATE',
  'GST RETURNS',
  'MSME LICENCE',
  'LABOUR LICENCE',
  'FSSAI LICENSE',
];

interface ExtendedUploadedItem extends UploadedItem {
  isOverlayNeeded?: boolean;
  documentType?: string;
  fileType?: 'photo' | 'pdf' | 'docx';
  fileName?: string;
}

type PhotoCaptureProps = {
  onUploadedItemsChange: (items: UploadedItem[]) => void;
  initialItems?: UploadedItem[];
  loanId: string;
  maxUploads?: number;
};

interface DocumentForm {
  id: string;
  documentType: string;
  isGeotagEnabled: boolean;
  uploadedItems: ExtendedUploadedItem[];
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  onUploadedItemsChange,
  initialItems = [],
  loanId,
  maxUploads = DEFAULT_MAX_UPLOADS,
}) => {
  const [uploadedItems, setUploadedItems] =
    useState<ExtendedUploadedItem[]>(initialItems);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeocodingInitialized, setIsGeocodingInitialized] = useState(false);
  const [documentForms, setDocumentForms] = useState<DocumentForm[]>([]);
  const [showDocumentSelectionModal, setShowDocumentSelectionModal] =
    useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
  const [customDocumentType, setCustomDocumentType] = useState<string>('');
  const [newDocumentGeotag, setNewDocumentGeotag] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedImage, setSelectedImage] =
    useState<ExtendedUploadedItem | null>(null);

  useEffect(() => {
    const initializeGeocoding = async () => {
      try {
        await Geocoding.init(process.env.GOOGLE_MAPS_API_KEY || '');
        setIsGeocodingInitialized(true);
      } catch (error) {
        console.error('Error initializing Geocoding:', error);
        setIsGeocodingInitialized(false);
      }
    };

    initializeGeocoding();
  }, []);

  // Sync uploadedItems and reconstruct documentForms when initialItems changes
  useEffect(() => {
    // Update uploadedItems state to match initialItems
    setUploadedItems(prevItems => {
      // Only update if initialItems has actually changed
      const initialItemsIds = new Set(initialItems.map(item => item.id));
      const prevItemsIds = new Set(prevItems.map(item => item.id));
      const hasChanged =
        initialItems.length !== prevItems.length ||
        initialItems.some(item => !prevItemsIds.has(item.id)) ||
        prevItems.some(item => !initialItemsIds.has(item.id));

      if (hasChanged) {
        return initialItems;
      }
      return prevItems;
    });

    // Reconstruct documentForms from initialItems if they exist
    if (initialItems && initialItems.length > 0) {
      // Group items by documentType
      const groupedByDocumentType = initialItems.reduce(
        (acc: Record<string, ExtendedUploadedItem[]>, item) => {
          const docType = item.documentType || 'Other';
          if (!acc[docType]) {
            acc[docType] = [];
          }
          acc[docType].push(item);
          return acc;
        },
        {},
      );

      // Reconstruct documentForms from grouped items
      setDocumentForms(prevForms => {
        const reconstructedForms: DocumentForm[] = Object.entries(
          groupedByDocumentType,
        ).map(([documentType, items], index) => {
          // Check if a form with this documentType already exists
          const existingForm = prevForms.find(
            form => form.documentType === documentType,
          );

          // Check if items have changed for this document type
          const existingItems = existingForm?.uploadedItems || [];
          const existingItemsIds = new Set(existingItems.map(item => item.id));
          const newItemsIds = new Set(items.map(item => item.id));
          const itemsChanged =
            items.length !== existingItems.length ||
            items.some(item => !existingItemsIds.has(item.id)) ||
            existingItems.some(item => !newItemsIds.has(item.id));

          // If form exists and items haven't changed, preserve it
          if (existingForm && !itemsChanged) {
            return existingForm;
          }

          // Otherwise, create/update the form
          return {
            id: existingForm?.id || `${Date.now()}-${index}`,
            documentType,
            isGeotagEnabled: existingForm?.isGeotagEnabled || false,
            uploadedItems: items,
          };
        });

        // Check if forms have actually changed
        const formsChanged =
          reconstructedForms.length !== prevForms.length ||
          reconstructedForms.some(form => {
            const existing = prevForms.find(
              f => f.documentType === form.documentType,
            );
            if (!existing) return true;
            const existingIds = new Set(
              existing.uploadedItems.map(item => item.id),
            );
            const newIds = new Set(form.uploadedItems.map(item => item.id));
            return (
              form.uploadedItems.length !== existing.uploadedItems.length ||
              form.uploadedItems.some(item => !existingIds.has(item.id)) ||
              existing.uploadedItems.some(item => !newIds.has(item.id))
            );
          });

        return formsChanged ? reconstructedForms : prevForms;
      });
    } else if (initialItems.length === 0) {
      // If initialItems is empty, only clear if we have forms
      setDocumentForms(prevForms => {
        if (prevForms.length > 0) {
          return [];
        }
        return prevForms;
      });
    }
  }, [initialItems]);

  const getLocationDetails = async (latitude: number, longitude: number) => {
    if (!isGeocodingInitialized) {
      console.warn('Geocoding not initialized, returning default values');
      return {locality: 'Unknown', pincode: 'Unknown'};
    }

    try {
      const response = await Geocoding.from(latitude, longitude);

      if (!response.results || response.results.length === 0) {
        console.warn('No geocoding results found');
        return {locality: 'Unknown', pincode: 'Unknown'};
      }

      const address = response.results[0].address_components;
      let locality = '';
      let pincode = '';

      address.forEach(component => {
        if (component.types.includes('locality')) {
          locality = component.long_name;
        }
        if (component.types.includes('postal_code')) {
          pincode = component.long_name;
        }
      });
      console.log('locality', locality);
      console.log('pincode', pincode);

      return {
        locality: locality || 'Unknown',
        pincode: pincode || 'Unknown',
      };
    } catch (error) {
      console.error('Error getting location details:', error);
      return {locality: 'Unknown', pincode: 'Unknown'};
    }
  };

  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = days[date?.getDay()];
    const formattedDate = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return `${day}, ${formattedDate}`;
  };

  // Add the image compression function
  const handleImageCompression = async (imageUri: string) => {
    try {
      // Get original image size
      const originalResponse = await fetch(imageUri);
      const originalBlob = await originalResponse.blob();
      const originalSizeKB = Math.round(originalBlob.size / 1024);
      console.log('Original image size:', originalSizeKB, 'KB');

      const compressedUri = await compress.Image.compress(imageUri, {
        maxWidth: 1280,
        quality: 0.8,
      });

      // Get compressed image size
      const compressedResponse = await fetch(compressedUri);
      const compressedBlob = await compressedResponse.blob();
      const compressedSizeKB = Math.round(compressedBlob.size / 1024);
      console.log('Compressed image size:', compressedSizeKB, 'KB');
      console.log(
        'Size reduction:',
        originalSizeKB - compressedSizeKB,
        'KB (',
        Math.round(
          ((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100,
        ),
        '% reduction)',
      );

      return compressedUri;
    } catch (error) {
      console.error('Image compression failed:', error);
      return imageUri; // fallback to original if compression fails
    }
  };

  const addNewDocumentForm = () => {
    const documentType = selectedDocumentType || customDocumentType.trim();

    if (!documentType) {
      Alert.alert('Error', 'Please select or enter a document type');
      return;
    }

    // Check if document type already exists
    const existingForm = documentForms.find(
      form => form.documentType === documentType,
    );
    if (existingForm) {
      Alert.alert('Error', 'This document type already exists');
      return;
    }

    const newForm: DocumentForm = {
      id: Date.now().toString(),
      documentType: documentType,
      isGeotagEnabled: newDocumentGeotag,
      uploadedItems: [],
    };

    setDocumentForms([...documentForms, newForm]);
    setSelectedDocumentType('');
    setCustomDocumentType('');
    setNewDocumentGeotag(false);
    setShowDocumentSelectionModal(false);
  };

  const handleDocumentTypeSelection = (documentType: string) => {
    // Toggle selection - if already selected, deselect it
    if (selectedDocumentType === documentType) {
      setSelectedDocumentType('');
    } else {
      setSelectedDocumentType(documentType);
      setCustomDocumentType('');
    }
  };

  const handleCustomDocumentType = () => {
    if (customDocumentType.trim()) {
      setSelectedDocumentType('');
      setCustomDocumentType(customDocumentType.trim());
    }
  };

  const removeDocumentForm = (formId: string) => {
    const formToRemove = documentForms.find(form => form.id === formId);
    if (formToRemove) {
      // Remove uploaded items for this form from main list
      const updatedItems = uploadedItems.filter(
        item =>
          !formToRemove.uploadedItems.some(formItem => formItem.id === item.id),
      );
      setUploadedItems(updatedItems);
      onUploadedItemsChange(updatedItems);
    }

    setDocumentForms(documentForms.filter(form => form.id !== formId));
  };

  const updateDocumentFormGeotag = (
    formId: string,
    isGeotagEnabled: boolean,
  ) => {
    setDocumentForms(
      documentForms.map(form =>
        form.id === formId ? {...form, isGeotagEnabled} : form,
      ),
    );
  };

  const uploadFileForDocumentForm = async (
    formId: string,
    files: Array<{
      uri: string;
      type: string;
      name?: string;
      mimeType?: string;
      locationOrOverlay: {
        latitude?: number;
        longitude?: number;
        isOverlayNeeded: boolean;
      };
      isCamera?: boolean;
      isDocument?: boolean;
    }>,
  ) => {
    const form = documentForms.find(f => f.id === formId);
    if (!form) return;

    try {
      setIsUploading(true);
      const newItems: ExtendedUploadedItem[] = [];

      for (const file of files) {
        let fileUri = file.uri;
        let fileType: 'photo' | 'pdf' | 'docx' = 'photo';
        let mimeType = 'image/jpeg';
        let fileExtension = '.jpg';
        let fileName = '';

        // Determine file type and handle accordingly
        if (file.isDocument) {
          // Handle PDF/DOCX documents
          const originalName = file.name || '';
          if (originalName.toLowerCase().endsWith('.pdf')) {
            fileType = 'pdf';
            mimeType = 'application/pdf';
            fileExtension = '.pdf';
            fileName = originalName;
          } else if (
            originalName.toLowerCase().endsWith('.docx') ||
            originalName.toLowerCase().endsWith('.doc')
          ) {
            fileType = 'docx';
            mimeType =
              file.mimeType ||
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            fileExtension = '.docx';
            fileName = originalName;
          } else {
            // Fallback to PDF if unknown
            fileType = 'pdf';
            mimeType = file.mimeType || 'application/pdf';
            fileExtension = '.pdf';
            fileName = originalName || 'document.pdf';
          }
        } else {
          // Handle images - compress before upload
          fileUri = await handleImageCompression(file.uri);
          fileType = 'photo';
          mimeType = 'image/jpeg';
          fileExtension = '.jpg';
        }

        // Generate a unique filename
        const timestamp = new Date().getTime();
        const s3FileName = file.isDocument
          ? `verification/${loanId}/${timestamp}-${Math.random()
              .toString(36)
              .substring(7)}${fileExtension}`
          : `verification/${loanId}/${timestamp}-${Math.random()
              .toString(36)
              .substring(7)}.jpg`;

        // Get presigned URL
        const {
          data: {url: presignedUrl},
        } = await getImageUploadPresignedUrl(s3FileName, mimeType);

        // Convert file to blob - use ReactNativeBlobUtil for content:// URIs (documents)
        let blob: Blob;
        if (
          file.isDocument &&
          (fileUri.startsWith('content://') || fileUri.startsWith('file://'))
        ) {
          // For documents, use react-native-blob-util to read the file
          const fileData = await ReactNativeBlobUtil.fs.readFile(
            fileUri,
            'base64',
          );
          const binaryString = atob(fileData);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          // Create Blob from Uint8Array - bypass TypeScript strict checking
          // @ts-ignore - Blob constructor accepts Uint8Array at runtime
          blob = new Blob([bytes], {type: mimeType});
        } else {
          // For regular file:// URIs (images), use standard fetch
          const fileResponse = await fetch(fileUri);
          blob = await fileResponse.blob();
        }

        // Upload to S3 using PUT request
        const uploadResponse = await fetch(presignedUrl, {
          method: 'PUT',
          body: blob,
          headers: {
            'Content-Type': mimeType,
          },
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(
            `Upload failed with status: ${uploadResponse.status}, message: ${errorText}`,
          );
        }

        // Create new item with S3 URL and document type
        const newItem: ExtendedUploadedItem = {
          id: Date.now().toString() + Math.random().toString(36).substring(2),
          uri: fileUri,
          s3ImageUrl: s3FileName,
          type: fileType === 'photo' ? 'photo' : 'document',
          timestamp: new Date().toISOString(),
          isCamera: file.isCamera || false,
          isOverlayNeeded: file.locationOrOverlay.isOverlayNeeded,
          documentType: form.documentType,
          fileType: fileType,
          fileName: file.isDocument ? fileName : undefined,
        };

        // Add location details if available and valid (only for photos)
        if (fileType === 'photo') {
          const lat = file.locationOrOverlay.latitude;
          const lng = file.locationOrOverlay.longitude;

          // Validate that latitude and longitude are valid numbers
          const isValidLat =
            lat !== null &&
            lat !== undefined &&
            !Number.isNaN(lat) &&
            Number.isFinite(lat);
          const isValidLng =
            lng !== null &&
            lng !== undefined &&
            !Number.isNaN(lng) &&
            Number.isFinite(lng);

          if (isValidLat && isValidLng) {
            try {
              const locationDetails = await getLocationDetails(lat, lng);
              newItem.latitude = lat;
              newItem.longitude = lng;
              newItem.locality = locationDetails.locality;
              newItem.pincode = locationDetails.pincode;
            } catch (locationError) {
              console.error('Error getting location details:', locationError);
              newItem.latitude = lat;
              newItem.longitude = lng;
              newItem.locality = 'Unknown';
              newItem.pincode = 'Unknown';
            }
          }
        }
        newItems.push(newItem);
      }

      // Update form's uploaded items
      const updatedForms = documentForms.map(f =>
        f.id === formId
          ? {...f, uploadedItems: [...f.uploadedItems, ...newItems]}
          : f,
      );
      setDocumentForms(updatedForms);

      // Update main uploaded items list
      const updatedItems = [...uploadedItems, ...newItems];
      setUploadedItems(updatedItems);
      onUploadedItemsChange(updatedItems);
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Failed to upload file. Please try again.',
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleCaptureForForm = async (formId: string) => {
    const form = documentForms.find(f => f.id === formId);
    if (!form) return;

    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
      });

      const photoUri = result.assets?.[0]?.uri;
      if (!photoUri) {
        return;
      }

      // Use geotag setting from form
      if (form.isGeotagEnabled) {
        try {
          const locationPermission = await check(
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          );
          if (locationPermission !== RESULTS.GRANTED) {
            const permissionResult = await request(
              PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            );
            if (permissionResult !== RESULTS.GRANTED) {
              Alert.alert(
                'Permission Required',
                'Location permission is required for geotagging. Uploading without geotag.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      uploadFileForDocumentForm(formId, [
                        {
                          uri: photoUri,
                          type: 'photo',
                          locationOrOverlay: {isOverlayNeeded: false},
                          isCamera: true,
                          isDocument: false,
                        },
                      ]);
                    },
                  },
                ],
              );
              return;
            }
          }

          const location = await RNLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
          });

          uploadFileForDocumentForm(formId, [
            {
              uri: photoUri,
              type: 'photo',
              locationOrOverlay: {
                latitude: location.latitude,
                longitude: location.longitude,
                isOverlayNeeded: true,
              },
              isCamera: true,
              isDocument: false,
            },
          ]);
        } catch (error) {
          console.error('Error getting location:', error);
          Alert.alert(
            'Location Error',
            'Failed to get location. Uploading without geotag.',
          );
          uploadFileForDocumentForm(formId, [
            {
              uri: photoUri,
              type: 'photo',
              locationOrOverlay: {isOverlayNeeded: false},
              isCamera: true,
              isDocument: false,
            },
          ]);
        }
      } else {
        uploadFileForDocumentForm(formId, [
          {
            uri: photoUri,
            type: 'photo',
            locationOrOverlay: {isOverlayNeeded: false},
            isCamera: true,
            isDocument: false,
          },
        ]);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  const handleGalleryForForm = async (formId: string) => {
    const form = documentForms.find(f => f.id === formId);
    if (!form) return;

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 0, // 0 means unlimited selection
      });

      if (result.assets && result.assets.length > 0) {
        const imagesToUpload = result.assets.map(asset => ({
          uri: asset.uri || '',
          type: 'photo',
          locationOrOverlay: {isOverlayNeeded: false}, // Gallery images never get overlay
          isCamera: false,
          isDocument: false,
        }));
        await uploadFileForDocumentForm(formId, imagesToUpload);
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('Error', 'Failed to select photo');
    }
  };

  const handleDocumentPickerForForm = async (formId: string) => {
    const form = documentForms.find(f => f.id === formId);
    if (!form) return;

    // Check if DocumentPicker is available
    if (!DocumentPicker) {
      Alert.alert(
        'Document Picker Not Available',
        '@react-native-documents/picker is not available. Please restart Metro bundler and rebuild the app.',
      );
      return;
    }

    try {
      const result = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.docx,
          DocumentPicker.types.doc,
        ],
        allowMultiSelection: true,
      });

      if (result && result.length > 0) {
        const documentsToUpload = result.map((doc: any) => ({
          uri: doc.uri,
          type: doc.type || '',
          name: doc.name || '',
          mimeType: doc.mimeType || '',
          locationOrOverlay: {isOverlayNeeded: false}, // Documents never get overlay
          isCamera: false,
          isDocument: true,
        }));
        await uploadFileForDocumentForm(formId, documentsToUpload);
      }
    } catch (error: any) {
      if (DocumentPicker.isCancel && DocumentPicker.isCancel(error)) {
        // User cancelled the picker
        return;
      }
      console.error('Error selecting document:', error);
    }
  };

  const openDocumentViewer = (image: ExtendedUploadedItem) => {
    setSelectedImage(image);
    setShowDocumentViewer(true);
  };

  const closeDocumentViewer = () => {
    setShowDocumentViewer(false);
    setSelectedImage(null);
  };

  const handleRemoveItemFromForm = (formId: string, itemId: string) => {
    const updatedForms = documentForms.map(form => {
      if (form.id === formId) {
        const updatedItems = form.uploadedItems.filter(
          item => item.id !== itemId,
        );
        return {...form, uploadedItems: updatedItems};
      }
      return form;
    });
    setDocumentForms(updatedForms);

    // Update main uploaded items list
    const updatedItems = uploadedItems.filter(item => item.id !== itemId);
    setUploadedItems(updatedItems);
    onUploadedItemsChange(updatedItems);
  };

  return (
    <View style={styles.container}>
      {/* Add New Document Button */}
      <TouchableOpacity
        style={styles.addDocumentButton}
        onPress={() => setShowDocumentSelectionModal(true)}>
        <Icons name="plus" size={24} color={colors.text.inverse} />
        <Text style={styles.addDocumentButtonText}>Document/Photos</Text>
      </TouchableOpacity>

      {/* Document Selection Modal */}
      <Modal
        visible={showDocumentSelectionModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowDocumentSelectionModal(false);
          setSelectedDocumentType('');
          setCustomDocumentType('');
          setNewDocumentGeotag(false);
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Document Type</Text>

            {/* Selected Tag at Top */}
            {selectedDocumentType && (
              <View style={styles.selectedTagContainer}>
                <TouchableOpacity
                  style={styles.selectedTag}
                  onPress={() =>
                    handleDocumentTypeSelection(selectedDocumentType)
                  }>
                  <Text style={styles.selectedTagText}>
                    {selectedDocumentType}
                  </Text>
                  <Icons
                    name="closecircle"
                    size={18}
                    color={colors.text.inverse}
                    style={styles.selectedTagIcon}
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* Tag Pool */}
            <View style={styles.tagPoolContainer}>
              {DOCUMENT_TYPES.filter(type => type !== selectedDocumentType).map(
                (type, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.tag}
                    onPress={() => handleDocumentTypeSelection(type)}>
                    <Text style={styles.tagText}>{type}</Text>
                  </TouchableOpacity>
                ),
              )}
            </View>

            <Text style={styles.customTypeLabel}>
              Or add custom document type:
            </Text>
            <TextInput
              style={styles.customTypeInput}
              placeholder="Enter custom document type"
              value={customDocumentType}
              onChangeText={setCustomDocumentType}
              placeholderTextColor={colors.text.secondary}
              onFocus={() => setSelectedDocumentType('')}
            />

            <View style={styles.geotagSwitchContainer}>
              <Text style={styles.geotagSwitchLabel}>
                Enable Geotag Overlay
              </Text>
              <TouchableOpacity
                style={[
                  styles.geotagSwitch,
                  newDocumentGeotag && styles.geotagSwitchActive,
                ]}
                onPress={() => setNewDocumentGeotag(!newDocumentGeotag)}>
                <View
                  style={[
                    styles.geotagSwitchThumb,
                    newDocumentGeotag && styles.geotagSwitchThumbActive,
                  ]}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowDocumentSelectionModal(false);
                  setSelectedDocumentType('');
                  setCustomDocumentType('');
                  setNewDocumentGeotag(false);
                }}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={addNewDocumentForm}
                disabled={!selectedDocumentType && !customDocumentType.trim()}>
                <Text style={styles.addButtonText}>Add Document</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Document Forms */}
      {documentForms.map(form => (
        <View key={form.id} style={styles.documentCard}>
          <View style={styles.documentCardHeader}>
            <Text style={styles.documentCardTitle}>{form.documentType}</Text>
            <TouchableOpacity
              style={styles.removeDocumentButton}
              onPress={() => removeDocumentForm(form.id)}>
              <Icons name="close" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>

          <View style={styles.geotagSwitchContainer}>
            <Text style={styles.geotagSwitchLabel}>Enable Geotag Overlay</Text>
            <TouchableOpacity
              style={[
                styles.geotagSwitch,
                form.isGeotagEnabled && styles.geotagSwitchActive,
              ]}
              onPress={() =>
                updateDocumentFormGeotag(form.id, !form.isGeotagEnabled)
              }>
              <View
                style={[
                  styles.geotagSwitchThumb,
                  form.isGeotagEnabled && styles.geotagSwitchThumbActive,
                ]}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, isUploading && styles.buttonDisabled]}
              onPress={() => handleCaptureForForm(form.id)}
              disabled={isUploading}>
              <Text style={styles.buttonText}>
                {isUploading ? (
                  'Uploading...'
                ) : (
                  <Icons
                    name="camerao"
                    size={32}
                    color={colors.button.secondary.text}
                  />
                )}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, isUploading && styles.buttonDisabled]}
              onPress={() => handleGalleryForForm(form.id)}
              disabled={isUploading}>
              <Text style={styles.buttonText}>
                {isUploading ? (
                  'Uploading...'
                ) : (
                  <Icons
                    name="picture"
                    size={32}
                    color={colors.button.secondary.text}
                  />
                )}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                (isUploading || !DocumentPicker) && styles.buttonDisabled,
              ]}
              onPress={() => handleDocumentPickerForForm(form.id)}
              disabled={isUploading || !DocumentPicker}>
              <Text style={styles.buttonText}>
                {isUploading ? (
                  'Uploading...'
                ) : (
                  <Icons
                    name="filetext1"
                    size={32}
                    color={
                      DocumentPicker
                        ? colors.button.secondary.text
                        : colors.text.secondary
                    }
                  />
                )}
              </Text>
            </TouchableOpacity>
          </View>

          {form.uploadedItems.length > 0 && (
            <Text style={styles.uploadCount}>
              {form.uploadedItems.length} document
              {form.uploadedItems.length !== 1 ? 's' : ''} uploaded
            </Text>
          )}

          {isUploading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Uploading document...</Text>
            </View>
          )}

          {form.uploadedItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No documents uploaded yet for {form.documentType}
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.imageGrid}>
              {form.uploadedItems.map(item => (
                <View key={item.id} style={styles.imageContainer}>
                  <TouchableOpacity
                    style={styles.imageWrapper}
                    onPress={() => openDocumentViewer(item)}>
                    {item.fileType === 'pdf' || item.fileType === 'docx' ? (
                      <View style={styles.documentContainer}>
                        <Icons
                          name={
                            item.fileType === 'pdf' ? 'pdffile1' : 'filetext1'
                          }
                          size={48}
                          color={colors.primary}
                        />
                        <Text style={styles.documentName} numberOfLines={2}>
                          {item.fileName ||
                            `${item.fileType.toUpperCase()} Document`}
                        </Text>
                        <Text style={styles.documentType}>
                          {item.fileType.toUpperCase()}
                        </Text>
                      </View>
                    ) : (
                      <>
                        <Image
                          source={{uri: item.uri}}
                          style={styles.image}
                          resizeMode="contain"
                          onError={error => {
                            console.log('Image load error:', error);
                            console.log('Image URI:', item.uri);
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', item.uri);
                          }}
                        />
                        {!item.uri && (
                          <View style={styles.imagePlaceholder}>
                            <Text style={styles.imagePlaceholderText}>
                              No Image
                            </Text>
                          </View>
                        )}
                      </>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveItemFromForm(form.id, item.id)}>
                    <Text style={styles.removeButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      ))}

      {/* Document Viewer Modal */}
      <Modal
        visible={showDocumentViewer}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDocumentViewer}>
        <View style={styles.viewerOverlay}>
          <TouchableOpacity
            style={styles.viewerCloseButton}
            onPress={closeDocumentViewer}>
            <Icons name="close" size={30} color={colors.text.inverse} />
          </TouchableOpacity>

          {selectedImage && (
            <View style={styles.viewerContent}>
              {selectedImage.fileType === 'pdf' ? (
                <Pdf
                  source={{uri: selectedImage.uri, cache: true}}
                  style={styles.viewerPdf}
                  onLoadComplete={(numberOfPages, filePath) => {
                    console.log(`Number of pages: ${numberOfPages}`);
                  }}
                  onPageChanged={(page, numberOfPages) => {
                    console.log(`Current page: ${page}`);
                  }}
                  onError={error => {
                    console.log('PDF load error:', error);
                  }}
                />
              ) : selectedImage.fileType === 'docx' ? (
                <View style={styles.documentPreviewContainer}>
                  <Icons name="filetext1" size={64} color={colors.primary} />
                  <Text style={styles.documentPreviewText}>
                    DOCX files cannot be previewed in-app
                  </Text>
                  <Text style={styles.documentPreviewFileName}>
                    {selectedImage.fileName || 'Document.docx'}
                  </Text>
                </View>
              ) : (
                <Image
                  source={{uri: selectedImage.uri}}
                  style={styles.viewerImage}
                  resizeMode="contain"
                />
              )}

              <View style={styles.viewerInfo}>
                <Text style={styles.viewerDocumentType}>
                  {selectedImage.documentType}
                </Text>
                {selectedImage.fileName && (
                  <Text style={styles.viewerFileName}>
                    {selectedImage.fileName}
                  </Text>
                )}
                <Text style={styles.viewerTimestamp}>
                  {dayjs(selectedImage.timestamp).format('DD-MM-YYYY HH:mm')}
                </Text>
                {selectedImage.isOverlayNeeded && (
                  <View style={styles.viewerGeotagInfo}>
                    <Icons
                      name="enviromento"
                      size={16}
                      color={colors.primary}
                    />
                    <Text style={styles.viewerGeotagText}>Geotagged</Text>
                  </View>
                )}
                {selectedImage.locality && selectedImage.pincode && (
                  <Text style={styles.viewerLocation}>
                    📍 {selectedImage.locality}, {selectedImage.pincode}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* Empty State */}
      {documentForms.length === 0 && !showDocumentSelectionModal && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No documents added yet. Tap "Add New Document" to get started.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  button: {
    flex: 1,
    backgroundColor: colors.button.secondary.background,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.button.secondary.borderColor,
  },
  buttonText: {
    color: colors.button.secondary.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageGrid: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.error,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: colors.text.inverse,
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.text.primary,
  },
  uploadCount: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  documentTypeContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  documentTypeText: {
    color: colors.text.inverse,
    fontSize: 12,
    fontWeight: 'bold',
  },
  addDocumentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  addDocumentButtonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  selectedTagContainer: {
    marginBottom: 16,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  selectedTagText: {
    fontSize: 14,
    color: colors.text.inverse,
    fontWeight: '600',
    marginRight: 8,
  },
  selectedTagIcon: {
    marginLeft: 4,
  },
  tagPoolContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: colors.input.background,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  customTypeLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: colors.primary,
  },
  addButtonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  documentCard: {
    backgroundColor: colors.input.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  documentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  documentCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    flex: 1,
  },
  removeDocumentButton: {
    padding: 4,
  },
  geotagSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.input.background,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  geotagSwitchLabel: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: '500',
  },
  geotagSwitch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  geotagSwitchActive: {
    backgroundColor: colors.primary,
  },
  geotagSwitchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.text.inverse,
    alignSelf: 'flex-start',
  },
  geotagSwitchThumbActive: {
    alignSelf: 'flex-end',
  },
  imageWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.border,
  },
  imagePlaceholderText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  viewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 10,
  },
  viewerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  viewerImage: {
    width: '100%',
    height: '70%',
    borderRadius: 8,
  },
  viewerPdf: {
    flex: 1,
    width: '100%',
    height: '70%',
    borderRadius: 8,
  },
  documentPreviewContainer: {
    flex: 1,
    width: '100%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 20,
  },
  documentPreviewText: {
    fontSize: 16,
    color: colors.text.inverse,
    marginTop: 16,
    textAlign: 'center',
  },
  documentPreviewFileName: {
    fontSize: 14,
    color: colors.text.inverse,
    marginTop: 8,
    opacity: 0.8,
    textAlign: 'center',
  },
  viewerFileName: {
    fontSize: 14,
    color: colors.text.inverse,
    marginBottom: 8,
    opacity: 0.9,
    textAlign: 'center',
    fontWeight: '500',
  },
  viewerInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  viewerDocumentType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.inverse,
    marginBottom: 8,
    textAlign: 'center',
  },
  viewerTimestamp: {
    fontSize: 14,
    color: colors.text.inverse,
    marginBottom: 8,
    opacity: 0.8,
  },
  viewerGeotagInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  viewerGeotagText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  viewerLocation: {
    fontSize: 14,
    color: colors.text.inverse,
    opacity: 0.8,
    textAlign: 'center',
  },
  customTypeInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.input.background,
    marginBottom: 16,
    color: colors.text.primary,
  },
  documentContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.input.background,
    padding: 16,
  },
  documentName: {
    fontSize: 12,
    color: colors.text.primary,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  documentType: {
    fontSize: 10,
    color: colors.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default PhotoCapture;
