This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started


C:\Airyy_Management\android\app\build\outputs\apk\release\
C:\Airyy_Management\android\app\build\outputs\apk\release\app-release.apk && npm start
cd android &&  gradlew assembleRelease && cd..
cd android && .\gradlew clean &&  gradlew assembleRelease && cd..
cd android && .\gradlew clean &&  cd.. && npm start

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.


















import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {useNavigation} from '@react-navigation/native';
import {DOMAIN} from '@env';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNFS from 'react-native-fs';
import ImageCropPicker from 'react-native-image-crop-picker';
import { launchCamera } from 'react-native-image-picker';
const Checkbox = ({label, value, onPress}) => {
  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
      <View
        style={[
          styles.checkbox,
          {backgroundColor: value ? '#feb101' : 'transparent'},
        ]}>
        {value && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={{color: 'black', marginHorizontal: 20}}>{label}</Text>
    </TouchableOpacity>
  );
};

const CustomerDetails = () => {
  const [userName, setUserName] = useState('');
  const [LastName, setLastName] = useState('');
  const [bikeCondition, setBikeCondition] = useState('EV');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [EV, setEV] = useState(true);
  const [Adharcardname, setAdharcardname] = useState(null);
  const [Licensename, setLicensename] = useState(null);
  const [Adharcard, setAdharcard] = useState(null);
  const [License, setLicense] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setisActive] = useState(true);
 
  const [OTP, setOTP] = useState(false);
  const [isDocument, setisDocument] = useState(false);
  const [isChanged, setisChanged] = useState(false);

  const [count, setcount] = useState('');
  const [userNameError, setuserNameError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [adharCardError, setAdharCardError] = useState('');
  const [licenseError, setLicenseError] = useState('');
  const navigation = useNavigation();

   const [isLoadingOtp, setIsLoadingOtp] = useState(false);
   const [isOptReceived, setIsOptReceived] = useState(false);

   const handleVerify = () => {
     // Simulate sending OTP to user
     setIsLoadingOtp(true);
     setTimeout(() => {
       setIsLoadingOtp(false);
       setIsOptReceived(true);
     }, 3000); // Simulating a delay of 3 seconds for receiving OTP
   };

   const handleConfirmOpt = () => {
     // Handle confirming OTP received
     setIsOptReceived(false); // Reset state for next verification
   };

  const options = {
    mediaType: 'photo',
    quality: 0.4,
    storageOptions: {
      skipBackup: true,
    },
  };
  const handleBikeConditionChange = condition => {
    setBikeCondition(condition);
  };
  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://${DOMAIN}/Bike/usercount/${phoneNumber}/`,
      );
      const data = await response.json();
      setcount(data.usercount);
      console.log(data.usercount)
      console.log(data.active)

      setisActive(data.active);

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
    // Only fetch data if phoneNumber has at least 10 characters
    if (phoneNumber.length >= 10) {
      setIsLoading(true);
      fetchData();
    }
    setIsLoading(false);
  }, [phoneNumber]);

  const validateFields = () => {
    let isValid = true;

    if (EV) {
      if (!Adharcard || !Adharcardname) {
        setAdharCardError('Please upload Adhar Card for EV');
        isValid = false;
      } else {
        setAdharCardError('');
      }
    } else {
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
    }

    if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 10) {
      setPhoneNumberError('Please enter correct Phone Number');
      isValid = false;
    } else {
      setPhoneNumberError('');
    }
    if (!userName) {
      setuserNameError('Please enter The User Name');
      isValid = false;
    } else {
      setuserNameError('');
    }
    if (!LastName) {
      setuserNameError('Please enter The User Name');
      isValid = false;
    } else {
      setuserNameError('');
    }

    return isValid;
  };
  const data = new FormData();

  if (EV) {
    const AdharData = {
      uri: Adharcard,
      type: 'image/jpeg',
      name: Adharcardname,
    };
    data.append('Adhar_Card', AdharData);
  } else {
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
    data.append('Adhar_Card', AdharData);
    data.append('license_id', licenseData);
  }
  data.append('EV', EV);
  data.append('fname', userName);
  data.append('lname', LastName);
  const handleSubmit = async () => {
    if (!validateFields()) {
      Alert.alert('Error', 'Fill All The Fields Again');
      // Fields are not valid, show error or perform necessary actions
      return;
    }
    setIsLoading(true);
    await fetch(`https://${DOMAIN}/Bike/assign_bike_to_user/${phoneNumber}/`, {
      method: 'PUT',
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        setTimeout(() => {
          if (responseJson.Error) {
            Alert.alert('Error', responseJson.Error);
          } else {
            navigation.navigate('AgreementPage', {
              phoneNumber: phoneNumber,
              EV: EV,
              userName: userName,
            });
          }

          setIsLoading(false);
        }, 500);
      })
      .catch(error => {
        setTimeout(() => {
          Alert.alert(`${error}`, `Try again!`);
          setIsLoading(false);
        }, 500);
      });

    // setPhoneNumber('');
    // setLicense(null);
    // setAdharcard(null);

    const pattern = /\/([\w-]+)\.jpg$/;

    const newUrl = Adharcard.replace(pattern, '');
    RNFS.readdir(newUrl)
      .then(files => {
        // Filter files with .jpg extension
        const jpgFiles = files.filter(file => file.endsWith('.jpg'));

        // Delete each .jpg file
        jpgFiles.forEach(file => {
          const filePath = `${newUrl}/${file}`;

          // Delete the file
          RNFS.unlink(filePath)
            .then(() => {
              console.log(`File ${file} deleted successfully`);
            })
            .catch(error => {
              console.log(`Error deleting file ${file}:`, error);
            });
        });

        if (jpgFiles.length === 0) {
          console.log('No .jpg files found to delete');
        }
      })
      .catch(error => {
        console.log('Error reading directory:', error);
      });
  };
  const AdharcardPicker = async () => {
    try {
      launchCamera(options, response => {
        console.log('Response = ', response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          setAdharcard(response.assets[0].uri);
          setAdharcardname(phoneNumber + '_Adhar_Card.jpg');
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const LicensePicker = async () => {
    try {
      launchCamera(options, response => {
        console.log('Response = ', response);
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          setLicense(response.assets[0].uri);
          setLicensename(phoneNumber + '_License.jpg');
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const SendOTP = () => {};
  // const renderOTPInput = () => {
  //   return (
  //     <View style={styles.checkboxContainer}>
  //       <Text style={styles.label}>OTP:</Text>
  //       <TextInput
  //         placeholder="Enter OTP"
  //         placeholderTextColor="#000"
  //         value={OTP}
  //         onChangeText={text => setOTP(text)}
  //         style={styles.input2}
  //         keyboardType="phone-pad"
  //       />
  //       <TouchableOpacity
  //         style={{marginBottom: 10, paddingLeft: 20}}
  //         onPress={() => fetchData()}>
  //         <FontAwesome
  //           name="arrow-right"
  //           size={18}
  //           color="black"
  //           style={styles.icon}
  //         />
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  return (
    <View style={styles.background}>
      <View style={styles.Vcontainer}>
        <LottieView
          style={styles.video}
          source={require('../assets/animation_ljzoxvdm.json')}
          autoPlay
          loop
        />
      </View>

      <View style={styles.container}>
        <ScrollView>
          <View style={{padding: 16}}>
            <View>
              {phoneNumber.length >= 10 ? (
                <Text style={{color: 'green', fontSize: 16, fontWeight: '900'}}>
                  User Count - {count}
                </Text>
              ) : null}
              <View style={{marginLeft: 20, marginBottom: 10}}>
                {userNameError ? (
                  <Text style={styles.errorText}>{userNameError}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer1}>
                <FontAwesome
                  name="user"
                  size={18}
                  color="black"
                  style={styles.icon}
                />
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
            </View>
            <View style={{marginLeft: 20, marginBottom: 10}}>
              {phoneNumberError ? (
                <Text style={styles.errorText}>{phoneNumberError}</Text>
              ) : null}
            </View>
            <View style={styles.inputContainer2}>
              <FontAwesome
                name="phone"
                size={18}
                color="black"
                style={styles.icon}
              />
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#000"
                value={phoneNumber}
                onChangeText={text => setPhoneNumber(text)}
                style={styles.input}
                keyboardType="phone-pad"
              />
              <View>
                {isLoadingOtp ? (
                  <ActivityIndicator
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 15,
                      paddingHorizontal: 10,
                      paddingVertical: 10,

                      marginBottom: 10,
                      fontWeight: '800',

                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: 'gray',
                    }}
                    size="small"
                    color="#000"
                  />
                ) : isOptReceived ? (
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 15,
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                      elevation: 2,
                      marginBottom: 10,

                      backgroundColor: '#22c55e',
                      borderRadius: 5,
                    }}
                    onPress={handleConfirmOpt}>
                    <Text
                      style={{
                        color: '#FFF',
                        fontWeight: '500',
                        letterSpacing: 1,
                      }}>
                      ✔
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 15,
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                      elevation: 2,
                      marginBottom: 10,
                      backgroundColor: '#fef08a',
                      borderRadius: 5,
                    }}
                    onPress={handleVerify}>
                    <Text
                      style={{
                        color: '#000',
                        fontWeight: '500',
                        letterSpacing: 1,
                      }}>
                      Verify
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {/* {!isActive ? renderOTPInput() : null} */}
            <View style={styles.checkboxContainer}>
              <Text style={styles.label}>Bike Type:</Text>
              <Checkbox
                label="EV"
                value={bikeCondition === 'EV'}
                onPress={() => {
                  handleBikeConditionChange('EV');
                  setEV(true);
                }}
              />
              <Checkbox
                label="Petrol"
                value={bikeCondition === 'Petrol'}
                onPress={() => {
                  handleBikeConditionChange('Petrol');
                  setEV(false);
                }}
              />
            </View>
            {!isActive && (
              <View>
                {EV ? (
                  <View style={styles.inputContainer3}>
                    <View style={{width: '100%'}}>
                      <View style={{marginBottom: 10}}>
                        {adharCardError ? (
                          <Text style={styles.errorText}>{adharCardError}</Text>
                        ) : null}
                      </View>
                      <TouchableOpacity
                        onPress={AdharcardPicker}
                        style={[styles.input, styles.documentPicker]}>
                        <Text style={{color: '#000'}}>
                          {Adharcard
                            ? `Adhar Card: ${Adharcardname}`
                            : 'Upload Adhar Card for EV'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View>
                    <View style={{marginBottom: 10}}>
                      {licenseError ? (
                        <Text style={styles.errorText}>{licenseError}</Text>
                      ) : null}
                    </View>
                    <View style={styles.inputContainer4}>
                      <TouchableOpacity
                        onPress={LicensePicker}
                        style={[styles.input, styles.documentPicker]}>
                        <Text style={{color: '#000'}}>
                          {License
                            ? `License: ${Licensename}`
                            : 'Upload License for Petrol Bikes'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{marginBottom: 10}}>
                      {adharCardError ? (
                        <Text style={styles.errorText}>{adharCardError}</Text>
                      ) : null}
                    </View>
                    <View style={styles.inputContainer5}>
                      <TouchableOpacity
                        onPress={AdharcardPicker}
                        style={[styles.input, styles.documentPicker]}>
                        <Text style={{color: '#000'}}>
                          {Adharcard
                            ? `Adhar Card: ${Adharcardname}`
                            : 'Upload Adhar Card for Petrol Bikes'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: 'flex-center',
                position: 'absolute',
                top: 0,
                left: 250,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'white',
                  paddingHorizontal: 12,
                  elevation: 3,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
                onPress={() => setisActive(!isActive)}>
                <Text style={{color: '#000', fontWeight: '600'}}>
                  Update Docs.
                </Text>
              </TouchableOpacity>
            </View>

            {isLoading && (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color="#000000" />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  Vcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    width: 300,
  },
  video: {
    width: 350,
    height: 350,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    backgroundColor: '#feb101',
  },

  label: {
    fontSize: 16,
    paddingRight: 50,
    marginBottom: 7,
    fontWeight: 'bold',
    marginLeft: 5,
    color: 'black',
  },

  container: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 0,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    margin: 0,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 0,
    height: 450,
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
  
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 8,
    marginTop: 5,
  },
  label: {
    fontSize: 16,
    marginLeft: -10,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 5,
    marginTop: -4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
  },
  checkmark: {
    color: '#000',
    marginLeft: 3,
  },
  inputContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between' ,
    marginBottom: 10,
    marginTop:30 ,
  },
  inputContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between' ,
    marginBottom: 10,
   
  },
  inputContainer3: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between' ,
    marginBottom: 10,
  
  },
  inputContainer4: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between' ,
    marginBottom: 10,
    
  },
  inputContainer5: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'space-between' ,
    marginBottom: 10,
    
  },
  halfInput: {
    flex: 1,
    marginLeft: 2,
  },
  icon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: '#feb101',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  documentPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CustomerDetails;