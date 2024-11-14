import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {shortenFileName} from '../../../utils/helperFunction';
import {launchCamera} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';
import EmergencyContact from '../car-components/EmergencyContacts';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';




const CarCustomerDetail = () => {
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState({
    name: '',
    contact: '',
    adharCardImage: null,
    licenseImage: null,
    altName: '',
    altContact: '',
    altAdharCardImage: null,
    altLicenseImage: null,
    emergencyContacts: [
      {emergencyName: '', emergencyContact: '', emergencyRelation: ''},
    ],
    selectedCar: '',
    carReading: '',
    carReadingImage: null,
  });

  const [cars] = useState([
    {label: 'Toyota Camry', value: 'Toyota Camry'},
    {label: 'Honda Civic', value: 'Honda Civic'},
    {label: 'Ford Mustang', value: 'Ford Mustang'},
    {label: 'Chevrolet Bolt', value: 'Chevrolet Bolt'},
    {label: 'Tesla Model S', value: 'Tesla Model S'},
  ]);

  const openCamera = field => {
    launchCamera({}, response => {
      if (response.assets) {
        const imageUri = response.assets[0].uri;
        const imageName =
          response.assets[0].fileName || imageUri.split('/').pop();
        setUserDetails(prevState => ({
          ...prevState,
          [field]: {uri: imageUri, name: imageName},
        }));
      }
    });
  };

  const handleInputChange = (field, index, subField, value) => {
    if (index !== undefined && subField) {
      const updatedContacts = [...userDetails.emergencyContacts];
      updatedContacts[index][subField] = value;
      setUserDetails(prevState => ({
        ...prevState,
        emergencyContacts: updatedContacts,
      }));
    } else {
      setUserDetails(prevState => ({
        ...prevState,
        [field]: value,
      }));
    }
  };

  const handleAddEmergencyContact = () => {
    setUserDetails(prevState => ({
      ...prevState,
      emergencyContacts: [
        ...prevState.emergencyContacts,
        {emergencyName: '', emergencyContact: '', emergencyRelation: ''},
      ],
    }));
  };

  const handleSubmit = async () => {
  navigation.navigate('CarDetail');
    // const apiUrl = 'https://your-api-endpoint.com/rent-car';

    // try {
    //   const response = await axios.post(apiUrl, userDetails);
    //   Alert.alert('Success', 'Data submitted successfully!');
    // } catch (error) {
    //   Alert.alert('Error', 'Failed to submit data');
    // }
  };

  return (
    <ScrollView style={styles.container}>
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
          Customer Detail
        </Text>
      </View>

      {/* Main Driver Info */}
      <View style={styles.mainDriverContainer}>
        <Text style={styles.sectionTitle}>Main Driver</Text>
        <TextInput
          placeholder="Name"
          value={userDetails.name}
          onChangeText={text => handleInputChange('name', text)}
          style={styles.input}
          placeholderTextColor="#888"
        />
        <TextInput
          placeholder="Contact Number"
          value={userDetails.contact}
          onChangeText={text => handleInputChange('contact', text)}
          keyboardType="phone-pad"
          style={styles.input}
          placeholderTextColor="#888"
        />

        <View style={styles.uploadBtnContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => openCamera('adharCardImage')}>
            <Text style={styles.buttonText}>Adhar Card</Text>
            <Ionicons
              name="cloud-upload-outline"
              size={20}
              color="#fff"
              style={{marginLeft: 10}}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => openCamera('licenseImage')}>
            <Text style={styles.buttonText}>License</Text>
            <Ionicons
              name="cloud-upload-outline"
              size={20}
              color="#fff"
              style={{marginLeft: 10}}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Alternate Driver Info */}
      <View style={styles.AlternateDriverContainer}>
        <Text style={styles.sectionTitle}>Alternate Driver</Text>
        <TextInput
          placeholder="Alternate Driver Name"
          value={userDetails.altName}
          onChangeText={text => handleInputChange('altName', text)}
          style={styles.input}
          placeholderTextColor="#888"
        />
        <TextInput
          placeholder="Alternate Driver Contact"
          value={userDetails.altContact}
          onChangeText={text => handleInputChange('altContact', text)}
          keyboardType="phone-pad"
          style={styles.input}
          placeholderTextColor="#888"
        />

        <View style={styles.uploadBtnContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => openCamera('altAdharCardImage')}>
            <Text style={styles.buttonText}>Adhar Card</Text>
            <Ionicons
              name="cloud-upload-outline"
              size={20}
              color="#fff"
              style={{marginLeft: 10}}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => openCamera('altLicenseImage')}>
            <Text style={styles.buttonText}>License</Text>
            <Ionicons
              name="cloud-upload-outline"
              size={20}
              color="#fff"
              style={{marginLeft: 10}}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Emergency Contact */}
      <EmergencyContact
        userDetails={userDetails}
        handleInputChange={handleInputChange}
        handleAddEmergencyContact={handleAddEmergencyContact}
      />

      {/* Submit Button */}
      <View style={{justifyContent: 'center', alignItems: 'center' , marginBottom:40}}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  mainDriverContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 30,
    marginBottom: 20,
  },
  AlternateDriverContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 30,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
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
    backgroundColor: '#172554',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
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
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  uploadBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default CarCustomerDetail;
