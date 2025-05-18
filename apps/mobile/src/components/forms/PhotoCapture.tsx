import React, {useState} from 'react';
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
} from 'react-native-image-picker';
import RNLocation from 'react-native-get-location';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Geocoding from 'react-native-geocoding';
import {UploadedItem} from '../../types/verification';
import {colors} from '../../constants/colors';
import {
  getImageUploadPresignedUrl,
  uploadImageToS3,
} from '../../services/field.services';

// Initialize Geocoding
Geocoding.init('YOUR_GOOGLE_MAPS_API_KEY');

type PhotoCaptureProps = {
  onUploadedItemsChange: (items: UploadedItem[]) => void;
  initialItems?: UploadedItem[];
};

const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  onUploadedItemsChange,
  initialItems = [],
}) => {
  const [uploadedItems, setUploadedItems] =
    useState<UploadedItem[]>(initialItems);
  const [isUploading, setIsUploading] = useState(false);

  const getLocationDetails = async (latitude: number, longitude: number) => {
    try {
      const response = await Geocoding.from(latitude, longitude);
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

      return {locality, pincode};
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

  const uploadImage = async (imageUri: string, type: string) => {
    try {
      setIsUploading(true);

      // Generate a unique filename
      const timestamp = new Date().getTime();
      const fileName = `verification/${timestamp}-${Math.random()
        .toString(36)
        .substring(7)}.jpg`;

      // Get presigned URL
      const {
        data: {url: presignedUrl},
      } = await getImageUploadPresignedUrl(fileName, 'image/jpeg');

      // Convert image to blob
      const imageResponse = await fetch(imageUri);
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
      const newItem: UploadedItem = {
        id: Date.now().toString(),
        uri: imageUri,
        s3Url: fileName,
        type: 'photo',
        timestamp: new Date().toISOString(),
      };

      const updatedItems = [...uploadedItems, newItem];
      setUploadedItems(updatedItems);
      onUploadedItemsChange(updatedItems);

      Alert.alert('Success', 'Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to upload image. Please try again.',
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleCapture = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets && result.assets[0]) {
        await uploadImage(result.assets[0].uri || '', 'photo');
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo');
    }
  };

  const handleGallery = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result.assets && result.assets[0]) {
        await uploadImage(result.assets[0].uri || '', 'photo');
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
          style={[styles.button, isUploading && styles.buttonDisabled]}
          onPress={handleCapture}
          disabled={isUploading}>
          <Text style={styles.buttonText}>
            {isUploading ? 'Uploading...' : 'Take Photo'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, isUploading && styles.buttonDisabled]}
          onPress={handleGallery}
          disabled={isUploading}>
          <Text style={styles.buttonText}>
            {isUploading ? 'Uploading...' : 'Choose from Gallery'}
          </Text>
        </TouchableOpacity>
      </View>

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
});

export default PhotoCapture;
