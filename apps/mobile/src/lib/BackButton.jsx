import React from 'react';
import {Text, View} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import {StyleSheet, TouchableOpacity} from 'react-native';

export function BackButton({navigation, title, hide, noBorder}) {
  return (
    <View
      style={[
        styles.container,
        {
          borderBottomWidth: noBorder ? 0 : 1,
          borderBottomColor: noBorder ? 'transparent' : '#E5E5E5',
        },
      ]}>
      {!hide && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{marginRight: 16}}>
          <Icons
            size={30}
            name="chevron-back-outline"
            color="#000"
            style={{transform: [{scaleX: 0.8}]}}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.title} pt={1}>
        {title || ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#fff',
  },
  title: {
    color: '#101828',
    fontSize: 18,
    fontWeight: '600',
  },
});
