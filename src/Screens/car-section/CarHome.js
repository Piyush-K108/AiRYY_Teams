import React, {useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const CarRent = () => {
  const navigation = useNavigation();

  // Animated values for rotation and floating
  const rotateValue = useRef(new Animated.Value(0)).current;
  const floatValue = useRef(new Animated.Value(0)).current;

  // Rotation animation
  const startRotation = useCallback(() => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 2000, // 4 seconds for a complete 360 rotation
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotateValue]);

  // Floating animation for header
  const startFloating = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatValue, {
          toValue: -10, // Move up by 10 units
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(floatValue, {
          toValue: 0, // Move back to original position
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [floatValue]);

  // useEffect for starting animations
  useEffect(() => {
    startRotation();
    startFloating();

    // Cleanup function to stop animations
    return () => {
      rotateValue.stopAnimation();
      floatValue.stopAnimation();
    };
  }, [startRotation, startFloating, rotateValue, floatValue]);

  // Interpolating rotateValue to get rotation
  const rotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{flex: 1, backgroundColor: '#fefce8'}}>
      <View style={styles.container}>
        <View style={styles.headercontainer2}>
          <Text style={styles.AiryyCars}>AiRYY CARS</Text>
          {/* <Ionicons name={'car-sport-outline'} size={50} color={'#172554'} /> */}
        </View>
        {/* Animated header with floating effect */}
        <Animated.View
          style={[
            styles.headerContainer,
            {transform: [{translateY: floatValue}]},
          ]}>
          <View style={styles.carTitleContainer1}>
            <Text style={styles.carTitle1}>Need a Car? Tap Rent.</Text>
          </View>

          <View style={styles.carTitleContainer2}>
            <Text style={styles.carTitle2}>Returning? Tap Deposit.</Text>
          </View>
        </Animated.View>

        {/* Two-tiered design with rotation */}
        <View style={styles.tierContainer}>
          {/* Upper Tier with both horizontal and vertical lines */}
          <Animated.View
            style={[styles.upperTier, {transform: [{rotate: rotation}]}]}>
            {/* Horizontal line */}
            <View style={styles.horizontalLine} />
            {/* Vertical line */}
            <View style={styles.verticalLine} />
          </Animated.View>

          {/* Lower Tier with both horizontal and vertical lines */}
          <Animated.View
            style={[styles.lowerTier, {transform: [{rotate: rotation}]}]}>
            {/* Horizontal line */}
            <View style={styles.horizontalLine} />
            {/* Vertical line */}
            <View style={styles.verticalLine} />
          </Animated.View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('CarCustomerDetail', {
                car: true,
              });
            }}>
            <Text style={styles.buttonText}>Rent Car</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('CarDepositeDetail');
            }}>
            <Text style={styles.buttonText}>Deposit Car</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
  },
  headerContainer: {
    backgroundColor: '#fef3c7',
    width: '90%',
    height: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    borderWidth: 5,
    marginTop: 50,
    marginLeft: 25,
    borderTopRightRadius: 190,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 25,
    marginBottom: 10,
  },

  headercontainer2: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#fde68a',
    width: '100%',
    height: 200,
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 6,
    marginBottom: 50,

    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
  },

  AiryyCars: {
    fontSize: 40, // Large font size for emphasis
    fontWeight: 'bold', // Bold to make it stand out
    color: '#000', // Light color to contrast with the blue background
    letterSpacing: 2, // Add some letter spacing for a clean look
    // textShadowColor: '#1d4ed8',   // Dark blue shadow for subtle depth
    textShadowOffset: {width: 4, height: 4}, // Shadow offset for depth effect
    textShadowRadius: 4, // Soft shadow to enhance readability
    textAlign: 'center', // Center align to keep it aligned within the parent
  },
  upperTier: {
    backgroundColor: '#fefce8',
    width: 100,
    height: 100,
    borderWidth: 10,
    borderRadius: 50,
    justifyContent: 'center', // Center the lines vertically
    alignItems: 'center', // Center the lines horizontally
    position: 'relative',
  },
  lowerTier: {
    backgroundColor: '#fefce8',
    width: 100,
    height: 100,
    borderWidth: 10,
    borderRadius: 50,
    justifyContent: 'center', // Center the lines vertically
    alignItems: 'center', // Center the lines horizontally
    position: 'relative',
  },
  horizontalLine: {
    width: '80%', // Adjust width of horizontal line
    height: 1, // Height of horizontal line
    backgroundColor: '#000', // Color of the line (black)
    position: 'absolute', // Ensure correct positioning
    top: '50%', // Position in the middle vertically
  },
  verticalLine: {
    height: '80%', // Adjust height of vertical line
    width: 1, // Width of vertical line
    backgroundColor: '#000', // Color of the line (black)
    position: 'absolute', // Ensure correct positioning
    left: '50%', // Position in the middle horizontally
  },
  carTitleContainer1: {
    justifyContent: 'center',
    width: 80,
    paddingLeft: 5,
    paddingRight: 5,
    height: 70,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: '#fefce8',
  },
  carTitleContainer2: {
    justifyContent: 'center',
    width: 80,
    paddingLeft: 5,
    paddingRight: 5,
    height: 70,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: '#fefce8',
  },
  carTitle1: {
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    lineHeight: 24,
    marginVertical: 10,
  },
  carTitle2: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    lineHeight: 24,
    marginVertical: 10,
  },
  tierContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  airyyContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  airyyText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1d4ed8', // Dark blue color for contrast
    textShadowColor: '#93c5fd', // Light blue shadow
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 4,
    letterSpacing: 2, // Adds spacing between letters for styling
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: '#fcd34d',
    // width: '45%',
    paddingHorizontal: 30,
    paddingVertical: 10,
    // height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    elevation: 6,
    // borderWidth: 1,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 1,
  },
});

export default CarRent;
