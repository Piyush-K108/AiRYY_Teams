import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  StyleSheet,
  Image,
} from 'react-native';
import MuiIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MuiIcons from 'react-native-vector-icons/MaterialIcons';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import CarRent from '../Screens/car-section/CarHome';
import {useNavigation} from '@react-navigation/native';
import BikeAvailability from '../Screens/BikeAvailability';
import {useDispatch} from 'react-redux';
import {logout} from '../Redux/Counter/counterAction';
import Ionicons from 'react-native-vector-icons/Ionicons';


import AttachedBikes from '../Screens/AttachedBikes';
import PersnalUSe from '../Screens/PersnalUse';
import BillData from '../Screens/BillData';
import Offers from '../Screens/Offers';
import Scheduled from '../Screens/Scheduled';
import Servicing from '../Screens/Servicing';
import UserBill from '../Screens/UserBill';
import CarHome from '../Screens/car-section/CarHome';


import BikeDoc from '../Screens/BikeDoc';


const DrawerContent = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setIsLoading(true);

    // Perform the logout functionality here
    dispatch(logout(false));

    // Simulating logout delay
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Login');
      BackHandler.exitApp();
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} style={styles.lables}>
        <View>
          <Image
            source={require('../assets/AiryyLogo.png')} // Replace with your logo path
            style={styles.logo}
          />
          <DrawerItemList {...props} />
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={24}
              color="#000"
              style={styles.logoutIcon}
            />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
      <View style={styles.copyrightContainer}>
        <Text style={styles.copyrightText}>© 2024 AiRYY Rides</Text>
      </View>
    </View>
  );
};

const Drawer = createDrawerNavigator();

const CarDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Car Home"
      screenOptions={{
        headerShown: true,
        headerStyle: {backgroundColor: '#feb101'},
        headerTintColor: '#000000',
        drawerLabelStyle: {
          fontWeight: 'bold',
          color: '#000',
          textAlign: 'center',
        },
        drawerActiveTintColor: '#feb101',
        headerTitleStyle: {fontWeight: 'bold'},
      }}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="Car Home"
        component={CarHome}
        options={({navigation}) => ({
          drawerLabel: 'Car Home',
          title: '',
          drawerIcon: ({focused}) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={focused ? '#feb101' : '#000000'}
            />
          ),
          drawerItemStyle: {textAlign: 'left'}, // Align text to the left
          headerStyle: {
            backgroundColor: '#fde68a',
            elevation: 0, // For Android (removes shadow)
            shadowOpacity: 0, // For iOS (removes shadow opacity)
            shadowColor: 'transparent', // For iOS (makes shadow color transparent)
            shadowOffset: {height: 0, width: 0}, // Removes shadow offset
            shadowRadius: 0, // Removes shadow radius
          },
          headerRight: () => (
            <TouchableOpacity
              style={styles.rentCarButton}
              onPress={() => navigation.navigate('DrawerNavigator')}>
              <MuiIcon name={'motorbike'} size={24} color={'#000'} />
            </TouchableOpacity>
          ),
        })}
      />

      <Drawer.Screen
        name="BikeAvailability"
        component={BikeAvailability}
        options={{
          drawerLabel: 'Bike Availability',
          title: 'Bike Availability',
          drawerIcon: ({focused}) => (
            <MuiIcon
              name={focused ? 'motorbike' : 'motorbike'} // Use your preferred icon names
              size={26}
              color={focused ? '#feb101' : '#000000'}
            />
          ),
          drawerItemStyle: {textAlign: 'left'}, // Align text to the left
        }}
      />

      <Drawer.Screen
        name="Scheduled"
        component={Scheduled}
        options={{
          drawerLabel: 'Scheduled',
          title: 'Scheduled',
          drawerIcon: ({focused}) => (
            <MuiIcons
              name={focused ? 'schedule' : 'schedule'} // Use your preferred icon names
              size={26}
              color={focused ? '#feb101' : '#000000'}
            />
          ),
          drawerItemStyle: {textAlign: 'left'}, // Align text to the left
        }}
      />

      {/* <Drawer.Screen
        name="CarRent"
        component={CarRent}
        options={{
          drawerLabel: 'Car Rent',
          title: 'Car Rent',
          drawerIcon: ({focused}) => (
            <MuiIcon
              name={focused ? 'car-hatchback' : 'car-hatchback'} // Use your preferred icon names
              size={26}
              color={focused ? '#feb101' : '#000000'}
            />
          ),
          drawerItemStyle: {textAlign: 'left'}, // Align text to the left
        }}
      /> */}
      <Drawer.Screen
        name="BikeDoc"
        component={BikeDoc}
        options={{
          drawerLabel: 'Bike Documents',
          title: 'Bike Documents',
          drawerIcon: ({focused}) => (
            <MuiIcon
              name={focused ? 'file-document' : 'file-document'} // Use your preferred icon names
              size={26}
              color={focused ? '#feb101' : '#000000'}
            />
          ),
          drawerItemStyle: {textAlign: 'left'}, // Align text to the left
        }}
      />
      <Drawer.Screen
        name="Servicing"
        component={Servicing}
        options={{
          drawerLabel: 'Servicing',
          title: 'Servicing',
          drawerIcon: ({focused}) => (
            <MuiIcon
              name={focused ? 'repeat' : 'repeat'} // Use your preferred icon names
              size={26}
              color={focused ? '#feb101' : '#000000'}
            />
          ),
          drawerItemStyle: {textAlign: 'left'}, // Align text to the left
        }}
      />
      <Drawer.Screen
        name="AttachedBikes"
        component={AttachedBikes}
        options={{
          drawerLabel: 'Attach Bikes',
          title: 'Attach Bikes',
          drawerIcon: ({focused}) => (
            <MuiIcon
              name={focused ? 'motorbike-electric' : 'motorbike-electric'} // Use your preferred icon names
              size={26}
              color={focused ? '#feb101' : '#000000'}
            />
          ),
          drawerItemStyle: {textAlign: 'left'}, // Align text to the left
        }}
      />
      <Drawer.Screen
        name="Bill"
        component={BillData}
        options={{
          drawerLabel: 'Bill',
          title: 'Bill',
          drawerIcon: ({focused}) => (
            <Ionicons
              name={focused ? 'card' : 'card-outline'} // Use your preferred icon names
              size={24}
              color={focused ? '#feb101' : '#000000'}
            />
          ),
          drawerItemStyle: {textAlign: 'left'}, // Align text to the left
        }}
      />

      <Drawer.Screen
        name="Persnal Use"
        component={PersnalUSe}
        options={{
          drawerLabel: 'Persnal Use',
          title: 'Persnal Use',
          drawerIcon: ({focused}) => (
            <MuiIcon
              name={focused ? 'bike-fast' : 'bike-fast'} // Use your preferred icon names
              size={24}
              color={focused ? '#feb101' : '#000000'}
            />
          ),
          drawerItemStyle: {textAlign: 'left'}, // Align text to the left
        }}
      />
    </Drawer.Navigator>
  );
};

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
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',

    backgroundColor: '#fff',
  },
  lables: {
    backgroundColor: '#fff',
    paddingTop: 30,
    paddingHorizontal: 16,
    flex: 1,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#feb101',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutIcon: {
    marginLeft: 10,
    color: '#000', // Add space between icon and text
  },
  logoutButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 80,
  },
  copyrightContainer: {
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  copyrightText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },

  rentCarButton: {
    marginRight: 16, // Adjust for spacing

    paddingHorizontal: 8,

    // borderWidth:1 ,

    elevation: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 25,
  },
  rentCarButtonText: {
    color: '#feb101',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default CarDrawerNavigator;
