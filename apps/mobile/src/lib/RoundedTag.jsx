import {Box, Text} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';

const RoundedTag = ({
  text,
  roundSize = 'full',
  icon = null,
  type = '',
  ...props
}) => {
  const getStatusColor = status => {
    switch (status) {
      case 'Active':
        return {
          bg: '#ECFDF3',
          borderColor: '#ABEFC6',
          color: '#067647',
        };
      case 'Older':
        return {
          bg: '#F9FAFB',
          borderColor: '#EAECF0',
          color: '#344054',
        };
      case 'date':
        return {
          bg: '#EFF8FF',
          borderColor: '#B2DDFF',
          color: '#175CD3',
        };
      case 'scaleStatus':
        return {
          bg: '#FFFAEB',
          borderColor: '#FEDF89',
          color: '#B54708',
        };
      default:
        return {
          bg: '#F9F5FF',
          borderColor: '#E9D7FE',
          color: '#6941C6',
        };
    }
  };

  const {bg, borderColor, color} = getStatusColor(type !== '' ? type : text);

  return (
    <Box
      style={styles.tagContainer}
      bg={bg}
      rounded={roundSize}
      borderWidth="1"
      borderColor={borderColor}
      {...props}>
      {icon && icon}
      <Text color={color} fontWeight={500} fontSize={10}>
        {text}
      </Text>
    </Box>
  );
};

export default RoundedTag;

const styles = StyleSheet.create({
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 4,
  },
});
