import React from 'react';
import {useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../Screens/Login';
import CustomerDetails from '../Screens/CustomerDetails';
import VehicleDetails from '../Screens/VahicleDetails';
import DepositeDetail from '../Screens/DepositeDetail';
import DrawerNavigator from './DrawerNavigator';
import AgreementPage from '../Screens/AgreementPage';
import Signature from '../Screens/Signature';
import Home from '../Screens/Home';
import UserBill from '../Screens/UserBill';
import PersnalUSe from '../Screens/PersnalUse';
import DirectBill from '../Screens/DirectBill';
import AttachedBikes from '../Screens/AttachedBikes';
import BillData from '../Screens/BillData';
import Offers from '../Screens/Offers';
import Scheduled from '../Screens/Scheduled';
import Servicing from '../Screens/Servicing';
import Emergency from '../Screens/Emergency';
import CarHome from '../Screens/car-section/CarHome';
import BikeDoc from '../Screens/BikeDoc';
import CarDepositeDetail from '../Screens/car-section/car-deposit/CarDepositeDetail';
import CarDetail from '../Screens/car-section/car-rental/CarDetail';
import CarCustomerDetail from '../Screens/car-section/car-rental/CarCustomerDetail';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const loggedIn = useSelector(state => state.counter.loggedIn); // Update the selector path

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {loggedIn ? (
          <>
            <Stack.Screen name="CarDetail" component={CarDetail} />
            <Stack.Screen
              name="CarDepositeDetail"
              component={CarDepositeDetail}
            />
            <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
            <Stack.Screen name="DepositeDetail" component={DepositeDetail} />
            <Stack.Screen name="BikeDoc" component={BikeDoc} />
            <Stack.Screen
              name="CarCustomerDetail"
              component={CarCustomerDetail}
            />

            <Stack.Screen name="Offers" component={Offers} />
            <Stack.Screen name="CustomerDetails" component={CustomerDetails} />
            <Stack.Screen name="CarHome" component={CarHome} />
            <Stack.Screen name="Emergency" component={Emergency} />
            <Stack.Screen name="UserBill" component={UserBill} />
            <Stack.Screen name="Scheduled" component={Scheduled} />
            <Stack.Screen name="Servicing" component={Servicing} />
            <Stack.Screen name="DirectBill" component={DirectBill} />

            <Stack.Screen
              name="AgreementPage"
              component={AgreementPage}
              options={{
                headerShown: true,
                headerTitle: 'Agreement Page',
                headerStyle: {
                  backgroundColor: '#feb101', // Change 'your_color_here' to the desired background color
                },
              }}
            />
            <Stack.Screen
              name="Signature"
              component={Signature}
              options={{
                headerShown: true,
                headerTitle: 'Signature',
                headerStyle: {
                  backgroundColor: '#feb101', // Change 'your_color_here' to the desired background color
                },
              }}
            />
            <Stack.Screen name="VehicleDetails" component={VehicleDetails} />
          </>
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
