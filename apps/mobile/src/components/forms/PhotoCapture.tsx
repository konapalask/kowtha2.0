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
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  MediaType,
  Asset,
} from 'react-native-image-picker';
import RNLocation from 'react-native-get-location';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geocoding from 'react-native-geocoding';
import {UploadedItem} from '../../types/verification';
import {colors} from '../../constants/colors';
import {getImageUploadPresignedUrl} from '../../services/field.services';
import Icons from 'react-native-vector-icons/AntDesign';
import compress from 'react-native-compressor';

const MAX_UPLOADS = 20;

interface ExtendedUploadedItem extends UploadedItem {
  isOverlayNeeded?: boolean;
}

type PhotoCaptureProps = {
  onUploadedItemsChange: (items: UploadedItem[]) => void;
  initialItems?: UploadedItem[];
  loanId: string;
};

const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  onUploadedItemsChange,
  initialItems = [],
  loanId,
}) => {
  const [uploadedItems, setUploadedItems] =
    useState<ExtendedUploadedItem[]>(initialItems);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeocodingInitialized, setIsGeocodingInitialized] = useState(false);

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
      const compressedUri = await compress.Image.compress(imageUri, {
        // maxWidth: 1280,
        quality: 0.9,
      });
      console.log('Compressed image path:', compressedUri);
      return compressedUri;
    } catch (error) {
      console.error('Image compression failed:', error);
      return imageUri; // fallback to original if compression fails
    }
  };

  // Refactor uploadImage to use compression
  const uploadImage = async (
    images: Array<{
      uri: string;
      type: string;
      locationOrOverlay: {
        latitude?: number;
        longitude?: number;
        isOverlayNeeded: boolean;
      };
      isCamera?: boolean;
    }>,
  ) => {
    try {
      setIsUploading(true);
      const newItems: ExtendedUploadedItem[] = [];
      for (const image of images) {
        // Compress the image before upload, fallback to original if fails
        const compressedUri = await handleImageCompression(image.uri);

        // Generate a unique filename
        const timestamp = new Date().getTime();
        const fileName = `verification/${loanId}/${timestamp}-${Math.random()
          .toString(36)
          .substring(7)}.jpg`;

        // Get presigned URL
        const {
          data: {url: presignedUrl},
        } = await getImageUploadPresignedUrl(fileName, 'image/jpeg');

        // Convert image to blob
        const imageResponse = await fetch(compressedUri); // use compressedUri
        const blob = await imageResponse.blob();

        // Upload to S3 using PUT request
        const uploadResponse = await fetch(presignedUrl, {
          method: 'PUT',
          body: blob,
          headers: {
            'Content-Type': 'image/jpeg',
          },
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          throw new Error(
            `Upload failed with status: ${uploadResponse.status}, message: ${errorText}`,
          );
        }

        // Create new item with S3 URL
        const newItem: ExtendedUploadedItem = {
          id: Date.now().toString() + Math.random().toString(36).substring(2),
          uri: compressedUri, // use compressedUri
          s3ImageUrl: fileName,
          type: 'photo',
          timestamp: new Date().toISOString(),
          isCamera: image.isCamera || false,
          isOverlayNeeded: image.locationOrOverlay.isOverlayNeeded,
        };

        // Add location details if available
        if (
          image.locationOrOverlay.latitude &&
          image.locationOrOverlay.longitude
        ) {
          try {
            const locationDetails = await getLocationDetails(
              image.locationOrOverlay.latitude,
              image.locationOrOverlay.longitude,
            );
            newItem.latitude = image.locationOrOverlay.latitude;
            newItem.longitude = image.locationOrOverlay.longitude;
            newItem.locality = locationDetails.locality;
            newItem.pincode = locationDetails.pincode;
          } catch (locationError) {
            console.error('Error getting location details:', locationError);
            newItem.latitude = image.locationOrOverlay.latitude;
            newItem.longitude = image.locationOrOverlay.longitude;
            newItem.locality = 'Unknown';
            newItem.pincode = 'Unknown';
          }
        }
        newItems.push(newItem);
      }
      const updatedItems = [...uploadedItems, ...newItems];
      setUploadedItems(updatedItems);
      onUploadedItemsChange(updatedItems);
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Failed to upload image. Please try again.',
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Update handleCapture to use array API
  const handleCapture = async () => {
    try {
      if (uploadedItems.length >= MAX_UPLOADS) {
        Alert.alert(
          'Upload Limit Reached',
          `You can only upload up to ${MAX_UPLOADS} photos. Please remove some photos before adding more.`,
        );
        return;
      }

      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
      });

      const photoUri = result.assets?.[0]?.uri;
      if (!photoUri) {
        return;
      }

      // Ask user if they want to overlay geotag
      Alert.alert(
        'Geotag Overlay',
        'Would you like to overlay geotag information on this photo?',
        [
          {
            text: 'No',
            onPress: () => {
              uploadImage([
                {
                  uri: photoUri,
                  type: 'photo',
                  locationOrOverlay: {isOverlayNeeded: false},
                  isCamera: true,
                },
              ]);
            },
          },
          {
            text: 'Yes',
            onPress: async () => {
              try {
                // Get location permission and coordinates
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
                      'Location permission is required for geotagging. Would you like to grant permission?',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                          onPress: () => {
                            uploadImage([
                              {
                                uri: photoUri,
                                type: 'photo',
                                locationOrOverlay: {isOverlayNeeded: false},
                                isCamera: true,
                              },
                            ]);
                          },
                        },
                        {
                          text: 'Grant Permission',
                          onPress: async () => {
                            const result = await request(
                              PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                            );
                            if (result === RESULTS.GRANTED) {
                              handleCapture();
                            } else {
                              uploadImage([
                                {
                                  uri: photoUri,
                                  type: 'photo',
                                  locationOrOverlay: {isOverlayNeeded: false},
                                  isCamera: true,
                                },
                              ]);
                            }
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

                await uploadImage([
                  {
                    uri: photoUri,
                    type: 'photo',
                    locationOrOverlay: {
                      latitude: location.latitude,
                      longitude: location.longitude,
                      isOverlayNeeded: true,
                    },
                    isCamera: true,
                  },
                ]);
              } catch (error) {
                console.error('Error getting location:', error);
                Alert.alert(
                  'Location Error',
                  'Failed to get location. Uploading without geotag.',
                );
                uploadImage([
                  {
                    uri: photoUri,
                    type: 'photo',
                    locationOrOverlay: {isOverlayNeeded: false},
                    isCamera: true,
                  },
                ]);
              }
            },
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  // Update handleGallery to allow multiple selection and use array API
  const handleGallery = async () => {
    try {
      if (uploadedItems.length >= MAX_UPLOADS) {
        Alert.alert(
          'Upload Limit Reached',
          `You can only upload up to ${MAX_UPLOADS} photos. Please remove some photos before adding more.`,
        );
        return;
      }

      // Check for storage permissions
      // const storagePermission = await check(
      //   PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      // );
      // if (storagePermission !== RESULTS.GRANTED) {
      //   const permissionResult = await request(
      //     PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      //   );
      //   if (permissionResult !== RESULTS.GRANTED) {
      //     Alert.alert(
      //       'Permission Required',
      //       'Storage permission is required to access photos from gallery. Would you like to grant permission?',
      //       [
      //         {
      //           text: 'Cancel',
      //           style: 'cancel',
      //         },
      //         {
      //           text: 'Grant Permission',
      //           onPress: async () => {
      //             const result = await request(
      //               PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
      //             );
      //             if (result === RESULTS.GRANTED) {
      //               handleGallery();
      //             } else {
      //               Alert.alert(
      //                 'Permission Denied',
      //                 'Storage permission is required to access photos from gallery',
      //               );
      //             }
      //           },
      //         },
      //       ],
      //     );
      //     return;
      //   }
      // }

      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: MAX_UPLOADS - uploadedItems.length, // allow as many as possible
        // presentationStyle: 'fullScreen',
      });

      if (result.assets && result.assets.length > 0) {
        // Map all selected assets to the new image object format
        const imagesToUpload = result.assets.map(asset => ({
          uri: asset.uri || '',
          type: 'photo',
          locationOrOverlay: {isOverlayNeeded: false},
          isCamera: false,
        }));
        await uploadImage(imagesToUpload);
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('Error', 'Failed to select photo');
    }
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = uploadedItems.filter(item => item.id !== id);
    setUploadedItems(updatedItems);
    onUploadedItemsChange(updatedItems);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            (isUploading || uploadedItems.length >= MAX_UPLOADS) &&
              styles.buttonDisabled,
          ]}
          onPress={handleCapture}
          disabled={isUploading || uploadedItems.length >= MAX_UPLOADS}>
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
          style={[
            styles.button,
            (isUploading || uploadedItems.length >= MAX_UPLOADS) &&
              styles.buttonDisabled,
          ]}
          onPress={handleGallery}
          disabled={isUploading || uploadedItems.length >= MAX_UPLOADS}>
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
      </View>

      {uploadedItems.length > 0 && (
        <Text style={styles.uploadCount}>
          {uploadedItems.length}/{MAX_UPLOADS} photos uploaded
        </Text>
      )}

      {isUploading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Uploading image...</Text>
        </View>
      )}

      {uploadedItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No photos uploaded yet</Text>
        </View>
      ) : (
        <ScrollView style={styles.imageGrid}>
          {uploadedItems.map(item => (
            <View key={item.id} style={styles.imageContainer}>
              <Image
                source={{uri: item.uri}}
                style={styles.image}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveItem(item.id)}>
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
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
  },
  button: {
    flex: 1,
    backgroundColor: colors.button.secondary.background,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
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
    backgroundColor: colors.input.background,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default PhotoCapture;
