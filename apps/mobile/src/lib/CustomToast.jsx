import React from 'react';
import {Text, Box} from 'native-base';

const CustomToast = ({type, title}) => {
  let bgColor, textColor;

  switch (type) {
    case 'success':
      bgColor = 'green.200';
      textColor = 'warmGray.900';
      break;
    case 'error':
      bgColor = 'red.200';
      textColor = 'warmGray.900';
      break;
    case 'refresh':
      bgColor = 'black';
      textColor = 'white';
      break;
    default:
      bgColor = 'gray.200';
      textColor = 'warmGray.900';
  }

  return (
    <Box bg={bgColor} px="2" py="1" rounded="sm" mb={5}>
      <Text color={textColor}>{title}</Text>
    </Box>
  );
};

export default CustomToast;
