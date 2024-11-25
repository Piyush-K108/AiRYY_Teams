import React, {useState, useEffect} from 'react';
import {DOMAIN} from '@env';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchCamera} from 'react-native-image-picker';
import axios from 'axios';

const CustomCheckBox = ({value, onValueChange}) => {
  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      style={styles.checkboxContainer}>
      <Ionicons
        name={value ? 'checkbox-outline' : 'square-outline'}
        size={24}
        color="#000"
      />
    </TouchableOpacity>
  );
};

const CarDetail = () => {
   const {width, height} = Dimensions.get('window');
     const navigation = useNavigation();
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState('');
  const [carDetails, setCarDetails] = useState({
    fuelType: '',
    KM_Now: '',
    carReadingImage: null,
  });
  const [rentalType, setRentalType] = useState('');
  const [rentalDuration, setRentalDuration] = useState('');
  const [advancePayment, setAdvancePayment] = useState(false);
  const [depositPayment, setDepositPayment] = useState(false);
  const [advanceUPI, setAdvanceUPI] = useState('');
  const [advanceCash, setAdvanceCash] = useState('');
  const [depositUPI, setDepositUPI] = useState('');
  const [depositCash, setDepositCash] = useState('');

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await axios.get(`https://${DOMAIN}/Car/car-info/`);
        const carOptions = response.data
          .filter(car => car && car.modelName)
          .map(car => ({
            label: car.modelName || 'Unknown Model',
            value: car,
          }));
        setCars(carOptions);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch car data');
      }
    };

    fetchCarData();
  }, []);

  const handleCarSelect = car => {
    if (car) {
      setSelectedCar(car.modelName || 'Unknown Model');
      setCarDetails({
        fuelType: car.fuelType || '',
        KM_Now: car.KM_Now || 0,
        carReadingImage: null,
      });
    }
  };

  const openCamera = () => {
    launchCamera({}, response => {
      if (response.assets) {
        const imageUri = response.assets[0].uri;
        const imageName =
          response.assets[0].fileName || imageUri.split('/').pop();
        setCarDetails(prevDetails => ({
          ...prevDetails,
          carReadingImage: {uri: imageUri, name: imageName},
        }));
      }
    });
  };

 const handleSubmit = () => {
   if (selectedCar) {
     Alert.alert(
       'Car Rental Confirmation',
       `Given the car ${selectedCar} to the user.`,
       [
         {
           text: 'OK',
           onPress: () => navigation.navigate('CarHome'),
         },
       ],
     );
   } else {
     Alert.alert('Error', 'Please select a car before submitting.');
   }
 };



  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View
          style={{
            backgroundColor: '#fefce8',
            paddingHorizontal: 20,
            paddingVertical: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 30,
            marginRight: 30,
            marginTop: 20,

            borderRightWidth: 1,
            borderLeftWidth: 1,
            borderColor: '#9ca3af',
            borderRadius: 20,
          }}>
          <Text
            style={{
              color: '#000',
              fontWeight: 'bold',
              fontSize: 25,
              textTransform: 'uppercase',
            }}>
            Car Detail
          </Text>
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
            source={require('../../../assets/cardetail.json')}
            autoPlay
            loop
          />
        </View> */}

        <View style={styles.carSelectionContainer}>
          <Text style={styles.sectionTitle}>Select Car</Text>
          <RNPickerSelect
            onValueChange={handleCarSelect}
            items={cars}
            placeholder={{label: 'Select a Car', value: null}}
            style={pickerSelectStyles}
          />

          <TextInput
            placeholder="Fuel Type"
            value={carDetails.fuelType}
            editable={false}
            style={styles.input}
            placeholderTextColor="#888"
          />

          <TextInput
            placeholder="KM Now"
            value={String(carDetails.KM_Now)}
            editable={false}
            style={styles.input}
            placeholderTextColor="#888"
          />

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
            {carDetails.carReadingImage && (
              <View style={styles.imagePreviewContainer}>
                <Text style={styles.imageLabel}>Uploaded</Text>
                <Image
                  source={{uri: carDetails.carReadingImage.uri}}
                  style={styles.uploadedImage}
                />
              </View>
            )}
          </View>
        </View>

        {/* Rental Type Section */}
        <View style={styles.carSelectionContainer}>
          <Text style={styles.sectionTitle}>Rental Type</Text>
          <RNPickerSelect
            onValueChange={value => setRentalType(value)}
            items={[
              {label: 'Hourly', value: 'hour'},
              {label: 'Daily', value: 'day'},
              {label: 'Monthly', value: 'month'},
            ]}
            placeholder={{label: 'Select Rental Type', value: null}}
            style={pickerSelectStyles}
          />

          {rentalType && (
            <TextInput
              placeholder={`Enter ${
                rentalType === 'hour'
                  ? 'KM'
                  : rentalType === 'day'
                  ? 'Days'
                  : 'Months'
              }`}
              value={rentalDuration}
              onChangeText={setRentalDuration}
              style={styles.input}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />
          )}
        </View>

        {/* Advance Payment Section */}
        <View style={styles.carSelectionContainer}>
          <Text style={styles.sectionTitle}>Advance Payment</Text>
          <CustomCheckBox
            value={advancePayment}
            onValueChange={setAdvancePayment}
          />
          {advancePayment && (
            <>
              <TextInput
                placeholder="Advance UPI Payment"
                value={advanceUPI}
                onChangeText={setAdvanceUPI}
                style={styles.input}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
              <TextInput
                placeholder="Advance Cash Payment"
                value={advanceCash}
                onChangeText={setAdvanceCash}
                style={styles.input}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </>
          )}
        </View>

        {/* Deposit Payment Section */}
        <View style={styles.carSelectionContainer}>
          <Text style={styles.sectionTitle}>Deposit Payment</Text>
          <CustomCheckBox
            value={depositPayment}
            onValueChange={setDepositPayment}
          />
          {depositPayment && (
            <>
              <TextInput
                placeholder="Deposit UPI Payment"
                value={depositUPI}
                onChangeText={setDepositUPI}
                style={styles.input}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
              <TextInput
                placeholder="Deposit Cash Payment"
                value={depositCash}
                onChangeText={setDepositCash}
                style={styles.input}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />
            </>
          )}
        </View>
      </View>
      {/* Submit Button */}
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 40,
        }}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    backgroundColor: '#fefce8',
  },
  container: {
    flex: 1,
  },
  carSelectionContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 30,
    marginBottom: 20,
    margin: 35,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  input: {
    color: '#000',
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fbbf24',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 13,
  },
  uploadBtnContainer: {
    flexDirection: 'row',
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
    marginBottom: 2,
    fontSize: 9,
  },
  uploadedImage: {
    width: 50,
    height: 40,
    borderRadius: 5,
  },
  checkboxContainer: {
    marginVertical: 10,
  },

  submitButton: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 20,
    paddingVertical: 12,
    width: '80%',

    borderRadius: 15,
    marginTop: 30,
    margin: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

const pickerSelectStyles = {
  inputAndroid: {
    color: '#000',
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  placeholder: {
    color: '#888',
  },
};

export default CarDetail;