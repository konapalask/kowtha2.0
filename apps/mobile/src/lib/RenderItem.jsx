import React from 'react';
import {Image} from 'react-native';
import {SvgUri} from 'react-native-svg';
import PdfIcon from '../assets/images/pdf.svg';
import ImageFallback from '../assets/fallback/imagefallback.svg';

export const RenderItem = ({image, size}) => {
  if (image?.type === 'application/pdf') {
    return <PdfIcon width={size} height={size} />;
  } else if (image?.type === 'image/svg+xml') {
    return image?.url ? (
      <SvgUri uri={image?.url} width={size} height={size} />
    ) : (
      <ImageFallback width={size} height={size} />
    );
  } else {
    return image?.url ? (
      <Image
        source={{uri: image?.url}}
        style={{
          width: size,
          height: size,
          borderRadius: 5,
          marginBottom: 8,
        }}
      />
    ) : (
      <ImageFallback width={size} height={size} />
    );
  }
};
