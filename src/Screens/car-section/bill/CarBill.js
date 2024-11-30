import React, {useState} from 'react';
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
  // State for invoice details
  const [discount, setDiscount] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [upiMethod, setUPIMethod] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [upiAmount, setUPIAmount] = useState('');

  // Calculate totals
//   const exactAmount = rentalData.rentalRate;
//   const advancePayment = rentalData.advancePayment;
//   const totalAmount =
//     exactAmount - advancePayment - parseFloat(discount || '0');

  // Payment method handlers
  const handlePaymentMethodChange = method => {
    setPaymentMethod(method);
    // Reset UPI method when changing payment method
    setUPIMethod('');
  };

  const handleSubmitInvoice = () => {
    // Validation logic
    if (!paymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    // Additional validation based on payment method
    if (paymentMethod === 'both') {
      if (!upiMethod) {
        Alert.alert('Error', 'Please select UPI method');
        return;
      }
      if (!cashAmount || !upiAmount) {
        Alert.alert('Error', 'Please enter both cash and UPI amounts');
        return;
      }
    }

    // Process invoice
    console.log('Invoice Submitted', {
      paymentMethod,
      upiMethod,
      discount,
      cashAmount,
      upiAmount,
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollViewContent}>
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
          <View style={styles.detailRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>Prashant Khanchandani</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Contact:</Text>
            <Text style={styles.value}>9685741041</Text>
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
            <Text style={styles.value}>Mp010 -2022</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>KM Before:</Text>
            <Text style={styles.value}>200002</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>KM After:</Text>
            <Text style={styles.value}>400000</Text>
          </View>

          {/* Rental Dates */}
          <View style={styles.detailRow}>
            <Text style={styles.label}>Rental Date:</Text>
            <Text style={styles.value}>20-11-2024</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Return Date:</Text>
            <Text style={styles.value}>23-11-2024</Text>
          </View>
        </View>
        {/* Discount Input */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Discount:</Text>
          <TextInput
            style={styles.input}
            value={discount}
            onChangeText={setDiscount}
            keyboardType="numeric"
            placeholder="Enter Discount"
          />
        </View>

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
              value={upiMethod === 'qr'}
              onPress={() => setUPIMethod('qr')}
            />
            <Checkbox
              label="Bank Transfer"
              value={upiMethod === 'bank'}
              onPress={() => setUPIMethod('bank')}
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
                value={cashAmount}
                onChangeText={setCashAmount}
                keyboardType="numeric"
                placeholder="Enter Cash Amount"
              />
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>UPI Amount:</Text>
              <TextInput
                style={styles.input}
                value={upiAmount}
                onChangeText={setUPIAmount}
                keyboardType="numeric"
                placeholder="Enter UPI Amount"
              />
            </View>
          </>
        )}

        {/* Financial Details */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Advance Payment:</Text>
          <Text style={styles.value}>₹350</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Exact Amount:</Text>
          <Text style={styles.value}>₹3000</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>₹50000</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmitInvoice}>
          <Text style={styles.submitButtonText}>Generate Invoice</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 15,
    backgroundColor: '#FFF',
    borderRadius:30 , 
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
  submitButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default CarRentalInvoice;
