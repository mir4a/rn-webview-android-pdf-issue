import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import WebView from 'react-native-webview';
import PDFReader from 'rn-pdf-reader-js';

export function ModalPDF({source, visible, onClose}) {
  const [loading, setLoading] = useState(true);
  const hitSlop = {
    bottom: 20,
    left: 40,
    right: 40,
    top: 20,
  };

  const handleLoadComplete = useCallback(() => {
    setLoading(false)
  }, [])

  const handleError = useCallback((err) => {
    console.warn('ModalPDF error: ', err)
  }, [])

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.modal}>
        <View style={styles.modalHeader}>
          <View style={styles.close}>
            <TouchableOpacity onPress={onClose} hitSlop={hitSlop}>
              <Text>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="red" />
          </View>
        )}
        <View style={styles.pdfContainer}>
          <PDFReader
            style={styles.pdfViewer}
            source={source}
            onError={handleError}
            onLoadEnd={handleLoadComplete}
            withPinchZoom={true}
            noLoader={true}
          />
        </View>
      </SafeAreaView>
    </Modal>
  )
}

export default function App() {
  const [showModalPDF, setShowModalPDF] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const webViewRef = useRef(null);

  const handleLoad = useCallback(
    async ({nativeEvent}) => {

      console.warn('ssss: ', nativeEvent);
      console.warn('wwwww: ', nativeEvent.url);
      const {url} = nativeEvent;
      console.warn('handleLoad: ', url);

      if (url.includes('Test_PDF.pdf')) {
        setShowModalPDF(true);
        setPdfUrl(url)
        webViewRef.current.stopLoading()
      }
  },[]);

  const handleNavigationStateChange = useCallback(
    async ({ url }) => {
      console.warn(url);
    }, []);

  const handleModalClose = useCallback(()=>{
    setShowModalPDF(false);
  }, [setShowModalPDF])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>Open up App.js to start working on your app!</Text>
      </View>
      <StatusBar style="auto" />
      <View style={styles.webview}>
        <WebView
          ref={webViewRef}
          onNavigationStateChange={handleNavigationStateChange}
          withAuthentication={false}
          source={{ uri: "https://www.mir4a.pp.ua/rn-webview-android-pdf-issue/" }}
          onLoadStart={handleLoad}
          onLoadProgress={handleLoad}
          onLoadEnd={handleLoad}
          enableTimeout={false}
        />
      </View>
      <ModalPDF source={{uri: pdfUrl}} visible={showModalPDF} onClose={handleModalClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    height: 50,
    width: '100%',
    backgroundColor: 'yellow'
  },
  webview: {
    flex: 1,
    width: '100%',
    backgroundColor: 'blue'
  },
  modal: {
    flex: 1
  },
  pdfContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pdfViewer: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loader: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  close: {
    transform: [{ rotateZ: '45deg' }],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 56,
    alignItems: 'center',
    paddingHorizontal: 14,
  },
});
