import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import opencamera from '../components/opencamera';
import LottieView from 'lottie-react-native';
import {DOMAIN} from '@env';
import {Dropdown} from 'react-native-element-dropdown';
import {useNavigation} from '@react-navigation/native';
import {launchCamera} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import {useRoute} from '@react-navigation/core';
const Checkbox = ({label, value, onPress}) => {
  return (
    <TouchableOpacity style={styles.checkboxContainer2} onPress={onPress}>
      <View
        style={[
          styles.checkbox,
          {backgroundColor: value ? '#feb101' : 'transparent'},
        ]}>
        {value && <Text style={styles.checkmark2}>✓</Text>}
      </View>
      <Text style={{color: 'black'}}>{label}</Text>
    </TouchableOpacity>
  );
};

const Servicing = () => {
  const [Mode, setMode] = useState('cash');
  const [refreshing, setRefreshing] = useState(false);
  const [bid, setbid] = useState('');
  const [EV, setEV] = useState(true);
  const [Kilometer, setKilometer] = useState('');
  const [Amount, setAmount] = useState('');
  const [Date, setDate] = useState('');

  const [Bikeid, setBikeid] = useState('');
  const [bikeType, setbikeType] = useState('EV');
  const [Bikeiderror, setBikeiderror] = useState('');
  const [selectedBike, setSelectedBike] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();

  const [kilometerError, setKilometerError] = useState('');
  const [AmountError, setAmountError] = useState('');
  const [DateError, setDateError] = useState('');
  const [imageError, setImageError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleModeChange = condition => {
    setMode(condition);
  };

  const focusHandler = () => {
    fetch(`https://${DOMAIN}/Bike/BikeServicing/`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('d');
        setBikeData(responseJson);
        if (responseJson.length > 0) {
          setValue(responseJson[0].value);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    focusHandler();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const options = {
    mediaType: 'photo',
    quality: 0.4,
    storageOptions: {
      skipBackup: true,
    },
  };

  const handlebikeTypeChange = condition => {
    setbikeType(condition);
  };

  // const handleImageSelect = () => {
  //   try {
  //     launchCamera(options, response => {
  //       if (response.didCancel) {
  //         console.log('User cancelled image picker');
  //       } else if (response.error) {
  //         console.log('ImagePicker Error: ', response.error);
  //       } else if (response.customButton) {
  //         console.log('User tapped custom button: ', response.customButton);
  //       } else {
  //         setSelectedImage(response.assets[0].uri);
  //         setImageError('');
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleImageSelect2 = async () => {
    const result = await opencamera("7024949888", '_Adhar_Card.jpg');
    if (result) {
      // console.log(result.path,result.name)
      setSelectedImage(result.path);
      setImageError('');
    } else {
      Alert.alert('Error', 'Failed to capture Image');
    }
  };
  const Imagedata = {
    uri: selectedImage,
    type: 'image/jpeg',
    name: bid + '_bill.jpg',
  };
  const data = new FormData();

  data.append('bid', Bikeid);
  data.append('KM', Kilometer);
  data.append('Date', '2014-12-18');
  data.append('Bill', Imagedata);
  data.append('Payed', Amount);
  data.append('Mode', Mode);

  const handleDeposit = () => {
    if (!validateFields()) {
      Alert.alert('Error', 'Fill All The Fields Again');
      setSelectedImage(null);
      return;
    }
    setIsLoading(true);

    fetch(`https://${DOMAIN}/Bike/servicing/`, {
      method: 'POST',
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        setTimeout(() => {
          if (responseJson.message) {
            Alert.alert('Done', `${responseJson.message}`, [
              {
                text: 'OK',
                onPress: () => {
                  navigation.navigate('Home');
                },
              },
            ]);
          } else if (responseJson.error) {
            Alert.alert(
              'Error',
              responseJson.Error, 
              [
                {
                  text: 'OK',
                },
              ],
            );
          } else if (responseJson.Error2) {
            Alert.alert('Error', responseJson.Error2);
            setSelectedImage(null);
          } else {
            setSelectedImage(null);
            Alert.alert('Error', 'An unknown error occurred.'); 
          }
          setIsLoading(false);
        }, 500);
      })
      .catch(error => {
        console.log(error);
        setTimeout(() => {
          Alert.alert('Error', 'Try again');
          setSelectedImage(null);
          setIsLoading(false);
        }, 500);
      });

    // setbid('');
    // setKilometer('');
    // setSelectedImage('');
    const pattern = /\/([\w-]+)\.jpg$/;

    const newUrl = selectedImage.replace(pattern, '');
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

  const validateFields = () => {
    let isValid = true;

    if (!Kilometer) {
      setKilometerError('Please enter kilometers');
      isValid = false;
    } else {
      setKilometerError('');
    }

    if (!selectedImage) {
      setImageError('Please upload bike reading image');
      isValid = false;
    } else {
      setImageError('');
    }
    if (!Bikeid) {
      setBikeiderror('Please choose BikeID');
      isValid = false;
    } else {
      setBikeiderror('');
    }
    if (!Amount) {
      setAmountError('Please choose Amount');
      isValid = false;
    } else {
      setAmountError('');
    }

    return isValid;
  };
  const [value, setValue] = useState(null);
  const [BikeData, setBikeData] = useState([]);

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      fetch(`https://${DOMAIN}/Bike/BikeServicing/`, {
        method: 'GET',
      })
        .then(response => response.json())
        .then(responseJson => {
          setBikeData(responseJson);
        })
        .catch(error => {
          console.log(error);
        });
    });
    if (EV) {
      // Filter for 'value' equal to true when EV is true
      const filteredData = BikeData.filter(item => item.value === true);

      setSelectedBike(filteredData);
      if (filteredData.length > 0) {
        setValue(filteredData[0].value);
      }
    } else {
      // Filter for 'value' equal to false when EV is false

      const filteredData = BikeData.filter(item => item.value === false);

      setSelectedBike(filteredData);
      if (filteredData.length > 0) {
        setValue(filteredData[0].value);
      }
    }
    return focusHandler;
  }, [BikeData, navigation, EV]);

  return (
    <View style={styles.container}>
      <View style={styles.Vcontainer}>
        <LottieView
          style={styles.video}
          source={require('../assets/DepositeBikeAnime.json')} // Replace with your animation file path
          autoPlay
          loop
        />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.Scroll}>
        <View style={styles.content}>
          <View style={styles.checkboxContainer2}>
            <Text style={styles.label2}>Bike Type:</Text>
            <Checkbox
              label="EV"
              value={bikeType === 'EV'}
              onPress={() => {
                handlebikeTypeChange('EV');
                setEV(true);
              }}
            />
            <Checkbox
              label="Petrol"
              value={bikeType === 'Petrol'}
              onPress={() => {
                handlebikeTypeChange('Petrol');
                setEV(false);
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            {Bikeiderror ? (
              <Text style={styles.errorText}>{Bikeiderror}</Text>
            ) : null}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={selectedBike.length > 0 ? selectedBike : BikeData}
              itemTextStyle={{color: '#000'}}
              maxHeight={300}
              labelField="label"
              placeholder="Select Bike ID"
              placeholderTextColor="#000"
              onChange={item => {
                const selectedBikeId = item.label.split(' -   ')[0];
                setBikeid(selectedBikeId);
              }}
            />
          </View>
          <View style={styles.checkboxContainer}>
            <Text style={{...styles.label2, marginLeft: 2}}>Mode: </Text>
            <Checkbox
              label="cash"
              value={Mode === 'cash'}
              onPress={() => handleModeChange('cash')}
            />
            <Checkbox
              label="online"
              value={Mode === 'online'}
              onPress={() => handleModeChange('online')}
            />
          </View>
          {imageError ? (
            <Text style={styles.errorText}>{imageError}</Text>
          ) : null}
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleImageSelect2}>
            <Text style={styles.cameraButtonText}>Upload Bill Image</Text>
          </TouchableOpacity>

          {selectedImage && (
            <View style={styles.imageContainer}>
              <Image source={{uri: selectedImage}} style={styles.image} />
              <Text style={{color: 'green', marginTop: 5, fontWeight: '600'}}>
                Image Of Bill
              </Text>
            </View>
          )}

          <Text style={styles.label}>Kilometers Now:</Text>
          <TextInput
            style={styles.input2}
            placeholder="Enter Kilometer"
            placeholderTextColor="#000"
            value={Kilometer}
            onChangeText={text => setKilometer(text)}
            keyboardType="numeric"
          />
          {kilometerError ? (
            <Text style={styles.errorText}>{kilometerError}</Text>
          ) : null}

          <Text style={styles.label}>Amount Payed:</Text>
          <TextInput
            style={styles.input2}
            placeholder="Enter Amount"
            placeholderTextColor="#000"
            value={Amount}
            onChangeText={text => setAmount(text)}
            keyboardType="numeric"
          />
          {AmountError ? (
            <Text style={styles.errorText}>{AmountError}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.depositButton}
            onPress={handleDeposit}>
            <Text style={styles.depositButtonText}>Submit</Text>
          </TouchableOpacity>
          {isLoading && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#000000" />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
    marginTop: 10,
  },
  label2: {
    fontSize: 16,
    marginLeft: -10,
    fontWeight: 'bold',
    color: 'black',
    marginRight: 25,
    justifyContent: 'space-between',
  },
  checkbox2: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
  },
  checkmark2: {
    color: '#000',
    marginLeft: 3,
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

  placeholderStyle: {
    fontSize: 15,
    color: '#000',
  },
  selectedTextStyle: {
    fontSize: 15,
    color: '#000',
  },
  Vcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    width: 200,
    marginTop: 170,
    marginBottom: 30,
  },
  video: {
    width: 250,
    height: 230,
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#feb101',
  },
  Scroll: {
    marginTop: 30,
    width: '100%',
  },
  content: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: '100%',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 6,
    marginTop: 120,
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkmark: {
    color: '#000',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: 'black',
  },
  cameraButton: {
    backgroundColor: '#feb101',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  cameraButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 190,
    borderRadius: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    color: '#000',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    marginTop: 20,
  },
  input2: {
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 15,
    color: '#000',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    marginTop: 20,
  },
  depositButton: {
    backgroundColor: '#feb101',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 25,
  },
  depositButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
});

export default Servicing;
