import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useRoute} from '@react-navigation/core';
import {useNavigation} from '@react-navigation/core';
import SignatureCapture from 'react-native-signature-capture';
import {DOMAIN} from '@env';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Signature = () => {
  const signRef = useRef(); // Create a ref using the useRef hook
  const route = useRoute();
  const {phoneNumber, EV, userName, car} = route.params;

  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setresult] = useState(null);
  const [resulturi, setresulturi] = useState(null);

  const data = {
    data: result,
    uri: resulturi,
    type: 'image/jpeg',
    name: 'Signature',
  };

  const saveSignature = () => {
    // Access the ref and call the saveImage function if it exists
    if (signRef.current) {
      signRef.current.saveImage();
    }
  };

  const resetSignature = () => {
    // Access the ref and call the resetImage function if it exists
    if (signRef.current) {
      signRef.current.resetImage();
    }
  };

  const submitSignature = () => {
    if (!result || !resulturi) {
      // You should handle the case where the signature data is missing
      Alert.alert('Error', 'Please sign before submitting.');
      return;
    }
    setIsLoading(true);
    const signatureData = {
      data: result,
      uri: resulturi,
      type: 'image/jpeg',
      name: 'Signature.jpg',
    };
    const data = {
      Signature: signatureData,
    };

    fetch(`https://${DOMAIN}/Bike/getDocs/${phoneNumber}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(responseJson => {
        setTimeout(() => {
          if (responseJson.Error) {
            Alert.alert('Error', responseJson.Error);
          } else if (responseJson.message) {
            navigation.navigate('Emergency', {
              phoneNumber: phoneNumber,
              EV: EV,
              userName: userName,
              car:car
            });
          }
          setIsLoading(false);
        }, 500);
      })
      .catch(error => {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
        Alert.alert('Error', 'Try again!');
      });
  };

  const _onSaveEvent = result2 => {
    setresult(result2.encoded);
    setresulturi(result2.pathName);
  };

  const _onDragEvent = () => {};

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#feb101',
      }}>
      <View style={{height: 350}}>
        <SignatureCapture
          style={styles.signature}
          ref={signRef}
          onSaveEvent={_onSaveEvent}
          onDragEvent={_onDragEvent}
          saveImageFileInExtStorage={false}
          showNativeButtons={false}
          backgroundColor="black"
          strokeColor="white"
          showTitleLabel={true}
          minStrokeWidth={4}
          maxStrokeWidth={4}
          viewMode={'portrait'}
        />
      </View>
      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <TouchableOpacity style={styles.icon} onPress={resetSignature}>
          <Ionicons
            name={'refresh-outline'} // Use your preferred icon names
            size={35}
            color={'#feb101'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={saveSignature}>
          <Ionicons
            name={'bookmark-outline'} // Use your preferred icon names
            size={35}
            color={'#feb101'}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={submitSignature}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  signature: {
    flex: 1,
    borderColor: '#000',
    borderWidth: 1,
    margin: 20,
    marginTop: -80,
    color: '#000',
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  icon: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#000',
    height: 40,
    width: 100,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#feb101',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 17,
    letterSpacing: 1,
  },
});

export default Signature;
