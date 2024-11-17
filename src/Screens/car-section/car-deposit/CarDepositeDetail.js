import React, {useState, useEffect} from 'react';
import {DOMAIN} from '@env';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image
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
        color="#172554"
      />
    </TouchableOpacity>
  );
};

const CarDepositeDetail = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null); // or set a default car object if you have one

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
    if (!car) {
      // Do nothing if car is null (initial load)
      return;
    }

    if (car.modelName && car.KM_Now) {
      setSelectedCar(car.modelName);
      setKmNow(car.KM_Now);
    } else {
      console.error('Invalid car data selected:', car);
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: '#eff6ff',
            paddingHorizontal: 20,
            paddingVertical: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
            borderRadius: 20,
            elevation: 1,
          }}>
          <Text style={{color: '#000', fontWeight: 'bold', fontSize: 25}}>
            Deposite Car
          </Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Select Car</Text>
          <RNPickerSelect
            onValueChange={handleCarSelect}
            items={cars}
            placeholder={{label: 'Select a Car', value: null}}
            value={selectedCar} // set the initial selected value here
            style={pickerSelectStyles}
          />

          <TextInput
            placeholder="Current Km"
            value={String(kmNow)}
            editable={false}
            style={styles.input}
            placeholderTextColor="#888"
          />

          <View style={styles.checkboxGroup}>
            <Text style={styles.sectionTitle}>Condition</Text>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <CustomCheckBox
                value={isGoodCondition}
                onValueChange={() => handleConditionChange('good')}
              />
              <Text style={styles.checkboxLabel}>Good</Text>
              <CustomCheckBox
                value={isNotGoodCondition}
                onValueChange={() => handleConditionChange('notGood')}
              />
              <Text style={styles.checkboxLabel}>Not Good</Text>
            </View>
          </View>
          <View style={styles.uploadBtnContainer}>
            <TouchableOpacity style={styles.button} onPress={openCamera}>
              <Text style={styles.buttonText}>Capture Car Reading</Text>
              <Ionicons
                name="cloud-upload-outline"
                size={20}
                color="#fff"
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

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter Km at Deposit"
            value={depositeKm}
            onChangeText={setDepositeKm}
          />

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
  scrollContainer: {
    // flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    // height:'100%'
  },
  container: {
    // flex: 1,
    backgroundColor: '#f9f9f9',
    height:'100%' 
  },

  formSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    // elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
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
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 10,
    backgroundColor: 'transparent',
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: '#172554',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 12,
  },
  uploadedText: {
    marginTop: 10,
    color: '#4CAF50',
    fontSize: 14,
  },

  submitButton: {
    backgroundColor: '#86efac',
    paddingHorizontal: 20,
    paddingVertical: 15,
    width: '100%',
    borderRadius: 15,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#172554',
    paddingHorizontal: 75,
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  uploadBtnContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  imagePreviewContainer: {
    alignItems: 'center',
  },
  imageLabel: {
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 9,
  },
  uploadedImage: {
    width: 280,
    height: 150,
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default CarDepositeDetail;
