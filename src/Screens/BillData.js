import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {DOMAIN} from '@env';
import DatePicker from 'react-native-date-picker';
// import DatePicker from 'react-native-datepicker';
import {useNavigation} from '@react-navigation/native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function BillData() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigation = useNavigation();
  const [count, setcount] = useState('');
  const validateFields = () => {
    let isValid = true;

    if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 10) {
      setPhoneNumberError('Please enter correct Phone Number');
      isValid = false;
    } else {
      setPhoneNumberError('');
    }
    if (count == '') {
      isValid = false;
    }
    return isValid;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://${DOMAIN}/Bike/usercount/${phoneNumber}/`,
        );
        const data = await response.json();
        setcount(data);
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Only fetch data if phoneNumber has at least 10 characters
    if (phoneNumber.length >= 10) {
      setIsLoading(true)
      fetchData();

    }
  }, [phoneNumber]);

  const handleSubmit = async () => {
    if (!validateFields()) {                   

        Alert.alert('Error', "User Doesn't Exist", [
          {
            text: 'OK',
          },
        ]);
        return;
      }
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    const day = selectedDate.getDate();
    const formattedToday = `${year}-${month}-${day}`;

    navigation.navigate('DirectBill', {
      phoneNumber: phoneNumber,
      selectedDate: formattedToday,
    });
  };

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: '#FFF', height: windowHeight}}>
      <View style={styles.titleCotainer}></View>
      <View style={styles.container}>
        <Text style={styles.title}>Select the User and Date for a bill.</Text>
        {isLoading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#000000" />
          </View>
        )}

        <View style={styles.formContainer}>
          <View style={styles.form}>
            {phoneNumberError ? (
              <Text style={styles.errorText}>{phoneNumberError}</Text>
            ) : null}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  borderWidth: 1,
                  borderColor: 'gray',
                  borderRadius: 9,
                }}>
                <Ionicons name="call" size={24} color="#feb101" />
                <TextInput
                  style={styles.phoneNumberInput}
                  placeholder="Enter Customer Phone number"
                  placeholderTextColor="#333"
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  value={phoneNumber}
                  onChangeText={text => setPhoneNumber(text)}
                />
              </View>
            </View>

            <View style={styles.DatePickerContainer}>
              <Text style={styles.label}>Select Date</Text>
              <DatePicker
                mode="date"
                date={selectedDate}
                onDateChange={setSelectedDate}
                androidVariant="nativeAndroid"
                textColor="#000"
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>SUBMIT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

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
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    // height: windowHeight,
    // padding:10 ,
    paddingVertical: 40,
    margin: 20,
    // borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    borderRadius: 5,
  },
  formContainer: {
    width: windowWidth * 0.8,
  },
  titleCotainer: {
    backgroundColor: '#feb101',
    width: windowWidth,
    height: windowHeight * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 70,
    borderBottomRightRadius: 70,
    marginBottom: 50,
  },
  title: {
    fontSize: windowWidth * 0.04,
    backgroundColor: '#333',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: windowWidth * 0.07,
    // color: '#feb101',
    color: '#FFF',

    paddingVertical: 15,
    paddingHorizontal: 45,
    borderRadius: 14,
    fontSize: 15,
    // borderTopLeftRadius: 50,
    // borderBottomRightRadius: 50,
  },

  form: {
    marginTop: windowWidth * 0.04,
  },
  inputContainer: {
    marginBottom: windowWidth * 0.04,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: windowWidth * 0.02,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold',
  },
  phoneNumberInput: {
    color: '#000',
    // height: windowWidth * 0.1,
    // borderColor: '#000',
    // borderWidth: 1,
    // paddingLeft: windowWidth * 0.02,
    // marginBottom: windowWidth * 0.04,
    // borderBottomWidth: 1,
  },
  submitButton: {
    backgroundColor: '#333',
    padding: windowWidth * 0.03,
    borderRadius: windowWidth * 0.04,
    alignItems: 'center',
    marginTop: windowWidth * 0.1,
  },
  submitButtonText: {
    color: '#feb101',
    fontWeight: '800',
    letterSpacing: 2,
  },
  // DatePickerContainer : {
  //   height:windowHeight*0.03 ,
  //   width: windowWidth*0.03 ,
  //   borderRadius:50 ,
  // }
});

export default BillData;