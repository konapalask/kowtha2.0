import React from 'react';
import {Image, Text, View} from 'react-native';

const Empty = ({text}) => {
  return (
    <View style={{width: '100%', alignItems: 'center', marginTop: 150}}>
      <Image
        style={{height: 120, width: 120}}
        source={require('../assets/images/empty.jpg')}
      />
      <Text color="#000" fontWeight="bold" marginTop={20}>
        {text ? text : 'No Records Found'}
      </Text>
    </View>
  );
};

export default Empty;
