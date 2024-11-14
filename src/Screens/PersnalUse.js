import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {DOMAIN} from '@env';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const Checkbox = ({label, value, onPress}) => {
  return (
    <TouchableOpacity style={styles.checkboxContainer2} onPress={onPress}>
      <View
        style={[
          styles.checkbox2,
          {backgroundColor: value ? '#feb101' : 'transparent'},
        ]}>
        {value && <Text style={styles.checkmark2}>✓</Text>}
      </View>
      <Text style={{color: 'black', marginHorizontal: 8}}>{label}</Text>
    </TouchableOpacity>
  );
};

const PersnalUSe = ({ drawerNavigationRef }) => {
  const [KM, setKM] = useState('');
  const [bikeType, setbikeType] = useState('EV');
  const [Bikeid, setBikeid] = useState('');
  const [Bikeiderror, setBikeiderror] = useState('');
  const [selectedBike, setSelectedBike] = useState([]);
  const Persnal = 1

  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');

  const [EV, setEV] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [TimeTaken, setTimeTaken] = useState(null);
  const [TimeTakenerror, setTimeTakenerror] = useState('');
  const [KMError, setKMError] = useState('');
  
  const [TextArea, setTextArea] = useState('');

  const handlebikeTypeChange = condition => {
    setbikeType(condition);
  };

  const data = new FormData();
  

  data.append('KM_Previous', KM);
  data.append('Estimated_Amount', 0);
  data.append('EV', EV);
  data.append('Bikeid', Bikeid);

  data.append('TimeThought', TimeTaken);
  data.append('Persnal', Persnal);

  const validateFields = () => {
    let isValid = true;

    if (!TimeTaken) {
      setTimeTakenerror('Please enter expected hours');
      isValid = false;
    } else {
      setTimeTakenerror('');
    }

    if (!KM) {
      setKMError('Please enter Current Kilometer');
      isValid = false;
    } else {
      setKMError('');
    }

   

   
    if (!Bikeid) {
      setBikeiderror('Please choose BikeID');
      isValid = false;
    } else {
      setBikeiderror('');
    }
    if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 10) {
      setPhoneNumberError('Please enter correct Phone Number');
      isValid = false;
    } else {
      setPhoneNumberError('');
    }
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateFields()) {                   
Alert.alert('Error',"Fill All The Fields Again");
      // Fields are not valid, show error or perform necessary actions

      return;
    }
    setIsLoading(true);
    fetch(`https://${DOMAIN}/Bike/assign_bike_to_bike/${phoneNumber}/`, {
      method: 'PUT',

      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        setTimeout(() => {
          if (responseJson.bike && responseJson.bike.license_plate) {
            Alert.alert(
              'Done',
              `Give this Bike ${responseJson.bike.license_plate}`,
              [
                {
                  text: 'OK',
                  onPress: () => {
                  navigation.navigate('Home')

                  },

                },
              ],
            );
          } else if (responseJson.Error) {
            Alert.alert(`Error`, `Try again! ${responseJson.Error}`, [
              {
                text: 'OK',
                onPress: () => {
                  
                    navigation.navigate('Home')
                  },
              },
            ]);
          } else {
            Alert.alert(
              'Unexpected Response',
              'The API response does not contain the expected data structure.',
              [
                {
                  text: 'OK',
                },
              ],
            );
          }

          setIsLoading(false);
        }, 500);
      })
      .catch(error => {
        console.log(error);
        setTimeout(() => {
          Alert.alert('Error', `Try again!`, [
            {
              text: 'ok',
            },
          ]);
          setIsLoading(false);
        }, 500);
      });
  };
  const [value, setValue] = useState(null);
  const [BikeData, setBikeData] = useState([]);

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      fetch(`https://${DOMAIN}/Bike/Bikeids/`, {
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
  }, [BikeData,navigation, EV]);

  return (
    <View style={styles.container}>
      <View style={styles.Vcontainer}>
        <LottieView
          style={styles.video}
          source={require('../assets/animation_ljzoxvdm.json')}
          autoPlay
          loop
        />
      </View>

      <ScrollView style={styles.Scrollcontainer}>
        <View style={styles.box}>
          {phoneNumberError ? (
            <Text style={styles.errorText}>{phoneNumberError}</Text>
          ) : null}

            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="#000"
              value={phoneNumber}
              onChangeText={text => setPhoneNumber(text)}
              style={styles.inputKm}
              keyboardType="phone-pad"
            />
      

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

          {Bikeiderror ? (
            <Text style={styles.errorText}>{Bikeiderror}</Text>
          ) : null}
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={selectedBike}
            itemTextStyle={{color: '#000'}}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Bike ID"
            placeholderTextColor="#000"
            value={value}
            onChange={item => {
              setValue(item.value);
              const selectedBikeId2 = item.label.split(' -   ')[0]; // Extract the B_id
              setBikeid(selectedBikeId2);
            }}
          />

          {TimeTakenerror ? (
            <Text style={styles.errorText}>{TimeTakenerror}</Text>
          ) : null}
          <TextInput
            placeholder="Enter Hour's"
            value={TimeTaken}
            placeholderTextColor="#000"
            onChangeText={text => setTimeTaken(text)}
            keyboardType="numeric"
            style={styles.inputKm}></TextInput>
          {KMError ? <Text style={styles.errorText}>{KMError}</Text> : null}
          <TextInput
            placeholder="Enter Current Kilometer"
            value={KM}
            placeholderTextColor="#000"
            onChangeText={text => setKM(text)}
            keyboardType="numeric"
            style={styles.inputKm}></TextInput>
       
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
  dropdown: {
    height: 50,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 20,
    color: '#000',
    paddingLeft: 7,
    paddingRight: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'black',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: 'black',
  },
  checkboxLabel: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  placeholderStyle: {
    fontSize: 15,
    color: '#000',
  },
  selectedTextStyle: {
    fontSize: 15,
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
  Vcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
    width: 300,
    marginTop: 150,
  },

  video: {
    width: 350,
    height: 350,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#feb101',
  },
  Scrollcontainer: {
    width: '100%',
  },
  box: {
    backgroundColor: '#fff',
    padding: 20,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 6,
    marginTop: 210,
    width: '100%',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  inputKm: {
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    marginBottom: 20,
    color: '#000',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    color: '#000',
  },
  selectedDate: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'blue',
    color: '#fff',
    borderRadius: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '110%',
    padding: 20,
  },
  inputContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    width: '100%',
  },
  uploadText: {
    color: '#000',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 360,
    height: 180,
    borderRadius: 10,
  },
  imageText: {
    color: '#228B22',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#feb101',
    width: '80%',
    height: 40,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    marginTop: 30,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 17,
    letterSpacing: 1,
  },
  documentPicker: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    color: 'black',
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
    fontWeight: 'bold',
  },
});


export default PersnalUSe;
