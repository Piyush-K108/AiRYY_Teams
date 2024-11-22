import React, {useState, useEffect} from 'react';
import {DOMAIN} from '@env';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
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
  Dimensions
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import {launchCamera} from 'react-native-image-picker';
import axios from 'axios';

// Custom Checkbox Component
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
   const {width, height} = Dimensions.get('window');
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [kmNow, setKmNow] = useState('');
  const [isGoodCondition, setIsGoodCondition] = useState(false);
  const [isNotGoodCondition, setIsNotGoodCondition] = useState(false);
  const [carReading, setCarReading] = useState(null);
  const [depositeKm, setDepositeKm] = useState('');
  const navigation = useNavigation();

  // Fetch car data
  useEffect(() => {
    axios
      .get(`https://${DOMAIN}/Car/car-info/`)
      .then(response => {
        const carOptions = response.data
          .filter(car => car && car.modelName)
          .map(car => ({
            label: car.modelName || 'Unknown Model',
            value: car,
          }));
        setCars(carOptions);
      })
      .catch(error => {
        console.error('Error fetching car data:', error);
      });
  }, []);

  const handleSubmit = () => {
    if (depositeKm) {
      Alert.alert(
        'Car Deposit Confirmation',
        'The car has been deassigned successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('CarHome'),
          },
        ],
      );
    } else {
      Alert.alert(
        'Error',
        'Please fill the kilometers at the time of deposit.',
      );
    }
  };

  const handleCarSelect = car => {
    if (!car) return;
    if (car.modelName && car.KM_Now) {
      setSelectedCar(car.modelName);
      setKmNow(car.KM_Now);
    } else {
      Alert.alert('Error', 'Invalid car data selected. Please try again.');
    }
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      cameraType: 'back',
      saveToPhotos: true,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera picker');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setCarReading(response.assets[0]);
      }
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Deposite Car</Text>
          </View>
          {/* <View
            style={{
              height: height * 0.2, // Use height based on the screen size
              width: width * 0.5,
              position: 'relative',
              top: 70,
            }}>
            <LottieView
              style={{
                height: height * 0.3, // Adjust LottieView height dynamically
                width: width * 0.65, // Adjust LottieView width dynamically
                marginTop: -height * 0.05, // Adjust margin dynamically based on height
              }}
              source={require('../../../assets/Cardeposite.json')}
              autoPlay
              loop
            />
          </View> */}
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
              <RNPickerSelect
                onValueChange={handleCarSelect}
                items={cars}
                placeholder={{label: 'Select a Car', value: null}}
                value={selectedCar}
                style={pickerSelectStyles}
              />

              <TextInput
                placeholder="Current Km"
                value={String(kmNow)}
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
                <TouchableOpacity style={styles.button} onPress={openCamera}>
                  <Text style={styles.buttonText}>Capture Car Reading</Text>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color="#000"
                    style={{marginLeft: 10}}
                  />
                </TouchableOpacity>
                {carReading && (
                  <View style={styles.imagePreviewContainer}>
                    <Text style={styles.imageLabel}>Uploaded</Text>
                    <Image
                      source={{uri: carReading.uri}}
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
                value={depositeKm}
                onChangeText={setDepositeKm}
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
                onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
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
});

const styles = StyleSheet.create({
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
    letterSpacing:1 ,
  },
});

export default CarDepositeDetail;