import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {DOMAIN} from '@env';
import RNPickerSelect from 'react-native-picker-select';

const CarPersonalUse = () => {
  const [contactNumber, setContactNumber] = useState('');
  const [selectedCarId, setSelectedCarId] = useState('');
  const [cars, setCars] = useState([]);
  const [currentKilometer, setCurrentKilometer] = useState('');
  const [usageHours, setUsageHours] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [TextArea, setTextArea] = useState('');

  // Fetch cars from the API
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://${DOMAIN}/Car/car-info/`);
        const data = await response.json();
        setCars(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch cars data!');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Update the current kilometer field based on the selected car
  useEffect(() => {
    if (selectedCarId) {
      const selectedCar = cars.find(car => car.carid === selectedCarId);
      if (selectedCar) {
        setCurrentKilometer(selectedCar.KM_Now.toString());
      }
    }
  }, [selectedCarId, cars]);

  const validateFields = () => {
    const newErrors = {};

    if (!contactNumber) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (contactNumber.length < 10) {
      newErrors.contactNumber = 'Contact number must be at least 10 digits';
    }

    if (!selectedCarId) {
      newErrors.selectedCarId = 'Please select a car';
    }

    if (!usageHours) {
      newErrors.usageHours = 'Usage duration is required';
    } else if (isNaN(usageHours) || parseFloat(usageHours) <= 0) {
      newErrors.usageHours = 'Please enter a valid number of hours';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = () => {
    if (!validateFields()) {
      return;
    }

    // Handle form submission logic here
    Alert.alert('Success', 'Details submitted successfully!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fef9c3',
          paddingHorizontal: 20,
          paddingVertical: 20,
          borderRadius: 20,
          marginBottom: 30,
          borderWidth: 1,
        }}>
        <Text style={styles.header}>Personal Use Details.</Text>
      </View>

      <View
        style={{
          backgroundColor: '#FFF',
          paddingHorizontal: 20,
          paddingVertical: 40,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#f3f4f6',
        }}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter contact number"
            keyboardType="phone-pad"
            placeholderTextColor="#888"
            value={contactNumber}
            onChangeText={setContactNumber}
          />
          {errors.contactNumber && (
            <Text style={styles.errorText}>{errors.contactNumber}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Car</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <RNPickerSelect
              onValueChange={value => setSelectedCarId(value)}
              items={cars.map(car => ({
                label: `${car.modelName} (${car.license_plate})`,
                value: car.carid,
              }))}
              placeholder={{
                label: 'Select a car',
                value: null,
              }}
              style={pickerSelectStyles}
            />
          )}
          {errors.selectedCarId && (
            <Text style={styles.errorText}>{errors.selectedCarId}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Car Current Kilometer</Text>
          <TextInput
            style={styles.input}
            placeholder="Car current kilometer"
            placeholderTextColor="#888"
            value={currentKilometer}
            editable={false} // Prevent manual input as it's auto-populated
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Usage Duration (hours)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter hours of usage"
            keyboardType="numeric"
            placeholderTextColor="#888"
            value={usageHours}
            onChangeText={setUsageHours}
          />
          {errors.usageHours && (
            <Text style={styles.errorText}>{errors.usageHours}</Text>
          )}
        </View>
        <TextInput
            placeholder="Reson For Use"
            multiline={true}
            numberOfLines={4}
            value={TextArea}
            placeholderTextColor="#000"
            onChangeText={text => setTextArea(text)}
            style={styles.inputKm}></TextInput>


        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    padding: 40,
  },
  inputKm: {
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    marginBottom: 20,
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#facc15',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  inputAndroid: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
});

export default CarPersonalUse;
