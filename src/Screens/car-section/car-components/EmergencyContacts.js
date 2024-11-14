import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Ionicons from 'react-native-vector-icons/Ionicons';

const EmergencyContact = ({
  userDetails,
  handleInputChange,
  handleAddEmergencyContact,
}) => {
  // State to handle error messages
  const [errorMessages, setErrorMessages] = useState({});

  const validateInput = index => {
    const contact = userDetails.emergencyContacts[index];
    let errors = {};

    // Validate emergencyName
    if (!contact.emergencyName || contact.emergencyName.trim() === '') {
      errors.emergencyName = 'Emergency name is required';
    }

    // Validate emergencyContact
    if (!contact.emergencyContact || contact.emergencyContact.trim() === '') {
      errors.emergencyContact = 'Emergency contact number is required';
    }

    // Validate emergencyRelation
    if (!contact.emergencyRelation) {
      errors.emergencyRelation = 'Emergency relation is required';
    }

    setErrorMessages(prevState => ({
      ...prevState,
      [index]: errors,
    }));

    // Return whether the current contact is valid
    return Object.keys(errors).length === 0;
  };

  const handleChange = (index, field, value) => {
    // Update value in the parent state
    handleInputChange('emergencyContacts', index, field, value);
    // Validate after each input change
    validateInput(index);
  };

  return (
    <View style={styles.emergencyContactContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <TouchableOpacity
          //   style={styles.addButton}
          onPress={() => {
            let allValid = true;
            userDetails.emergencyContacts.forEach((_, index) => {
              if (!validateInput(index)) {
                allValid = false;
              }
            });
            if (allValid) {
              handleAddEmergencyContact();
            }
          }}>
          <Ionicons
            name="add-circle"
            size={30}
            color="#172554"
            // style={{marginLeft: 10}}
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {userDetails.emergencyContacts.map((contact, index) => (
          <View key={index} style={styles.contactContainer}>
            <TextInput
              placeholder={`Emergency Name ${index + 1}`}
              value={contact.emergencyName}
              onChangeText={text => handleChange(index, 'emergencyName', text)}
              style={styles.input}
              placeholderTextColor="#888"
            />
            {errorMessages[index]?.emergencyName && (
              <Text style={styles.errorText}>
                {errorMessages[index]?.emergencyName}
              </Text>
            )}

            <TextInput
              placeholder={`Emergency Contact Number ${index + 1}`}
              value={contact.emergencyContact}
              onChangeText={text =>
                handleChange(index, 'emergencyContact', text)
              }
              keyboardType="phone-pad"
              style={styles.input}
              placeholderTextColor="#888"
            />
            {errorMessages[index]?.emergencyContact && (
              <Text style={styles.errorText}>
                {errorMessages[index]?.emergencyContact}
              </Text>
            )}

            <RNPickerSelect
              onValueChange={value =>
                handleChange(index, 'emergencyRelation', value)
              }
              items={[
                {label: 'Friend', value: 'Friend'},
                {label: 'Family', value: 'Family'},
                {label: 'Colleague', value: 'Colleague'},
              ]}
              value={contact.emergencyRelation}
              placeholder={{label: 'Select Relationship', value: null}}
              style={pickerSelectStyles}
            />
            {errorMessages[index]?.emergencyRelation && (
              <Text style={styles.errorText}>
                {errorMessages[index]?.emergencyRelation}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  emergencyContactContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 30,
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  contactContainer: {
    marginBottom: 15,
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
  addButton: {
    backgroundColor: '#0F62FE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff',
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#fff',
  },
};

export default EmergencyContact;
