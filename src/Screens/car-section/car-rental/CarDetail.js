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
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';
import opencamera from '../../../components/opencamera';
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchCamera} from 'react-native-image-picker';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {useRoute} from '@react-navigation/core';
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
  const [BikePicture, setBikePicture] = useState(null);

  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState('');
  const [carDetails, setCarDetails] = useState({
    fuelType: '',
    KM_Now: '',
    carReadingImage: null,
    Pic_before: null,
  });
  const [TimeTaken, setTimeTaken] = useState('');

  const route = useRoute();
  const {phoneNumber,ALTphoneNumber} = route.params;
  const [rentalType, setRentalType] = useState('');

  const [advancePayment, setAdvancePayment] = useState(false);
  const [depositPayment, setDepositPayment] = useState(false);

  const [advanceUPI, setAdvanceUPI] = useState('');
  const [advanceCash, setAdvanceCash] = useState('');
  const [depositUPI, setDepositUPI] = useState('');
  const [depositCash, setDepositCash] = useState('');

  const phone = useSelector(state => state.counter.phone);

  const [calculatedValue] = useState(new Animated.Value(0));
  const [BikePictureError, setBikePictureError] = useState('');
  const [BikeReadingError, setBikeReadingError] = useState('');
  const [Estimated_Amount, setEstimatedCost] = useState(0);
  
  const handalAmount = () => {
    let timeInHours = parseFloat(TimeTaken); // Ensure TimeTaken is a valid number
   
    // Handle case where TimeTaken is invalid or not a number
    if (isNaN(timeInHours)) {
      return 0;
    }
    if (rentalType === 'days') {
      timeInHours *= 24;
    } else if (rentalType === 'months') {
      timeInHours *= 24 * 30; // Assuming 1 month = 30 days
    }

    const days = Math.floor(timeInHours / 24);
    const remainingHours = timeInHours % 24;
    console.log(selectedCar.ratePerHour)
    const cost =
      days * 1000 +
      Math.floor(remainingHours / 12) * 500 +
      (remainingHours % 12) * selectedCar.ratePerHour;

      console.log(cost)
      setEstimatedCost(cost);
  };
  const [TimeTakenerror, setTimeTakenerror] = useState('');
  const validateFields = () => {
    let isValid = true;

    if (!TimeTaken) {
      setTimeTakenerror(`Please enter expected ${rentalType}`);

      isValid = false;
    } else {
      setTimeTakenerror('');
    }

    if (!carDetails) {
      setBikeReadingError('Please upload Bike Reading Picture');
      isValid = false;
    } else {
      setBikeReadingError('');
    }

    if (!BikePicture) {
      setBikePictureError('Please upload Bike Condition Picture');
      isValid = false;
    } else {
      setBikePictureError('');
    }
   

    return isValid;
  };
  const calculateValue = () => {
    let timeInHours = parseFloat(TimeTaken); // Ensure TimeTaken is a valid number

    // Handle case where TimeTaken is invalid or not a number
    if (isNaN(timeInHours)) {
      return 0;
    }

    // Convert days or months to hours
    if (rentalType === 'days') {
      timeInHours *= 24;
    } else if (rentalType === 'months') {
      timeInHours *= 24 * 30; // Assuming 1 month = 30 days
    }

    const days = Math.floor(timeInHours / 24);
    const remainingHours = timeInHours % 24;
    const cost =
      days * 700 +
      Math.floor(remainingHours / 12) * 400 +
      (remainingHours % 12) * selectedCar.ratePerHour;
   
    return cost;
  };

  useEffect(() => {
    const newValue = calculateValue();

    if (!isNaN(newValue)) {
      Animated.timing(calculatedValue, {
        toValue: newValue,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [TimeTaken, rentalType]);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await axios.get(`https://${DOMAIN}/Car/car-info-rent/`);
        console.log("response",response.data)
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
      setSelectedCar(car);
      setCarDetails({
        fuelType: car.fuelType || '',
        KM_Now: car.KM_Now || 0,
        carReadingImage: null,
      });
    }
  };

  const openCamera2 = () => {
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

  const handleBikePicturePicker = async () => {
    try {
      const result = await opencamera(phoneNumber, '_Adhar_Card.jpg');
      if (result) {
        setBikePicture(result.path);
        setBikePictureError('');
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
    handalAmount()
  };
  const handleSubmit = async () => {
    if (!validateFields()) {
      Alert.alert('Error', 'Please fill all the required fields.');
      return;
    }
    // Validate required fields
    if (!selectedCar || !rentalType || !TimeTaken || !phoneNumber) {
      console.log("SelectedCar",selectedCar,"rentalType", rentalType,"TimeTaken", TimeTaken, "phoneNumber",phoneNumber);
      Alert.alert('Error', 'Please fill all the required fields.');
      return;
    }
  
    let timeInHours = parseFloat(TimeTaken);
    if (rentalType === 'days') {
      timeInHours *= 24;
    } else if (rentalType === 'months') {
      timeInHours *= 24 * 30; // Assuming 1 month = 30 days
    }

    try {
      // Prepare data payload
      const totalReturnAmount = parseInt(depositCash?depositCash:0) + parseInt(depositUPI?depositUPI:0);
      const formData = new FormData();
      formData.append(
        'return',
        `cash = ${parseInt(depositCash?depositCash:0)} upi = ${parseInt(depositUPI?depositUPI:0)} total = ${totalReturnAmount}`
      );
      formData.append('staff', phone);
      formData.append('Persnal', 0);
      formData.append('altphone', ALTphoneNumber);

      formData.append('AdvancePay', parseInt(advanceCash) + parseInt(advanceUPI));
      formData.append('AdvancePayUPI', advanceUPI || 0); 
      formData.append('AdvancePayCash', advanceCash || 0); 
      formData.append('carid', selectedCar.carid);
      if (BikePicture) {
        const bikePictureData = {
          uri: BikePicture,
          type: 'image/jpeg',
          name: `${phoneNumber}_Previous_Pic.jpg`,
        };
        formData.append('Pic_before', bikePictureData);
      }
      if (carDetails.carReadingImage) {
        formData.append('KM_Reading', {
          uri: carDetails.carReadingImage.uri,
          name: carDetails.carReadingImage.name,
          type: 'image/jpeg',
        });
      }
      formData.append('TimeThought', TimeTaken);
      formData.append('Estimated_Amount', Estimated_Amount? Estimated_Amount:0);


      const response = await axios.put(
        `https://${DOMAIN}/Car/assign_car_to_car/${phoneNumber}/`,
        formData,
        {
          headers: {'Content-Type': 'multipart/form-data'},
        },
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          'Car Rental Confirmation',
          `Given the car ${selectedCar.modelName} to the user.`,
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('CarDrawerNavigator'),
            },
          ],
        );
      } else {
        throw new Error('Failed to save car rental details');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred. Please try again later.');
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
        <View
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
            source={require('../../../assets/carRental.json')}
            autoPlay
            loop
          />
        </View>

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
            <TouchableOpacity style={styles.button} onPress={openCamera2}>
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
              {label: 'Daily', value: 'days'},
              {label: 'Monthly', value: 'months'},
            ]}
            placeholder={{label: 'Select Rental Type', value: null}}
            style={pickerSelectStyles}
          />

          {rentalType && (
            <TextInput
              placeholder={`Enter ${
                rentalType === 'hour'
                  ? 'Hours'
                  : rentalType === 'da'
                  ? 'Days'
                  : 'Months'
              }`}
              value={TimeTaken}
              onChangeText={setTimeTaken}
              style={styles.input}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />
          )}
        </View>
        <View style={styles.carSelectionContainer}>
          {BikePictureError ? (
            <Text style={styles.errorText}>{BikePictureError}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.inputContainer, styles.documentPicker]}
            onPress={handleBikePicturePicker}>
            <Text style={styles.uploadText}>
              Click to Upload Bike Condition.
            </Text>
          </TouchableOpacity>
          
          {BikePicture && (
            <View style={styles.imageContainer}>
              <Image source={{uri: BikePicture}} style={styles.image} />
              <Text style={styles.imageText}>Bike Condition pic</Text>
            </View>
          )}
        </View>
        <View style={styles.carSelectionContainer}>
          <View style={styles.animatedContainer}>
            <Animated.Text
              style={[styles.calculatedValue, {opacity: calculatedValue}]}>
              <Text>₹</Text> {calculateValue()}
            </Animated.Text>
          </View>
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
  inputContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    width: '100%',
  },
  documentPicker: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    color: 'black',
  },

  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    width: '100%',
  },
  image: {
    width: 250,
    height: 180,
    borderRadius: 10,
  },
  imageText: {
    color: '#228B22',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 30,
    marginBottom: -30,
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
    fontWeight: 'bold',
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
  calculatedValue: {
    fontSize: 20,
    color: 'green',
    alignSelf: 'center',
  },
  animatedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: '100%',
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 6,
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
