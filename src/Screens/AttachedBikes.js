import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Image,
  ScrollView
} from 'react-native';
import LottieView from 'lottie-react-native';
import {DOMAIN} from '@env';
import Ionicons from 'react-native-vector-icons/Ionicons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function AttachedBikes() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    const data = {
      email: email,
    };

    try {
      const response = await fetch(`https://${DOMAIN}/Admin/getAttached/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
       
        Alert.alert('Done', 'Mail is Send to the User.', [
          {
            text: 'OK',
          },
        ]);
      } else {
        // Handle errors
        console.error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={{flex:1 , backgroundColor:'#FFF' , height:windowHeight}}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View
            style={{
              flexDirection: 'column',
              borderWidth: 1,
              borderColor: 'gray',
              borderRadius: 50,
              borderBottomRightRadius: 0,
              // width: windowWidth * 0.4,
              // height: windowHeight * 0.2,
              width: 150,
              height: 150,
              justifyContent: 'center',
              paddingHorizontal: 12,
              backgroundColor: '#000',
            }}>
            <Text style={[styles.title, {color: 'yellow'}]}> Send</Text>
            <Text style={[styles.title, {color: 'orange'}]}> Invitation</Text>
            <Text style={[styles.title, {color: 'pink'}]}>
              {' '}
              to our partner.
            </Text>
          </View>

          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Image
              style={styles.Attachimage}
              source={require('../assets/AttachBikeone.png')} // Replace with the path to your image file
              resizeMode="cover" // Adjust the resizeMode as needed (cover, contain, stretch, etc.)
            />
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <LottieView
                style={styles.Loadinganime}
                source={require('../assets/rocket.json')} // Replace with your animation file path
                autoPlay
                loop
              />
            </View>
          ) : isSuccess ? (
            <Text style={{color: '#000', fontWeight: '300', marginBottom: 5}}>
              Form submitted successfully.
            </Text>
          ) : null}

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              {/* <Text style={styles.label}>Gmail</Text> */}

              <View style={styles.inputIconContainer}>
                <Ionicons name="mail" size={24} color="#feb101" />
                <TextInput
                  style={styles.emailInput}
                  placeholder="Enter email of our partner"
                  placeholderTextColor="#000"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={text => setEmail(text)}
                />
              </View>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}>
                {/* <Text style={styles.submitButtonText}>SUBMIT</Text> */}
                <Ionicons name="rocket-outline" size={24} color="#feb101" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingTop: '15%',
    height: windowHeight,
  },
  loadingContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: Add a semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    width: '100%',
    height: '100%',
  },
  Attachimage: {
    width: 200,
    height: 200,
  },
  formContainer: {
    width: windowWidth * 0.8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    // textAlign: 'center',
    // backgroundColor:'#FFF',
    //  fontFamily:'',
    // elevation: 1,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 2,
    // borderRadius:9,
    // marginBottom: windowWidth * 0.09,
    color: '#333',
    // paddingVertical:30 ,

    // borderBottomLeftRadius:50 ,
    // borderTopRightRadius:50 ,
  },
  form: {
    // marginTop: windowWidth * 0.2,
    backgroundColor: '#FFF',
    paddingHorizontal: 25,
    paddingVertical: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    borderRadius: 5,
  },
  inputContainer: {
    marginBottom: windowWidth * 0.04,
  },
  inputIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderRadius: 9,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: windowWidth * 0.06,
    color: '#000',
  },
  emailInput: {
    color: '#000',

    fontSize: 14,
    // height: windowWidth * 0.1,
    // borderColor: '#000',
    // borderBottomWidth:1 ,
    // paddingLeft: windowWidth * 0.02,
    // marginBottom: windowWidth * 0.04,
  },
  submitButton: {
    backgroundColor: '#333',
    padding: windowWidth * 0.03,
    borderRadius: windowWidth * 0.01,
    alignItems: 'center',
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  submitButtonText: {
    color: '#feb101',
    letterSpacing: 2,
    fontWeight: '800',
  },
});

export default AttachedBikes;
