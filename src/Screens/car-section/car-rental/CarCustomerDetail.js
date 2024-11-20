import React, {useState, useEffect} from 'react';
import LottieView from 'lottie-react-native';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EmergencyContact from '../car-components/EmergencyContacts';
import {useNavigation} from '@react-navigation/native';
import {DOMAIN} from '@env';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNFS from 'react-native-fs';
import {useSelector} from 'react-redux';

const CarCustomerDetail = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [count, setcount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [onn, setonn] = useState(false);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [isOptReceived, setIsOptReceived] = useState(false);
  const [User, setUser] = useState([]);
  const [userName, setUserName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Adharcard, setAdharcard] = useState('');
  const [Adharcardname, setAdharcardname] = useState('');
  const [Licensename, setLicensename] = useState('');
  const [License, setLicense] = useState('');
  const [userNameError, setuserNameError] = useState('');

  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [EmergencyCOntact, setEmergencyCOntact] = useState([]);
  const phone = useSelector(state => state.counter.phone);
  const [isActive, setisActive] = useState(true);

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
  });

  const options = {
    mediaType: 'photo',
    quality: 0.4,
    storageOptions: {
      skipBackup: true,
    },
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://${DOMAIN}/Bike/usercount/${phoneNumber}/`,
      );
      const data = await response.json();
      setcount(data);
      setonn(true);
      console.log(phoneNumber);
      const response2 = await fetch(
        `https://${DOMAIN}/User/Profile/${phoneNumber}/`,
      );
      const data2 = await response2.json();

      setUser(data2.data);
      setEmergencyCOntact(data2.emergency);

      if (data2.data) {
        const nameParts = data2.data.name.split(' ');
        setUserDetails(prev => ({
          ...prev,
          name: nameParts[0] || '',
          altName: nameParts[1] || '',
          adharCardImage: {
            uri: data2.data.Adhar_Card,
            name: `${phoneNumber}_Adhar_Card.jpg`,
          },
          licenseImage: {
            uri: data2.data.license_id,
            name: `${phoneNumber}_License.jpg`,
          },
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (phoneNumber.length >= 10) {
      setIsLoading(true);
      fetchData();
      setIsLoading(false);
    }
  }, [phoneNumber]);

  const handleVerify = () => {
    // Simulate sending OTP to user
    if (User) {
      console.log(User);
      // Trim any leading or trailing whitespace from the name
      const trimmedName = User.name.trim();

      // Split the name into parts based on space
      const nameParts = trimmedName.split(' ');

      // Extract first name and last name, assuming there is at least one space
      const fname = nameParts[0] || '';
      const lname = nameParts[1] || '';

      // Set the state with first name and last name
      setUserName(fname);
      setLastName(lname);
      setAdharcard(User.Adhar_Card);
      setAdharcardname(phoneNumber + '_Adhar_Card.jpg');
      setLicense(User.license_id);
      setLicensename(phoneNumber + '_License.jpg');
    } else {
      setisActive(false);
    }

    setIsLoadingOtp(true);
    setTimeout(() => {
      setIsLoadingOtp(false);
      setIsOptReceived(true);
    }, 3000); // Simulating a delay of 3 seconds for receiving OTP
  };

  const handleConfirmOtp = () => {
    setIsOptReceived(false);
  };

  const handleInputChange = (field, value) => {
    setUserDetails(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const openCamera = async field => {
    try {
      const result = await new Promise(resolve => {
        launchCamera(options, response => {
          if (response.assets) {
            const imageUri = response.assets[0].uri;
            const imageName = `${phoneNumber}_${field}.jpg`;
            resolve({uri: imageUri, name: imageName});
          } else {
            resolve(null);
          }
        });
      });

      if (result) {
        setUserDetails(prev => ({
          ...prev,
          [field]: result,
        }));
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to capture image');
    }
  };

  const handleSubmit = async () => {
    // setIsLoading(true);
    // const data = new FormData();

    // // Append main driver documents
    // if (userDetails.adharCardImage) {
    //   data.append('Adhar_Card', {
    //     uri: userDetails.adharCardImage.uri,
    //     type: 'image/jpeg',
    //     name: userDetails.adharCardImage.name,
    //   });
    // }

    // if (userDetails.licenseImage) {
    //   data.append('license_id', {
    //     uri: userDetails.licenseImage.uri,
    //     type: 'image/jpeg',
    //     name: userDetails.licenseImage.name,
    //   });
    // }

    // data.append('fname', userDetails.name);
    // data.append('lname', userDetails.altName);
    // data.append('EV', false);

    // try {
    //   const response = await fetch(
    //     `https://${DOMAIN}/Bike/assign_bike_to_user/${phoneNumber}/`,
    //     {
    //       method: 'PUT',
    //       body: data,
    //     },
    //   );

    //   const responseJson = await response.json();

    //   if (responseJson.Error) {
    //     Alert.alert('Error', responseJson.Error);
    //   } else if (User && User.Signature && !EmergencyCOntact) {
    //     navigation.navigate('EmergencyCar', {
    //       phoneNumber: phoneNumber,
    //       EV: false,
    //       userName: userDetails.name,
    //     });
    //   } else if (User && User.Signature && EmergencyCOntact) {
    //     navigation.navigate('CarDetails', {
    //       phoneNumber: phoneNumber,
    //       EV: false,
    //       userName: userDetails.name,
    //     });
    //   } else {
    //     navigation.navigate('AgreementPage', {
    //       phoneNumber: phoneNumber,
    //       EV: false,
    //       userName: userDetails.name,
    //       car: true,
    //     });
    //   }
    // } catch (error) {
    //   Alert.alert('Error', 'Something went wrong. Please try again.');
    // } finally {
    //   setIsLoading(false);
    // }

    navigation.navigate('CarDetail');
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

  return (
    <ScrollView style={styles.container}>
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
        <Text style={{color: '#000', fontWeight: 'bold', fontSize: 30}}>
          Customer Detail
        </Text>
      </View>
      <View
        style={{
          height: 150,
          width: 150,
        }}>
        <LottieView
          style={{height: 300, width: 250, marginTop: -65}}
          source={require('../../../assets/carRental.json')}
          autoPlay
          loop
        />
      </View>

      {/* Main Driver Info */}
      <View style={styles.mainDriverContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.sectionTitle}>Main Driver</Text>
          {phoneNumber.length >= 10 && (
            <Text style={styles.sectionTitle}>Count - {count}</Text>
          ) }
        </View>

        <View style={styles.inputContainer1}>
          <TextInput
            placeholder="Contact Number"
            value={userDetails.contact}
            onChangeText={text => {
              if (text.length < 10) {
                setonn(false);
              
              } else {
                setPhoneNumber(userDetails.contact);
                setonn(true);
              }
    
              handleInputChange('contact', text);
            }}
            keyboardType="phone-pad"
            style={[styles.input, {width: onn ? 220 : '100%'}]}
            placeholderTextColor="#888"
            maxLength={10}
          />

          {onn && (
            <View>
              {isLoadingOtp ? (
                <ActivityIndicator
                  style={{
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                    marginLeft: 5,
                    borderWidth: 1,
                    borderRadius: 10,
                  }}
                  size="small"
                  color="#000"
                />
              ) : isOptReceived ? (
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                    marginLeft: 5,
                    backgroundColor: '#fef08a',
                    borderWidth: 1,
                    borderRadius: 10,
                  }}
                  onPress={handleConfirmOtp}>
                  <Text style={styles.verifyButtonText}>✔</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: '#fef08a',
                    paddingHorizontal: 8,
                    paddingVertical: 12,
                    elevation: 6,
                    marginLeft: 5,
                  }}
                  onPress={handleVerify}>
                  <Text
                    style={[
                      styles.verifyButtonText,
                      {color: '#000', fontWeight: '600', fontSize: 12},
                    ]}>
                    Verify
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        <View style={{marginLeft: 20, marginBottom: 10}}>
          {userNameError ? (
            <Text style={styles.errorText}>{userNameError}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer2}>
          <TextInput
            placeholder="First Name"
            placeholderTextColor="#000"
            value={userName}
            onChangeText={text => setUserName(text)}
            style={[styles.input, styles.halfInput]} // Apply halfInput style for each TextInput
          />
          <TextInput
            placeholder="Last Name"
            placeholderTextColor="#000"
            value={LastName}
            onChangeText={text => setLastName(text)}
            style={[styles.input, styles.halfInput]} // Apply halfInput style for each TextInput
          />
        </View>

        <View style={styles.uploadBtnContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => openCamera('adharCardImage')}>
            <Text style={styles.buttonText}>Adhar Card</Text>
            <Ionicons
              name="cloud-upload-outline"
              size={20}
              color="#000"
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
              color="#000"
              style={{marginLeft: 10}}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Alternate Driver Info */}
      <View style={styles.AlternateDriverContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.sectionTitle}>Alternate Driver</Text>
          <Text style={styles.sectionTitle}>Count - 0</Text>
        </View>

        <TextInput
          placeholder="Alternate Driver Contact"
          value={userDetails.altContact}
          onChangeText={text => handleInputChange('altContact', text)}
          keyboardType="phone-pad"
          style={styles.input}
          placeholderTextColor="#888"
        />
        <TextInput
          placeholder="Alternate Driver Name"
          value={userDetails.altName}
          onChangeText={text => handleInputChange('altName', text)}
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
              color="#000"
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
              color="#000"
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
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 50,
        }}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fefce8',
  },
  inputContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  mainDriverContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 30,
    borderRadius: 30,
    marginBottom: 20,
    margin: 20,
    marginTop: -20,
  },
  AlternateDriverContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 30,
    marginBottom: 20,
    margin: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
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
    // maxWidth:'100%'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fbbf24',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#eab308',
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: '90%',
    borderRadius: 15,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  submitButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 13,
  },
  uploadBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default CarCustomerDetail;
