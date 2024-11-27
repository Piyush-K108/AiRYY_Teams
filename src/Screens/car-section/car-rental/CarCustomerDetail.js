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
  Dimensions,
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
  const {width, height} = Dimensions.get('window');
  const [isLoading, setIsLoading] = useState(false);
  const [User, setUser] = useState([]);
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [Adharcard, setAdharcard] = useState('');
  const [Adharcardname, setAdharcardname] = useState('');
  const [Licensename, setLicensename] = useState('');
  const [License, setLicense] = useState('');

  const [ALTUser, setALTUser] = useState([]);
  const [ALTFirstName, setALTFirstName] = useState('');
  const [ALTLastName, setALTLastName] = useState('');
  const [ALTphoneNumber, setALTPhoneNumber] = useState('');
  const [ALTAdharcard, setALTAdharcard] = useState('');
  const [ALTAdharcardname, setALTAdharcardname] = useState('');
  const [ALTLicensename, setALTLicensename] = useState('');
  const [ALTLicense, setALTLicense] = useState('');

  const [EmergencyCOntact, setEmergencyCOntact] = useState([]);

  const [isActive, setisActive] = useState(true);
  const [isActive2, setisActive2] = useState(true);

  const [OTP, setOTP] = useState(false);
  const [isDocument, setisDocument] = useState(false);
  const [isChanged, setisChanged] = useState(false);

  const [count, setcount] = useState('');
  const [onn, setonn] = useState(false);
  const [count2, setcount2] = useState('');
  const [onn2, setonn2] = useState(false);

  const [FirstNameError, setFirstNameError] = useState('');
  const [LastNameError, setLastNameError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [adharCardError, setAdharCardError] = useState('');
  const [licenseError, setLicenseError] = useState('');

  const [ALTFirstNameError, setALTFirstNameError] = useState('');
  const [ALTLastNameError, setALTLastNameError] = useState('');
  const [ALTphoneNumberError, setALTPhoneNumberError] = useState('');
  const [ALTadharCardError, setALTAdharCardError] = useState('');
  const [ALTlicenseError, setALTLicenseError] = useState('');

  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [isOptReceived, setIsOptReceived] = useState(false);

  const [isLoadingOtp2, setIsLoadingOtp2] = useState(false);
  const [isOptReceived2, setIsOptReceived2] = useState(false);

  const [emergencyContact, setemergencyContact] = useState({
    emergencyName: '',
    emergencyContact: '',
    emergencyRelation: '',
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

      const response2 = await fetch(
        `https://${DOMAIN}/User/Profile/${phoneNumber}/`,
      );
      const data2 = await response2.json();

      setUser(data2.data);
      setEmergencyCOntact(data2.emergency);

      //  else {
      //   // otp logic
      //   // const response = await fetch(
      //   //   `https://${DOMAIN}/Bike/sendotp/${phoneNumber}/`,
      //   // );
      // }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchData2 = async () => {
    try {
      const response = await fetch(
        `https://${DOMAIN}/Bike/usercount/${ALTphoneNumber}/`,
      );
      const data = await response.json();
      setcount2(data);
      setonn2(true);
      const response2 = await fetch(
        `https://${DOMAIN}/User/Profile/${ALTphoneNumber}/`,
      );
      const data2 = await response2.json();

      setALTUser(data2.data);

      //  else {
      //   // otp logic
      //   // const response = await fetch(
      //   //   `https://${DOMAIN}/Bike/sendotp/${phoneNumber}/`,
      //   // );
      // }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (phoneNumber.length >= 10) {
      setIsLoading(true);
      fetchData();
    }
    if (ALTphoneNumber.length >= 10) {
      setIsLoading(true);
      fetchData2();
    }
    setIsLoading(false);
  }, [phoneNumber, ALTphoneNumber]);

  const handleVerify = phone => {
    // Simulate sending OTP to user
    if (phone == phoneNumber) {
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
        setFirstName(fname);
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
    } else {
      if (ALTUser) {
        console.log(ALTUser);
        // Trim any leading or trailing whitespace from the name
        const trimmedName = ALTUser.name.trim();

        // Split the name into parts based on space
        const nameParts = trimmedName.split(' ');

        // Extract first name and last name, assuming there is at least one space
        const ALTfname = nameParts[0] || '';
        const ALTlname = nameParts[1] || '';

        // Set the state with first name and last name
        setALTFirstName(ALTfname);
        setALTLastName(ALTlname);
        setALTAdharcard(ALTUser.Adhar_Card);
        setALTAdharcardname(ALTphoneNumber + '_Adhar_Card.jpg');
        setALTLicense(ALTUser.license_id);
        setALTLicensename(ALTphoneNumber + '_License.jpg');
      } else {
        setisActive2(false);
      }

      setIsLoadingOtp2(true);
      setTimeout(() => {
        setIsLoadingOtp2(false);
        setIsOptReceived2(true);
      }, 3000); // Simulating a delay of 3 seconds for receiving OTP
    }
  };

  const handleConfirmOtp = () => {
    setIsOptReceived(false);
  };
  const handleConfirmOtp2 = () => {
    setIsOptReceived2(false);
  };

  const handleInputChange = (field, index, subfield, value) => {
    setemergencyContact(prevState => ({
      ...prevState,
      [field]: prevState[field].map((item, idx) => {
        if (idx === index) {
          return {...item, [subfield]: value};
        }
        return item;
      }),
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
        if (field === 'Adhar_Card') {
          setAdharcard(result.uri);
          setAdharcardname(result.name);
        } else if (field === 'license_id') {
          setLicense(result.uri);
          setLicensename(result.name);
        }
      } else {
        Alert.alert('Error', 'Failed to capture image');
      }
      if (field === 'ALTAdhar_Card') {
        setALTAdharcard(result.uri);
        setALTAdharcardname(result.name);
      } else if (field === 'ALTlicense_id') {
        setALTLicense(result.uri);
        setALTLicensename(result.name);
      } else {
        Alert.alert('Error', 'Failed to capture image');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to capture image');
    }
  };
  const validateFields = () => {
    let isValid = true;

    if (!License || !Licensename) {
      setLicenseError('Please upload License for Petrol Bikes');
      isValid = false;
    } else {
      setLicenseError('');
    }

    if (!Adharcard || !Adharcardname) {
      setAdharCardError('Please upload Adhar Card for Petrol Bikes');
      isValid = false;
    } else {
      setAdharCardError('');
    }

    if (!ALTLicense || !ALTLicensename) {
      setALTLicenseError('Please upload License for Petrol Bikes');
      isValid = false;
    } else {
      setALTLicenseError('');
    }

    if (!ALTAdharcard || !ALTAdharcardname) {
      setALTAdharCardError('Please upload Adhar Card for Petrol Bikes');
      isValid = false;
    } else {
      setALTAdharCardError('');
    }

    if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 10) {
      setPhoneNumberError('Please enter correct Phone Number');
      isValid = false;
    } else {
      setPhoneNumberError('');
    }
    if (
      !ALTphoneNumber ||
      ALTphoneNumber.length < 10 ||
      ALTphoneNumber.length > 10
    ) {
      setALTPhoneNumberError('Please enter correct Phone Number');
      isValid = false;
    } else {
      setALTPhoneNumberError('');
    }

    if (!FirstName) {
      setFirstNameError('Please enter The User Name');
      isValid = false;
    } else {
      setFirstNameError('');
    }
    if (!LastName) {
      setLastNameError('Please enter The User Name');
      isValid = false;
    } else {
      setLastNameError('');
    }

    if (!ALTFirstName) {
      setALTFirstNameError('Please enter The User Name');
      isValid = false;
    } else {
      setALTFirstNameError('');
    }
    if (!ALTLastName) {
      setALTLastNameError('Please enter The User Name');
      isValid = false;
    } else {
      setALTLastNameError('');
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      setisActive(false);
      Alert.alert('Error', 'Fill All The Fields Again');
      // Fields are not valid, show error or perform necessary actions
      return;
    }
    // setIsLoading(true);
    const userdata = new FormData();
    const ALTuserdata = new FormData();
    const emergencydata = new FormData();

    const licenseData = {
      uri: License,
      type: 'image/jpeg',
      name: Licensename,
    };
    const AdharData = {
      uri: Adharcard,
      type: 'image/jpeg',
      name: Adharcardname,
    };

    userdata.append('Adhar_Card', AdharData);
    userdata.append('license_id', licenseData);

    userdata.append('fname', FirstName);
    userdata.append('lname', LastName);

    const ALTlicenseData = {
      uri: ALTLicense,
      type: 'image/jpeg',
      name: ALTLicensename,
    };
    const ALTAdharData = {
      uri: ALTAdharcard,
      type: 'image/jpeg',
      name: ALTAdharcardname,
    };

    ALTuserdata.append('Adhar_Card', ALTAdharData);
    ALTuserdata.append('license_id', ALTlicenseData);

    ALTuserdata.append('fname', ALTFirstName);
    ALTuserdata.append('lname', ALTLastName);

    const request1 = fetch(
      `https://${DOMAIN}/Car/assign_car_to_user/${phoneNumber}/`,
      {
        method: 'PUT',
        body: userdata,
      },
    );

    const request2 = fetch(
      `https://${DOMAIN}/Car/assign_car_to_user/${ALTphoneNumber}/`,
      {
        method: 'PUT',
        body: ALTuserdata,
      },
    );

    Promise.all([request1, request2])
      .then(async ([response1, response2]) => {
        const json1 = await response1.json();
        if (json1.Error) {
          Alert.alert('Error', json1.Error);
        } else if (User && User.Signature && !EmergencyCOntact) {
          navigation.navigate('Emergency', {
            phoneNumber: phoneNumber,
            EV: true,
            userName: "",
            car:true
          });
        } else if (User && User.Signature && EmergencyCOntact) {
          console.log("Signature and Emergency contact"); 
          navigation.navigate('CarDetail', {
            phoneNumber: phoneNumber,
          });
        } else {
          console.log("NO Signature and no Emergency contact");
          navigation.navigate('AgreementPage', {
            phoneNumber: phoneNumber,
            EV: true,
            userName: FirstName,
            car:true
          });
        }
      })
      .catch(error => {
        console.error('Fetch Error:', error);
        Alert.alert(`${error}`, 'Try again!');
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddEmergencyContact = () => {
    setemergencyContact(prevState => ({
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
          height: height * 0.2, // Use height based on the screen size
          width: width * 0.5,
          position: 'relative',
          top: 70,
        }}>
        <LottieView
          style={{
            height: height * 0.3,
            width: width * 0.65,
            marginTop: -height * 0.15,
          }}
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
          {phoneNumber.length >= 10 ? (
            <Text style={styles.sectionTitle}>Count - {count}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer1}>
          <TextInput
            placeholder="Contact Number"
            value={phoneNumber}
            onChangeText={text => {
              if (text.length < 10) {
                setonn(false);
              }
              setPhoneNumber(text);
            }}
            keyboardType="phone-pad"
            style={[styles.input, {width: onn ? 220 : '100%'}]}
            placeholderTextColor="#000"
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
                  onPress={() => handleConfirmOtp(phoneNumber)}>
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
                  onPress={() => handleVerify(phoneNumber)}>
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
          {FirstNameError ? (
            <Text style={styles.errorText}>{FirstNameError}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer2}>
          <TextInput
            placeholder="First Name"
            placeholderTextColor="#000"
            value={FirstName}
            onChangeText={text => setFirstName(text)}
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
            onPress={() => openCamera('Adhar_Card')}>
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
            onPress={() => openCamera('license_id')}>
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
          {ALTphoneNumber.length >= 10 ? (
            <Text style={styles.sectionTitle}>Count - {count}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer1}>
          <TextInput
            placeholder="Contact Number"
            value={ALTphoneNumber}
            onChangeText={text => {
              if (text.length < 10) {
                setonn2(false);
              }
              setALTPhoneNumber(text);
            }}
            keyboardType="phone-pad"
            style={[styles.input, {width: onn ? 220 : '100%'}]}
            placeholderTextColor="#000"
            maxLength={10}
          />

          {onn2 && (
            <View>
              {isLoadingOtp2 ? (
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
              ) : isOptReceived2 ? (
                <TouchableOpacity
                  style={{
                    paddingHorizontal: 5,
                    paddingVertical: 10,
                    marginLeft: 5,
                    backgroundColor: '#fef08a',
                    borderWidth: 1,
                    borderRadius: 10,
                  }}
                  onPress={() => handleConfirmOtp(ALTphoneNumber)}>
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
                  onPress={() => handleVerify(ALTphoneNumber)}>
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
          {ALTFirstNameError ? (
            <Text style={styles.errorText}>{ALTFirstNameError}</Text>
          ) : null}
        </View>
        <View style={styles.inputContainer2}>
          <TextInput
            placeholder="First Name"
            placeholderTextColor="#000"
            value={ALTFirstName}
            onChangeText={text => setFirstName(text)}
            style={[styles.input, styles.halfInput]}
          />
          <TextInput
            placeholder="Last Name"
            placeholderTextColor="#000"
            value={ALTLastName}
            onChangeText={text => setLastName(text)}
            style={[styles.input, styles.halfInput]}
          />
        </View>

        <View style={styles.uploadBtnContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => openCamera('ALTAdhar_Card')}>
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
            onPress={() => openCamera('ALTlicense_id')}>
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
      {/* <EmergencyContact
        emergencyContact={emergencyContact}
        handleInputChange={handleInputChange}
        handleAddEmergencyContact={handleAddEmergencyContact}
      /> */}

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
  inputContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
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
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'black',
  },
  halfInput: {
    flex: 1,
    marginLeft: 2,
  },
});

export default CarCustomerDetail;
