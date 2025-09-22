import React, {useRef} from 'react';
import {StyleSheet} from 'react-native';
import {AlertDialog, View, Pressable, Image, Text} from 'native-base';

const CustomAlert = ({sources, closeModal, handleSelect}) => {
  const cancelRef = useRef(null);
  return (
    <AlertDialog isOpen leastDestructiveRef={cancelRef}>
      <AlertDialog.Content style={{backgroundColor: '#fff'}}>
        <AlertDialog.CloseButton onPress={closeModal} />
        <AlertDialog.Header style={{backgroundColor: '#fff'}}>
          <Text>Choose Image</Text>
        </AlertDialog.Header>
        <View style={styles.sourceOptions}>
          {sources.map(source => (
            <Pressable
              key={source.name}
              onPress={() => handleSelect(source.name)}
              style={{marginHorizontal: 40, alignItems: 'center'}}>
              <Image
                style={{height: 50, width: 50}}
                resizeMode="contain"
                alt={source.name}
                source={source.iconName}
              />
              <Text>{source.name}</Text>
            </Pressable>
          ))}
        </View>
      </AlertDialog.Content>
    </AlertDialog>
  );
};
export default CustomAlert;
const styles = StyleSheet.create({
  sourceOptions: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
