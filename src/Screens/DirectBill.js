import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  Modal,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/core';
import {DOMAIN} from '@env';
const screenWidth = Dimensions.get('window').width;
const Checkbox = ({label, value, onPress}) => {
  return (
    <TouchableOpacity
      style={[styles.checkboxContainer, {marginRight: 10}]}
      onPress={onPress}>
      <View
        style={[
          styles.checkbox,
          {backgroundColor: value ? '#feb101' : 'transparent'},
        ]}>
        {value && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={{fontWeight: 'bold', color: 'green', fontSize: 13}}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};
const DirectBill = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(true);
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Complete, setComplete] = useState(false);
  const route = useRoute();
  const [currentPage, setCurrentPage] = useState(0);

  const [formattedRentalDate, setformattedRentalDate] = useState(null);
  const [formattedreturnDate, setformattedreturnDate] = useState(null);
  const {phoneNumber, selectedDate} = route.params;

  const [paymentMethod, setPaymentMethod] = useState('');
  const [UPIMethod, setUPIMethod] = useState('');
  const bikeCondition = 'good';
  const [cash, setcash] = useState(0);
  const [upi, setupi] = useState(0);
  const [Cheque, setCheque] = useState(0);
  const [Tip, setTip] = useState(0);
  const [Discount, setDiscount] = useState(0);
  const [Damage, setDamage] = useState(0);
  const [b_id, setbid] = useState('');
  const [count, setcount] = useState('');

  const handleNextPage = () => {
    setLoading(true);
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setLoading(true);
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePaymentMethodChange = method => {
    setPaymentMethod(method);
  };
  const handleupiChange = method => {
    setUPIMethod(method);
  };
  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://${DOMAIN}/Bike/Bill2/${phoneNumber}/${selectedDate}/${currentPage}/`,
      );
      const data = await response.json();

      const originalTimeZone = 'UTC';
      if (data.Error) {
        Alert.alert('Error', data.Error, [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
        setLoading(false);
      }
      // Format the date in the original time zone
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: originalTimeZone,
      };

      // Create a JavaScript Date object for rental_date

      const rentalDate = new Date(data.Data.rental_date);
      const formattedDate = rentalDate.toLocaleString(undefined, options);

      const returnDate = new Date(data.Data.return_date);

      // Adjust the time zone offset to IST (UTC+5:30)
      const formattedDate2 = returnDate.toLocaleString(undefined, options);
      setBillData(data.Data);
      setcount(data.Count);
      setbid(data.b_id);
      setformattedRentalDate(formattedDate);
      setformattedreturnDate(formattedDate2);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      fetchData();
    }, 5000);

    // Cleanup timeout on unmount
    return () => clearTimeout(loadingTimeout);
  }, [navigation, currentPage]);

  useEffect(() => {
    if (!billData) {
      return;
    }
    if (
      paymentMethod != 'cheque' &&
      paymentMethod == 'cash' &&
      paymentMethod != 'upi'
    ) {
      setcash(
        parseInt(
          billData.Amount - billData.AdvancePay - Discount + parseFloat(Tip),
        ),
      );
      setCheque(0);
      setupi(0);
      setUPIMethod('');
    }
    if (
      paymentMethod != 'cash' &&
      paymentMethod == 'upi' &&
      paymentMethod != 'cheque'
    ) {
      setupi(
        parseInt(
          billData.Amount - billData.AdvancePay - Discount + parseFloat(Tip),
        ),
      );
      setCheque(0);
      setcash(0);
    }
    if (
      paymentMethod != 'cash' &&
      paymentMethod == 'cheque' &&
      paymentMethod != 'upi'
    ) {
      setCheque(
        parseInt(
          billData.Amount - billData.AdvancePay - Discount + parseFloat(Tip),
        ),
      );
      setcash(0);
      setupi(0);
      setUPIMethod('');
    }
    if (
      paymentMethod != 'cash' &&
      paymentMethod !== 'cheque' &&
      paymentMethod != 'upi' &&
      paymentMethod === 'both'
    ) {
      setCheque(0);
    }
  }, [paymentMethod, billData, UPIMethod, Tip, Damage, Discount]);

  // Function to close the modal and navigate to the next screen
  const handleCloseModal = () => {
    setComplete(true);
    if (paymentMethod == 'both') {
      if (
        parseInt(upi) + parseInt(cash) !==
        billData.Amount - billData.AdvancePay - Discount + parseFloat(Tip)
      ) {
        Alert.alert(
          'Invalid UPI and Cash',
          'Please enter the correct UPI and Cash amounts.',
          [
            {
              text: 'OK',
            },
          ],
        );
        return;
      }
      if (UPIMethod == '') {
        Alert.alert('Invalid UPI', 'Select the UPI Method First', [
          {
            text: 'OK',
          },
        ]);
        return;
      }
    }
    if (UPIMethod == '' && paymentMethod == 'upi') {
      Alert.alert('Invalid UPI', 'Select the UPI Method First', [
        {
          text: 'OK',
        },
      ]);
      return;
    }

    const data = JSON.stringify({
      Discount:
        Discount !== undefined && Discount !== '' && Discount !== null
          ? parseInt(Discount, 10)
          : 0,
      cheque:
        Cheque !== undefined && Cheque !== null ? parseInt(Cheque, 10) : 0,
      Damage:
        Damage !== undefined && Damage !== null ? parseInt(Damage, 10) : 0,
      upi: upi !== undefined && upi !== null ? parseInt(upi, 10) : 0,
      cash: cash !== undefined && cash !== null ? parseInt(cash, 10) : 0,
      Tip: Tip !== undefined && Tip !== null ? parseInt(Tip, 10) : 0,

      UPIMethod: UPIMethod,
    });

    setLoading(true);
    fetch(`https://${DOMAIN}/Bike/Bill3/${b_id}/${phoneNumber}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        setTimeout(() => {
          if (responseJson.Error) {
            Alert.alert('Error', responseJson.Error);
          } else {
            navigation.navigate('Home');
          }

          setLoading(false);
        }, 500);
      })
      .catch(error => {
        console.log(error);
        setTimeout(() => {
          Alert.alert('Error', `Try again!`);
          setLoading(false);
        }, 500);
      });
  };

  return (
    <View>
      {loading ? (
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.loadingIndicator}>
              <ActivityIndicator size="large" color="#000" />
              <Text
                style={{
                  color: '#000',
                  fontWeight: '600',
                  marginTop: 20,
                  fontSize: 15,
                }}>
                {Complete ? 'In Progress!' : 'Generating Bill'}
              </Text>
            </View>
          </View>
        </Modal>
      ) : (
        <Modal animationType="slide" transparent={false} visible={modalVisible}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.modalContainer}>
              {billData && (
                <View style={styles.billContainer}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.billHeader}>Invoice</Text>
                    <Text style={{color: '#000', fontWeight: '700'}}>
                      User Count - {count}
                    </Text>
                  </View>
                  <View style={styles.labelContainer}>
                    <Text style={styles.Lable}>Name:</Text>
                    <Text style={styles.labelValue}>{billData.user.name}</Text>
                  </View>
                  <View style={styles.labelContainer}>
                    <Text style={styles.Lable}>Phone:</Text>
                    <Text style={styles.labelValue}>{billData.user.phone}</Text>
                  </View>
                  <View style={styles.labelContainer}>
                    <Text style={styles.Lable}>License Plate:</Text>
                    <Text style={styles.labelValue}>{billData.bike.b_id}</Text>
                  </View>
                  <View style={styles.labelContainer}>
                    <Text style={styles.Lable}>KM Before:</Text>
                    <Text style={styles.labelValue}>{billData.KM_Went}</Text>
                  </View>
                  <View style={styles.labelContainer}>
                    <Text style={styles.Lable}>KM Now:</Text>
                    <Text style={styles.labelValue}>
                      {billData.KM_Went + billData.KM_For}
                    </Text>
                  </View>
                  <View style={styles.labelContainer}>
                    <Text style={styles.Lable}>Rental Date:</Text>
                    <Text style={styles.labelValue}>{formattedRentalDate}</Text>
                  </View>
                  <View style={styles.labelContainer}>
                    <Text style={styles.Lable}>Return Date:</Text>
                    <Text style={styles.labelValue}>{formattedreturnDate}</Text>
                  </View>
                  <View style={styles.labelContainer}>
                    <Text style={styles.Lable}>Discount:</Text>
                    <TextInput
                      style={styles.inputDiscount}
                      onChangeText={text => setDiscount(text)}
                      value={Discount}
                      keyboardType="numeric"
                      placeholder="Enter Discount"
                      placeholderTextColor={'red'}
                    />
                  </View>
                  <View style={styles.labelContainer}>
                    <Text style={styles.Lable}>Tip If User Wants:</Text>
                    <TextInput
                      style={styles.inputDiscount}
                      onChangeText={text => setTip(text)}
                      value={Tip.toString()}
                      keyboardType="numeric"
                      placeholder="Enter Tip"
                      placeholderTextColor={'red'}
                    />
                  </View>
                  <Text style={styles.label}>Payment Method:</Text>
                  <View
                    style={[
                      styles.checkboxContainer,
                      {marginTop: 20, marginBottom: 20},
                    ]}>
                    <Checkbox
                      label="Cash"
                      value={paymentMethod === 'cash'}
                      onPress={() => {
                        handlePaymentMethodChange('cash');
                        handleupiChange('');
                      }}
                    />
                    <Checkbox
                      label="UPI"
                      value={paymentMethod === 'upi'}
                      onPress={() => handlePaymentMethodChange('upi')}
                    />
                    <Checkbox
                      label="both"
                      value={paymentMethod === 'both'}
                      onPress={() => handlePaymentMethodChange('both')}
                    />
                    <Checkbox
                      label="cheque"
                      value={paymentMethod === 'cheque'}
                      onPress={() => {
                        handlePaymentMethodChange('cheque');
                        handleupiChange('');
                      }}
                    />
                  </View>

                  {paymentMethod == 'both' ? (
                    <>
                      <View style={styles.checkboxContainer}>
                        <Text style={styles.label}>UPI Type:</Text>
                        <View
                          style={{flexDirection: 'row', paddingHorizontal: 2}}>
                          <Checkbox
                            label="QR Code"
                            value={UPIMethod === 'QR Code'}
                            onPress={() => handleupiChange('QR Code')}
                          />
                          <Checkbox
                            label="Number"
                            value={UPIMethod === 'Number'}
                            onPress={() => handleupiChange('Number')}
                          />
                        </View>
                      </View>

                      <View style={styles.labelContainer}>
                        <Text style={styles.Lable}>Cash:</Text>

                        <TextInput
                          style={styles.inputDiscount}
                          onChangeText={text => {
                            setcash(text);
                          }}
                          value={cash}
                          keyboardType="numeric"
                          placeholder="Enter Cash"
                          placeholderTextColor={'red'}
                        />
                      </View>

                      <View style={styles.labelContainer}>
                        <Text style={styles.Lable}>UPI:</Text>
                        <TextInput
                          style={styles.inputDiscount}
                          onChangeText={text => {
                            setupi(text);
                          }}
                          value={upi}
                          keyboardType="numeric"
                          placeholder="Enter UPI"
                          placeholderTextColor={'red'}
                        />
                      </View>
                    </>
                  ) : null}

                  {paymentMethod == 'upi' ? (
                    <>
                      <View style={styles.checkboxContainer}>
                        <Text style={styles.label}>UPI Type:</Text>
                        <View
                          style={{flexDirection: 'row', paddingHorizontal: 2}}>
                          <Checkbox
                            label="QR Code"
                            value={UPIMethod === 'QR Code'}
                            onPress={() => handleupiChange('QR Code')}
                          />
                          <Checkbox
                            label="Number"
                            value={UPIMethod === 'Number'}
                            onPress={() => handleupiChange('Number')}
                          />
                        </View>
                      </View>
                    </>
                  ) : null}

                  {bikeCondition == 'notgood' ? (
                    <View style={styles.labelContainer}>
                      <Text style={styles.Lable}>Damage Pay:</Text>
                      <TextInput
                        style={styles.inputDiscount}
                        onChangeText={text => setDamage(text)}
                        value={Damage}
                        keyboardType="numeric"
                        placeholder="Enter Damage"
                        placeholderTextColor={'red'}
                      />
                    </View>
                  ) : null}

                  <View style={styles.labelContainer}>
                    <Text style={styles.Lable}>Advanced Payed:</Text>
                    <Text style={styles.labelValue}>{billData.AdvancePay}</Text>
                  </View>
                  <View style={styles.labelContainer}>
                    <Text style={styles.Lable}>Exact Amount:</Text>
                    <Text style={styles.labelValue}>{billData.Amount}</Text>
                  </View>

                  <View style={styles.labelContainer}>
                    <Text style={styles.Lable2}>Total Amount:</Text>
                    <Text style={styles.labelValue2}>
                      {billData.Amount -
                        billData.AdvancePay -
                        Discount +
                        parseFloat(Tip)}
                    </Text>
                  </View>
                  {/* <Button style={styles.Button} title="Close" onPress={handleCloseModal} /> */}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      <TouchableOpacity
                        style={[
                          styles.CloseButton,
                          {paddingHorizontal: 40, paddingVertical: 3},
                        ]}
                        onPress={handleCloseModal}>
                        <Text
                          style={{
                            color: '#feb101',
                            fontWeight: '600',
                            fontSize: 20,
                            letterSpacing: 2,
                          }}>
                          Close
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
                      <TouchableOpacity
                        style={[
                          styles.CloseButton,
                          {paddingHorizontal: 40, paddingVertical: 3},
                        ]}
                        onPress={() => navigation.goBack()}>
                        <Text
                          style={{
                            color: '#feb101',
                            fontWeight: '600',
                            fontSize: 20,
                            letterSpacing: 2,
                          }}>
                          Back
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}

              <View style={styles.paginationButtonsContainer}>
                <TouchableOpacity
                  style={styles.paginationButton}
                  onPress={handlePrevPage}>
                  <Text style={styles.paginationButtonText}>Previous Bill</Text>
                </TouchableOpacity>
                <Text style={{color: '#000', fontSize: 23, fontWeight: '700'}}>
                  {currentPage + 1}
                </Text>
                <TouchableOpacity
                  style={styles.paginationButton}
                  onPress={handleNextPage}>
                  <Text style={styles.paginationButtonText}>Next Bill</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </Modal>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  paginationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 35,
  },
  paginationButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 30,
  },
  paginationButtonText: {
    textAlign: 'center',
    color: '#feb101',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },

  ModalParentConainer: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backgroundColor: '#feb101',
  },

  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10, // Optional: Add margin between label-value pairs
  },
  Lable: {
    color: '#000',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  labelValue: {
    color: 'green',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  Lable2: {
    color: '#000',
    fontSize: 22,
    marginBottom: 10,
    fontWeight: 'bold',
    borderBottomWidth: 1,
  },
  labelValue2: {
    color: 'green',
    fontSize: 22,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  inputDiscount: {
    fontWeight: 'bold',
    justifyContent: 'flex-end',
    fontSize: 14,
    color: 'green',
    textAlign: 'right',
  },
  billContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 23,
    marginTop: 40,
    borderRadius: 10,
    elevation: 5, // Android shadow
    shadowColor: 'black', // iOS shadow
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    width: '90%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  billHeader: {
    fontSize: screenWidth * 0.03,
    textTransform: 'capitalize',
    borderBottomWidth: 1,
    width: screenWidth * 0.25,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  CloseButton: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#feb101',
    backgroundColor: '#000',
    paddingHorizontal: 1,
    paddingVertical: 9,
    borderRadius: 9,
    width: '100%',
  },

  // Add more styles as needed
});
export default DirectBill;
