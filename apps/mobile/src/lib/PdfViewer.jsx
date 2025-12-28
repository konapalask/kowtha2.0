import {View} from 'native-base';
import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import Pdf from 'react-native-pdf';

const PdfViewer = ({uri}) => {
  return (
    <View style={styles.container}>
      <Pdf
        trustAllCerts={false}
        source={{uri: uri}}
        style={styles.pdf}
        fitPolicy={2}
        showsHorizontalScrollIndicator={true}
        onLoadComplete={(numberOfPages, filePath) => {}}
        progressContainerStyle={{backgroundColor: 'blue.500'}}
        onError={error => {
          console.log(error);
        }}
        onPressLink={uri => {
          console.log(`Link pressed: ${uri}`);
        }}
      />
    </View>
  );
};

export default PdfViewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#eaecf0',
  },
  pdf: {
    flex: 1,
    height: '100%',
    width: Dimensions.get('window').width - 40,
  },
});
