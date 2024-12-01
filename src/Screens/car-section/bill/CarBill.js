import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Modal, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/core';
import {DOMAIN} from '@env';
const screenWidth = Dimensions.get('window').width;
const {width} = Dimensions.get('window');

// Custom Checkbox Component
const Checkbox = ({label, value, onPress}) => (
  <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
    <View
      style={[
        styles.checkbox,
        {
          backgroundColor: value ? '#bbf7d0' : 'transparent',
          borderColor: value ? '#bbf7d0' : '#888',
        },
      ]}>
      {value && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

const CarRentalInvoice = ({rentalData}) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formattedRentalDate, setformattedRentalDate] = useState(null);
  const [formattedreturnDate, setformattedreturnDate] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const {carid,carCondition} = route.params; 

  const [paymentMethod, setPaymentMethod] = useState('');
  const [UPIMethod, setUPIMethod] = useState('');

  const [cash, setcash] = useState(0);
  const [upi, setupi] = useState(0);
  const [Cheque, setCheque] = useState(0);
  const [Tip, setTip] = useState(0);
  const [Discount, setDiscount] = useState(0);
  const [Damage, setDamage] = useState(0);
  const [DamageRemark, setDamageRemark] = useState('');

  const [count, setcount] = useState('');

  const [Deposite, setDeposite] = useState(0);
  const [DepositeMethod, setDepositeMethod] = useState('Keep');

  const [r_cash, setr_cash] = useState(0);
  const [r_upi, setr_upi] = useState(0);
  const [r_Cheque, setr_Cheque] = useState(0);
  const [return_amount, setreturn_amount] = useState(0);

  const [return_amountMethod, setreturn_amountMethod] = useState('');

  useEffect(() => {
    if (billData) {
      let finalAmount =
        billData.Amount -
        billData.AdvancePay -
        Discount +
        parseFloat(Tip) -
        Deposite;
      if (finalAmount < 0) {
        finalAmount = -finalAmount;
        setreturn_amount(finalAmount);
      }
    }
  }, [billData, Discount, Tip]);

  const handlePaymentMethodChange = method => {
    setPaymentMethod(method);
  };
  const handlereturn_AMount_Method = method => {
    setreturn_amountMethod(method);
  };
  const handledepositeChange = method => {
    setDepositeMethod(method);
  };
  const handleupiChange = method => {
    setUPIMethod(method);
  };

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch(`https://${DOMAIN}/Car/Bill/${carid}/`);
      const data = await response.json();
      const originalTimeZone = 'UTC';

      // Format the date in the original time zone
      const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
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
      setDeposite(data.return);
      setformattedRentalDate(formattedDate);
      setformattedreturnDate(formattedDate2);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Simulate loading for 5 seconds

    const loadingTimeout = setTimeout(() => {
      fetchData();
    }, 5000);

    // Cleanup timeout on unmount
    return () => clearTimeout(loadingTimeout);
  }, [navigation]);

  const calculateAmount = (amount, advance, discount, tip) =>
    parseInt(amount - advance - discount + parseFloat(tip));

  const resetAllPaymentMethods = () => {
    setCheque(0);
    setcash(0);
    setupi(0);
  };

  useEffect(() => {
    if (!billData) return;

    const totalAmount = calculateAmount(
      billData.Amount,
      billData.AdvancePay,
      Discount,
      Tip,
    );

    switch (paymentMethod) {
      case 'cash':
        setcash(totalAmount);
        resetAllPaymentMethods();
        setcash(totalAmount); // Reapply cash as it's the selected payment method
        break;
      case 'upi':
        setupi(totalAmount);
        resetAllPaymentMethods();
        setupi(totalAmount); // Reapply UPI as it's the selected payment method
        break;
      case 'cheque':
        setCheque(totalAmount);
        resetAllPaymentMethods();
        setCheque(totalAmount); // Reapply cheque as it's the selected payment method
        break;
      case 'both':
        resetAllPaymentMethods();
        break;
      default:
        resetAllPaymentMethods();
    }
  }, [paymentMethod, billData, UPIMethod, Tip, Damage, Discount]);

  useEffect(() => {
    if (!Deposite) return;

    const handleReturn = amount => {
      switch (return_amountMethod) {
        case 'cash':
          setr_cash(parseInt(amount));
          setr_Cheque(0);
          setr_upi(0);
          break;
        case 'upi':
          setr_upi(parseInt(amount));
          setr_Cheque(0);
          setr_cash(0);
          break;
        case 'cheque':
          setr_Cheque(parseInt(amount));
          setr_cash(0);
          setr_upi(0);
          break;
        case 'both':
          setr_Cheque(0);
          break;
        default:
          setr_Cheque(0);
      }
    };

    if (DepositeMethod === 'Give') {
      handleReturn(Deposite);
    } else if (DepositeMethod === 'keep') {
      handleReturn(return_amount);
    }
  }, [return_amountMethod, DepositeMethod, Deposite]);

  // Function to close the modal and navigate to the next screen
  const handleCloseModal = async () => {
    try {
      // Validation for paymentMethod and amounts
      if (paymentMethod === 'both') {
        const total =
          billData.Amount - billData.AdvancePay - Discount + parseFloat(Tip);
        if (parseInt(upi) + parseInt(cash) !== total) {
          Alert.alert(
            'Invalid UPI and Cash',
            `Please enter the correct UPI and Cash amounts. Now Total is ${total}`,
            [{text: 'OK'}],
          );
          return;
        }
        if (UPIMethod === '') {
          Alert.alert('Invalid UPI', 'Select the UPI Method First', [
            {text: 'OK'},
          ]);
          return;
        }
      } else if (paymentMethod === 'upi' && UPIMethod === '') {
        Alert.alert('Invalid UPI', 'Select the UPI Method First', [
          {text: 'OK'},
        ]);
        return;
      }

      if (return_amountMethod === 'both') {
        const totalReturn =
          DepositeMethod === 'Give' ? Deposite : return_amount;
        if (parseInt(r_upi) + parseInt(r_cash) !== totalReturn) {
          Alert.alert(
            'Invalid UPI and Cash',
            `Please enter the correct UPI and Cash amounts. Now Total is ${totalReturn}`,
            [{text: 'OK'}],
          );
          return;
        }
      }

      // Prepare data for first API request
      const cashValue = cash ? parseInt(cash, 10) : 0;
      const chequeValue = Cheque ? parseInt(Cheque, 10) : 0;
      const upiValue = upi ? parseInt(upi, 10) : 0;

      if (cashValue === 0 && chequeValue === 0 && upiValue === 0) {
        Alert.alert(
          'Error',
          'At least one payment method must be greater than zero.',
        );
        return; // or handle the error as appropriate
      }

      const data = JSON.stringify({
        Discount: Discount ? parseInt(Discount, 10) : 0,
        cheque: chequeValue,
        Damage: Damage ? parseInt(Damage, 10) : 0,
        DamageRemark: DamageRemark ? DamageRemark : '',
        upi: upiValue,
        cash: cashValue,
        Tip: Tip ? parseInt(Tip, 10) : 0,
        UPIMethod,
      });

      // Prepare data for second API request
      const final_return_amount =
        DepositeMethod === 'Give' ? Deposite : return_amount;
      const reson =
        DepositeMethod === 'Give'
          ? `Gave all Deposited for Rent id ${billData.id}`
          : `Cut the Deposited and gave rest for Rent id ${billData.id}`;

      const data2 = JSON.stringify({
        Amount: final_return_amount,
        upi: r_upi ? parseInt(r_upi, 10) : 0,
        cash: r_cash ? parseInt(r_cash, 10) : 0,
        cheque: r_Cheque ? parseInt(r_Cheque, 10) : 0,
        Reason: reson,
      });

      setLoading(true);

      // Execute both API requests in parallel
      console.log(data);
      const [response1, response2] = await Promise.all([
        fetch(`https://${DOMAIN}/Car/Bill/${carid}/`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: data,
        }),
        fetch(`https://${DOMAIN}/User/we_spent/`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: data2,
        }),
      ]);

      const result1 = await response1.json();
      const result2 = await response2.json();

      if (result1.Error || result2.Error) {
        Alert.alert('Error', result1.Error || result2.Error);
      } else {
        setModalVisible(false);
        navigation.navigate('DrawerNavigator');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {loading ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
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
                Generating Bill
              </Text>
            </View>
          </View>
        </Modal>
      ) : (
        <Modal>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollViewContent}>
            {billData && (
              <View style={styles.invoiceCard}>
                <Text style={styles.invoiceTitle}>Rental Invoice</Text>

                {/* User Details */}
                <View
                  style={{
                    flexDirection: 'column',
                    backgroundColor: 'white',
                    borderRadius: 30,
                    // elevation: 1,
                    borderWidth: 1,
                    borderColor: '#f3f4f6',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 10,
                    }}>
                    <Text
                      style={{
                        color: '#000',
                        fontSize: 12,
                        fontWeight: '300',
                        backgroundColor: 'white',
                        marginBottom: 14,
                      }}>
                      Customer information
                    </Text>
                    <Text style={{color: '#000', fontWeight: '700'}}>
                      User Count - {count}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{billData.user.name}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Contact:</Text>
                    <Text style={styles.value}>{billData.user.phone}</Text>
                  </View>
                </View>

                {/* Vehicle Details */}
                <View
                  style={{
                    flexDirection: 'column',
                    backgroundColor: 'white',
                    borderRadius: 30,
                    // elevation: 1,
                    borderWidth: 1,
                    borderColor: '#f3f4f6',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    marginTop: 20,
                    marginBottom: 20,
                  }}>
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 12,
                      fontWeight: '300',
                      backgroundColor: 'white',
                      marginBottom: 14,
                    }}>
                    Car Detail
                  </Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>License Plate:</Text>
                    <Text style={styles.value}>{billData.Car.carid}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>KM Before:</Text>
                    <Text style={styles.value}>
                      {billData.Car.KM_Now - billData.KM_For}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>KM After:</Text>
                    <Text style={styles.value}>{billData.Car.KM_Now}</Text>
                  </View>

                  {/* Rental Dates */}
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Rental Date:</Text>
                    <Text style={styles.value}>{formattedRentalDate}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Return Date:</Text>
                    <Text style={styles.value}>{formattedreturnDate}</Text>
                  </View>
                </View>
                {/* Discount Input */}
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Discount:</Text>
                  <TextInput
                    style={styles.input}
                    value={Discount}
                    onChangeText={setDiscount}
                    keyboardType="numeric"
                    placeholder="Enter Discount"
                  />
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Tip:</Text>
                  <TextInput
                    style={styles.input}
                    value={Tip}
                    onChangeText={setTip}
                    keyboardType="numeric"
                    placeholder="Enter Tip"
                  />
                </View>
                {carCondition == 'notgood' ? (
                  <>
                    <View style={styles.detailRow}>
                      <Text style={styles.label}>Damage:</Text>
                      <TextInput
                        style={styles.input}
                        value={Damage}
                        onChangeText={setDamage}
                        keyboardType="numeric"
                        placeholder="Enter Damage"
                      />
                    </View>
                  </>
                ) : null}

                {/* Payment Method Selection */}
                <Text style={styles.sectionTitle}>Payment Method</Text>
                <View style={styles.checkboxGroup}>
                  <Checkbox
                    label="Cash"
                    value={paymentMethod === 'cash'}
                    onPress={() => handlePaymentMethodChange('cash')}
                  />
                  <Checkbox
                    label="UPI"
                    value={paymentMethod === 'upi'}
                    onPress={() => handlePaymentMethodChange('upi')}
                  />
                  <Checkbox
                    label="Both"
                    value={paymentMethod === 'both'}
                    onPress={() => handlePaymentMethodChange('both')}
                  />
                  <Checkbox
                    label="Cheque"
                    value={paymentMethod === 'cheque'}
                    onPress={() => handlePaymentMethodChange('cheque')}
                  />
                </View>

                {/* UPI Method for UPI and Both Payment */}
                {(paymentMethod === 'upi' || paymentMethod === 'both') && (
                  <View style={styles.checkboxGroup}>
                    <Checkbox
                      label="QR Code"
                      value={UPIMethod === 'QR Code'}
                      onPress={() => setUPIMethod('qr')}
                    />
                    <Checkbox
                      label="Bank Transfer"
                      value={UPIMethod === 'Number'}
                      onPress={() => setUPIMethod('Number')}
                    />
                  </View>
                )}

                {/* Amount Inputs for Mixed Payment */}
                {paymentMethod === 'both' && (
                  <>
                    <View style={styles.detailRow}>
                      <Text style={styles.label}>Cash Amount:</Text>
                      <TextInput
                        style={styles.input}
                        value={cash}
                        onChangeText={setcash}
                        keyboardType="numeric"
                        placeholder="Enter Cash Amount"
                      />
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.label}>UPI Amount:</Text>
                      <TextInput
                        style={styles.input}
                        value={upi}
                        onChangeText={setupi}
                        keyboardType="numeric"
                        placeholder="Enter UPI Amount"
                      />
                    </View>
                  </>
                )}

                {Deposite > 0 ? (
                  <>
                    <View style={styles.labelContainer}>
                      <Text style={styles.Lable}>Deposite Amount:</Text>
                      <Text style={styles.labelValue}>{Deposite}</Text>
                      <View
                        style={[
                          styles.checkboxContainer2,
                          {marginTop: 10, marginBottom: 10},
                        ]}>
                        <Checkbox
                          label="Give"
                          value={DepositeMethod === 'Give'}
                          onPress={() => handledepositeChange('Give')}
                        />
                        <Checkbox
                          label="Keep"
                          value={DepositeMethod === 'keep'}
                          onPress={() => {
                            handledepositeChange('keep');
                          }}
                        />
                      </View>
                    </View>

                    {DepositeMethod === 'Give' ? (
                      <>
                        <Text style={styles.label}>
                          Deposite Return Method:
                        </Text>
                        <View
                          style={[
                            styles.checkboxContainer,
                            {marginTop: 20, marginBottom: 20},
                          ]}>
                          <Checkbox
                            label="Cash"
                            value={return_amountMethod === 'cash'}
                            onPress={() => {
                              handlereturn_AMount_Method('cash');
                            }}
                          />
                          <Checkbox
                            label="UPI"
                            value={return_amountMethod === 'upi'}
                            onPress={() => handlereturn_AMount_Method('upi')}
                          />
                          <Checkbox
                            label="both"
                            value={return_amountMethod === 'both'}
                            onPress={() => handlereturn_AMount_Method('both')}
                          />
                          <Checkbox
                            label="cheque"
                            value={return_amountMethod === 'cheque'}
                            onPress={() => {
                              handlereturn_AMount_Method('cheque');
                            }}
                          />
                        </View>

                        {return_amountMethod == 'both' ? (
                          <>
                            <View style={styles.labelContainer}>
                              <Text style={styles.Lable}>Cash:</Text>

                              <TextInput
                                style={styles.inputDiscount}
                                onChangeText={text => {
                                  setr_cash(text);
                                }}
                                value={r_cash}
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
                                  setr_upi(text);
                                }}
                                value={r_upi}
                                keyboardType="numeric"
                                placeholder="Enter UPI"
                                placeholderTextColor={'red'}
                              />
                            </View>
                          </>
                        ) : null}
                      </>
                    ) : null}

                    {DepositeMethod === 'keep' &&
                    billData.Amount -
                      billData.AdvancePay -
                      Discount +
                      parseFloat(Tip) -
                      Deposite <
                      0 ? (
                      <>
                        <Text style={styles.label}>Rest Return Method:</Text>
                        <View
                          style={[
                            styles.checkboxContainer,
                            {marginTop: 20, marginBottom: 20},
                          ]}>
                          <Checkbox
                            label="Cash"
                            value={return_amountMethod === 'cash'}
                            onPress={() => {
                              handlereturn_AMount_Method('cash');
                            }}
                          />
                          <Checkbox
                            label="UPI"
                            value={return_amountMethod === 'upi'}
                            onPress={() => handlereturn_AMount_Method('upi')}
                          />
                          <Checkbox
                            label="both"
                            value={return_amountMethod === 'both'}
                            onPress={() => handlereturn_AMount_Method('both')}
                          />
                          <Checkbox
                            label="cheque"
                            value={return_amountMethod === 'cheque'}
                            onPress={() => {
                              handlereturn_AMount_Method('cheque');
                            }}
                          />
                        </View>

                        {return_amountMethod == 'both' ? (
                          <>
                            <View style={styles.labelContainer}>
                              <Text style={styles.Lable}>Cash:</Text>

                              <TextInput
                                style={styles.inputDiscount}
                                onChangeText={text => {
                                  setr_cash(text);
                                }}
                                value={r_cash}
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
                                  setr_upi(text);
                                }}
                                value={r_upi}
                                keyboardType="numeric"
                                placeholder="Enter UPI"
                                placeholderTextColor={'red'}
                              />
                            </View>
                          </>
                        ) : null}
                      </>
                    ) : null}
                  </>
                ) : null}

                {/* Financial Details */}
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Advance Payment:</Text>
                  <Text style={styles.value}>{billData.AdvancePay}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Exact Amount:</Text>
                  <Text style={styles.value}>{billData.Amount}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.totalLabel}>Total Amount:</Text>
                  <Text style={styles.totalValue}>
                    {DepositeMethod === 'Give' ? (
                      <Text style={styles.labelValue2}>
                        {billData.Amount -
                          billData.AdvancePay -
                          Discount +
                          parseFloat(Tip)}
                      </Text>
                    ) : (
                      <Text style={styles.labelValue2}>
                        {billData.Amount -
                          billData.AdvancePay -
                          Discount +
                          parseFloat(Tip) -
                          Deposite}
                      </Text>
                    )}
                  </Text>
                </View>

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>Generate Invoice</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  checkboxContainer2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    margin: 15,
    backgroundColor: '#FFF',
    borderRadius: 30,
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
    marginBottom: 50,
    marginTop: 50,
    borderRadius: 10,
    elevation: 5, // Android shadow
    shadowColor: 'black', // iOS shadow
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    width: '90%',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    padding: 15,
  },
  invoiceCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // elevation: 3,
  },
  invoiceTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    // textAlign: 'center',
    marginBottom: 20,
    // borderBottomWidth: 1,
    // borderLeftWidth :1 ,
    // borderRightWidth:1 ,
    // borderBottomColor: '#eee',
    paddingBottom: 10,
    paddingLeft: 10,
    borderRadius: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,

    paddingBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
    borderBottomWidth: 1,
    borderBottomColor: '#4CAF50',
    paddingBottom: 5,
    width: width * 0.4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  checkmark: {
    color: '#000',
    fontWeight: 'bold',
  },
  checkboxGroup: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  submitButton: {
    backgroundColor: '#bbf7d0',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
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

  submitButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
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
});

export default CarRentalInvoice;
