import axios from 'axios';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Controller} from 'react-hook-form';
import Icons from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'react-native-image-picker';
import {View, Text, Pressable, useToast, FormControl, Image} from 'native-base';

import {requestCameraPermission, storagePermission} from '../helpers/utility';
import CustomAlert from './CustomAlert';
import {getSignedUrl} from '../services/upload';
import { convertToFormData } from '../helpers/format';

const sources = [
  {name: 'Camera', iconName: require('../assets/images/camera.jpg')},
  // {name: 'Gallery', iconName: require('../assets/images/gallery.jpg')},
];

export const Upload = ({data}) => {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState('');

  function handleModal() {
    setOpen(prev => !prev);
  }

  function handleSelect(sourceName) {
    if (sourceName === 'Camera') {
      openCamera();
    } else if (sourceName === 'Gallery') {
      openGallery();
    }
  }

  async function uploadImage(files) {
    try {
      const file = files[0];
      const res = await getSignedUrl({key: file.fileName});
      const formData = convertToFormData(res, file);
      await axios.post(res.data.url, formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      data.uploadedFile({vehicle_photo_url: res.data.fields.key});
      setOpen(false);
      setUploadedFile(file);
      toast.show({
        description: 'File uploaded successfully',
        placement: 'bottom',
        duration: 1000,
        status: 'success',
      });
    } catch (error) {
      toast.show({
        description: 'Error uploading image, please try again',
        placement: 'bottom',
        duration: 1000,
        status: 'error',
      });
    }
  }

  async function openCamera() {
    const status = await requestCameraPermission();
    if (status) {
      try {
        const options = {mediaType: 'photo'};
        const files = await ImagePicker.launchCamera(options);
        uploadImage(files?.assets);
      } catch (error) {
        toast.show({
          placement: 'bottom',
          title: 'Something went wrong, please try again',
        });
        console.error('Something went wrong, please try again: ', error);
      }
    }
  }

  async function openGallery() {
    const status = await storagePermission();
    if (status) {
      try {
        const options = {mediaType: 'photo', selectionLimit: 1};
        const files = await ImagePicker.launchImageLibrary(options);
        uploadImage(files?.assets);
      } catch (error) {
        toast.show({
          placement: 'bottom',
          title: 'Something went wrong, please try again',
        });
        console.error('Something went wrong, please try again: ', error);
      }
    }
  }

  return (
    <View>
      <FormControl
        isRequired={data?.required !== false}
        isInvalid={data.key in data.errors}
        mt={1}>
        <FormControl.Label _text={{color: 'gray.700', fontSize: 13}}>
          {data.title}
        </FormControl.Label>
        <Controller
          defaultValue={data?.defaultValue}
          control={data.control}
          name={data.key}
          rules={{
            required: {
              value: data?.required !== false,
              message: data?.message ?? 'Required',
            },
            ...data?.rules,
          }}
          render={({field: {onChange, value}}) => (
            <View>
              <View alignItems="center" style={{width: '100%'}}>
                <Pressable onPress={handleModal} style={styles.takePicture}>
                  <Text>Upload Image {'  '} </Text>
                  <Icons name="upload" size={15} />
                </Pressable>
              </View>
              {data?.file?.vehicle_photo_url && (
                <Image
                  source={uploadedFile}
                  alt={uploadedFile?.fileName}
                  height="24"
                  width="32"
                  mt={2}
                />
              )}
              {open && (
                <CustomAlert
                  sources={[
                    {name: 'Camera', iconName: 'camera'},
                    {name: 'Gallery', iconName: 'photo'},
                  ]}
                  closeModal={handleModal}
                  handleSelect={handleSelect}
                />
              )}
            </View>
          )}
        />
        <FormControl.ErrorMessage>
          {data.errors?.[data.key]?.message}
        </FormControl.ErrorMessage>
      </FormControl>
      {open && (
        <CustomAlert
          sources={sources}
          closeModal={handleModal}
          handleSelect={handleSelect}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  takePicture: {
    margin: 4,
    padding: 10,
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    borderColor: '#D0D5DD',
    backgroundColor: '#fff',
  },
});
