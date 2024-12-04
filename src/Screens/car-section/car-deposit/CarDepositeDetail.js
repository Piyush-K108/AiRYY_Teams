import React, {useState, useEffect} from 'react';
import {DOMAIN} from '@env';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Lottie from 'lottie-react-native';

import LottieContent from 'lottie-react-native';
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import {useNavigation, useFocusEffect} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import {launchCamera} from 'react-native-image-picker';
import {useRoute} from '@react-navigation/core';
import {Dropdown} from 'react-native-element-dropdown';
import {useSelector} from 'react-redux';
import axios from 'axios';
import RNFS from 'react-native-fs';
import opencamera from '../../../components/opencamera';

const CustomCheckBox = ({value, onValueChange}) => {
  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      style={styles.checkboxContainer}>
      <Ionicons
        name={value ? 'checkbox' : 'square-outline'}
        size={24}
        color="#eab308"
      />
    </TouchableOpacity>
  );
};

const CarDepositeDetail = () => {
  const [CarCondition, setCarCondition] = useState('good');
  const [refreshing, setRefreshing] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [Kilometer, setKilometer] = useState('');
  const route = useRoute();

  useEffect(() => {
    if (route.params && route.params.bid) {
      setcarid(route.params.bid);
    } else {
      setcarid('');
    }
  }, [route.params, CarData, navigation]);
  const {width, height} = Dimensions.get('window');
  const [carid, setcarid] = useState('');
  const phone = useSelector(state => state.counter.phone);
  const [cariderror, setcariderror] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();
  const [isGoodCondition, setIsGoodCondition] = useState(false);
  const [isNotGoodCondition, setIsNotGoodCondition] = useState(false);
  const [kilometerError, setKilometerError] = useState('');
  const [imageError, setImageError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');
  const [CarData, setCarData] = useState([]);
  const focusHandler = () => {
    console.log('API called');
    fetch(`https://${DOMAIN}/Car/caridsreturn/`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(responseJson => {
        setCarData(responseJson);
        if (responseJson.length > 0) {
          console.log(responseJson);
          setValue('');
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      focusHandler();
    }, []),
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    focusHandler();
    setRefreshing(false);
  }, []);

  const handleCarConditionChange = condition => {
    setCarCondition(condition);
  };

  const handleImageSelect2 = async () => {
    try {
      const result = await opencamera(phoneNumber, '_Adhar_Card.jpg');
      if (result) {
        setSelectedImage(result.path);
        setImageError('');
      } else {
        Alert.alert('Error', 'Failed to capture Image');
      }
    } catch (error) {
      console.log('Camera error: ', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred while capturing the image.',
      );
    }
  };

  // Function to create FormData object
  const createImageFormData = (imagePath, phoneNumber) => {
    const formData = new FormData();
    formData.append('Condition', CarCondition);
    formData.append('KM_Now', Kilometer);
    formData.append('carid', carid);
    formData.append('staff', phone);

    if (imagePath) {
      formData.append('Pic_after', {
        uri: imagePath,
        type: 'image/jpeg',
        name: `${phoneNumber}_After_Pic.jpg`,
      });
    }

    return formData;
  };

  const handleDeposit = () => {
    if (!validateFields()) {
      Alert.alert('Error', 'Fill All The Fields Again');
      setSelectedImage(null);
      return;
    }

    setIsLoading(true);

    const formData = createImageFormData(selectedImage, phoneNumber);

    fetch(`https://${DOMAIN}/Car/deassign_car/`, {
      method: 'PUT',
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        setIsLoading(false);
        if (responseJson.message) {
          Alert.alert('Done', `${responseJson.message}`, [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Offers', {
                  b_id: null,
                  carid: carid,
                  bikeCondition: '',
                  carCondition: CarCondition,
                });
              },
            },
          ]);
        } else {
          handleResponseErrors(responseJson);
        }
      })
      .catch(error => {
        console.error('Submission error: ', error);
        Alert.alert('Error', 'Failed to submit, please try again.');
        setIsLoading(false);
      });
  };
  const handleConditionChange = condition => {
    if (condition === 'good') {
      setIsGoodCondition(true);
      setIsNotGoodCondition(false);
    } else if (condition === 'notGood') {
      setIsGoodCondition(false);
      setIsNotGoodCondition(true);
    }
  };

  const handleResponseErrors = responseJson => {
    if (responseJson.Error) {
      Alert.alert('Error', responseJson.Error);
    } else if (responseJson.Error2) {
      Alert.alert('Error', responseJson.Error2);
      setSelectedImage(null);
    } else {
      Alert.alert('Error', 'An unknown error occurred.');
    }
  };

  const validateFields = () => {
    let isValid = true;

    if (!Kilometer) {
      setKilometerError('Please enter kilometers');
      isValid = false;
    } else {
      setKilometerError('');
    }

    if (!selectedImage) {
      setImageError('Please upload Car reading image');
      isValid = false;
    } else {
      setImageError('');
    }

    if (!carid) {
      setcariderror('Please choose carID');
      isValid = false;
    } else {
      setcariderror('');
    }

    return isValid;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Deposite Car</Text>
          </View>

          <View style={styles.Vcontainer}>
            <Lottie
              style={styles.video}
              source={require('../../../assets/carRental.json')} // Replace with your animation file path
              autoPlay
              loop
            />
          </View>
          <View style={styles.formSection}>
            <View
              style={{
                borderWidth: 1,
                padding: 40,
                backgroundColor: '#fff',
                margin: 30,
                borderRadius: 30,
                borderColor: '#e5e7eb',
              }}>
              <Text style={styles.sectionTitle}>Select Car</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={CarData}
                itemTextStyle={{color: '#000'}}
                maxHeight={300}
                labelField="label"
                placeholder="Select Car ID"
                placeholderTextColor="#000"
                onChange={item => {
                  const selectedcarId = item.label;
                  const value = item.value;
                  setcarid(selectedcarId);
                  setValue(value);
                }}
              />

              <TextInput
                placeholder="Current KM"
                value={`${String(value)} Current KM`}
                editable={false}
                style={styles.input}
                placeholderTextColor="#888"
              />
            </View>
            <View
              style={{
                backgroundColor: '#fff',
                marginLeft: 30,
                marginRight: 30,
                borderWidth: 1,
                borderColor: '#e5e7eb',
                borderRadius: 30,
                padding: 40,
              }}>
              <View style={styles.checkboxGroup}>
                <Text style={styles.sectionTitle}>Condition</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 15,
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.checkboxLabel}>Good</Text>
                    <CustomCheckBox
                      value={isGoodCondition}
                      onValueChange={() => handleConditionChange('good')}
                    />
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.checkboxLabel}>Not Good</Text>
                    <CustomCheckBox
                      value={isNotGoodCondition}
                      onValueChange={() => handleConditionChange('notGood')}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.uploadBtnContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleImageSelect2}>
                  <Text style={styles.buttonText}>Capture Car Reading</Text>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color="#000"
                    style={{marginLeft: 10}}
                  />
                </TouchableOpacity>
                {selectedImage && (
                  <View style={styles.imagePreviewContainer}>
                    <Text style={styles.imageLabel}>Uploaded</Text>
                    <Image
                      source={{uri: selectedImage}}
                      style={styles.uploadedImage}
                    />
                  </View>
                )}
              </View>
            </View>
            <View style={{marginLeft: 30, marginRight: 30, marginTop: 30}}>
              <TextInput
                style={styles.input}
                placeholderTextColor="#000"
                keyboardType="numeric"
                placeholder="Enter Km at Deposit"
                value={Kilometer}
                onChangeText={setKilometer}
              />
            </View>

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 40,
              }}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleDeposit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
            {isLoading && (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color="#000000" />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: 'black',
    backgroundColor: 'white',
    marginBottom: 20,
  },
  placeholderStyle: {
    fontSize: 15,
    color: '#000',
  },
  selectedTextStyle: {
    fontSize: 15,
    color: '#000',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fefce8',
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fefce8',
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fefce8',
  },
  header: {
    backgroundColor: '#fefce8',
    borderColor: '#d1d5db',
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    margin: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 20,
  },
  headerText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 25,
  },
  formSection: {
    // backgroundColor: '#fff',
    // borderRadius: 10,
    // padding: 20,
    // margin: 18,
    // borderWidth: 1,
    // borderColor: '#d1d5db',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    color: '#000',
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  checkboxGroup: {
    // backgroundColor: '#fff',

    flexDirection: 'column',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#000',
    marginRight: 12,
  },
  uploadBtnContainer: {
    flexDirection: 'Column',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',

    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fbbf24',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  imagePreviewContainer: {
    alignItems: 'center',
  },
  uploadedImage: {
    width: 180,
    height: 90,
    borderRadius: 10,
    resizeMode: 'contain',

    borderWidth: 1,
    borderColor: '#ccc',
  },
  imageLabel: {
    color: '#333',
    fontSize: 12,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 120,
    paddingVertical: 12,
    borderRadius: 10,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    letterSpacing: 1,
  },

  video: {
    width: 250,
    height: 230,
  },
  Vcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    width: 200,
  },
  dropdown: {
    height: 50,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 10,
    marginTop: 12,
    color: '#000',
    paddingLeft: 7,
    paddingRight: 15,
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
});

export default CarDepositeDetail;
