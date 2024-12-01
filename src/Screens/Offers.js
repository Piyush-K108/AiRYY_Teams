import React, {useState} from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {useRoute} from '@react-navigation/core';
import axios from 'axios'; // Import axios
import {DOMAIN} from '@env';

const Checkbox = ({label, value, onPress}) => {
  return (
    <TouchableOpacity
      style={{...styles.checkboxContainer, gap: -4}}
      onPress={onPress}>
      <View
        style={[
          styles.checkbox,
          {backgroundColor: value ? '#feb101' : 'white'},
        ]}>
        {value && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={{color: 'white'}}>{label}</Text>
    </TouchableOpacity>
  );
};

const Offers = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {b_id, carid, bikeCondition, carCondition} = route.params;
  const [Yes, setYes] = useState(null);
  const [Clicked, setClicked] = useState(null);

  const validateFields = () => {
    let isValid = true;

    if (!Clicked) {
      Alert.alert('Error', 'Please Select The CheckBox');
      isValid = false;
    } else {
      setClicked(null);
    }

    return isValid;
  };

  const handleYes = condition => {
    setClicked(true);
    setYes(condition);
  };

  const navigateToOfferDetails = async () => {
    let shouldNavigate = true;

    if (!validateFields()) {
      return;
    }

    try {
      if (!carid) {
        const response = await axios.get(
          `https://${DOMAIN}/User/number/${carid}/`,
          {car: true},
        );
      } else {
        const response = await axios.get(
          `https://${DOMAIN}/User/number/${b_id}/`,
          {},
        );
      }

      const phone = response.data;
      console.log(phone);
      const response2 = await axios.put(
        `https://${DOMAIN}/User/Offers/${phone}/`,
        {YES: Yes}, // Use data for PUT requests
      );

      if (response2.data && response2.data.message) {
        shouldNavigate = false;
        Alert.alert('Already Taken', "Don't Give Discount Now", [
          {
            text: 'OK',
            onPress: () => {
              if (carid) {
                navigation.navigate('CarUserBill', {
                  b_id: carid,
                  carCondition: carCondition,
                });
                shouldNavigate = true;
              } else {
                navigation.navigate('UserBill', {
                  b_id: b_id,
                  bikeCondition: bikeCondition,
                });
                shouldNavigate = true;
              }
            },
          },
        ]);
      } else {
        if (carid) {
          navigation.navigate('CarHome', {
            b_id: carid,
            carCondition: carCondition,
          });
        } else {
          navigation.navigate('UserBill', {
            b_id: b_id,
            bikeCondition: bikeCondition,
          });
        }
      }
    } catch (error) {
      console.error('Error in navigateToOfferDetails:', error);
      if (carid) {
        navigation.navigate('CarHome', {
          b_id: carid,
          carCondition: carCondition,
        });
      } else {
        navigation.navigate('UserBill', {
          b_id: b_id,
          bikeCondition: bikeCondition,
        });
      }
    }

    setYes(null);
    setClicked(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.reminderContainer}>
        <Text style={styles.reminderText}>Reminder!</Text>
      </View>
      <View style={styles.checkboxContainer}>
        <Checkbox
          label="Taken"
          value={Yes === true}
          onPress={() => handleYes(true)}
        />
        <Checkbox
          label="Not Taken`"
          value={Yes === false}
          onPress={() => handleYes(false)}
        />
      </View>
      <TouchableOpacity
        style={styles.box}
        onPress={() => navigateToOfferDetails()}>
        <LinearGradient
          colors={['#feb101', '#feb101']}
          style={styles.gradientBox}>
          <Text style={styles.boxText}>
            Give 5% Discount For Instagram Follow and Google Review.
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingTop: '40px',
  },
  reminderContainer: {
    width: '100%',
    alignItems: 'center',
  },
  reminderText: {
    color: 'white',

    fontSize: 18,
  },
  box: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  gradientBox: {
    padding: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.55,
    shadowRadius: 3.84,
    elevation: 5,
  },
  boxText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'justify',
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    justifyContent: 'center',
    marginVertical: 30,
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
    color: 'white',
  },
});

export default Offers;
