import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {DOMAIN} from '@env';
import {TouchableOpacity} from 'react-native-gesture-handler';
const CarAvailability = ({navigation}) => {
  const [assignedCar, setAssignedCar] = useState([]);
  const [FilteredassignedCar, setFilteredassignedCar] = useState([]);
  const [availableCar, setAvailableCar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(false);
  const [clickedRentalId, setClickedRentalId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [FuleType, setFuleType] = useState('');

  const handleSearch = query => {
    setSearchQuery(query);

    if (query === '') {
      setFilteredassignedCar(assignedCar);
    } else {
      const filtered = assignedCar.filter(car => {
        const carData = car.Car;
        const userData = car.user;

        return (
          carData.carid.toString().includes(query) ||
          carData.license_plate.toLowerCase().includes(query.toLowerCase()) ||
          (userData &&
            (userData.name.toLowerCase().includes(query.toLowerCase()) ||
              userData.phone.toString().includes(query)))
        );
      });

      setFilteredassignedCar(filtered);
    }
  };

  useEffect(() => {
    // Conditionally show/hide the header based on isSearchActive state
    if (isSearchActive) {
      navigation.setOptions({
        headerShown: false,
      });
    } else {
      navigation.setOptions({
        headerShown: true,
        headerLeft: () =>
          isSearchActive ? (
            // Back icon to close search and restore the header
            <TouchableOpacity onPress={() => setIsSearchActive(false)}>
              <Ionicons
                name="arrow-back-outline"
                size={24}
                style={styles.icon}
              />
            </TouchableOpacity>
          ) : (
            // Default drawer toggle button
            <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <Ionicons name="menu" size={24} style={styles.icon} />
            </TouchableOpacity>
          ),
        headerRight: () =>
          !isSearchActive && (
            // Search button (visible only when search is inactive)
            <TouchableOpacity onPress={() => setIsSearchActive(true)}>
              <Ionicons name="search-outline" size={24} style={styles.icon} />
            </TouchableOpacity>
          ),
      });
    }
  }, [isSearchActive, navigation]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setIsLoading(true);
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [navigation]);

  const fetchData = async () => {
    try {
      const response = await fetch(`https://${DOMAIN}/Car/carInfo/`);

      const response2 = await fetch(`https://${DOMAIN}/Car/carInfo2/`);

      const data = await response.json();
      const data2 = await response2.json();

      // Filter assigned Car and available Car from the data
      const assigned = data2.Carrental.filter(
        rental => rental.return_date === null,
      );
      console.log(data);
      console.log(data2);
      const available = data.car.filter(car => !car.is_assigned);

      setAssignedCar(assigned);
      setFilteredassignedCar(assigned);
      setAvailableCar(available);

      setIsLoading(false);
      setRefreshing(false);
    } catch (error) {
      setIsLoading(false);
      setRefreshing(false);
      console.error('Error fetching data:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text
          style={{
            color: '#000',
            fontWeight: '600',
            marginTop: 20,
            fontSize: 15,
          }}>
          Fetching Data
        </Text>
      </View>
    );
  }
  function convertHoursToDaysHours(totalHours) {
    const days = Math.floor(totalHours / 24); // Calculate full days
    const hours = totalHours % 24; // Calculate remaining hours
  
    // Build the result dynamically based on non-zero values
    const parts = [];
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    
    // Join the parts with a comma, or return "No time" if both are zero
    return parts.length > 0 ? parts.join(', ') : 'No time';
  }

  const formatDate = dateString => {
    // Convert the string to a JavaScript Date object
    const date = new Date(dateString);

    // Extract day, month, and year
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
  };
  return (
    <View style={styles.container}>
      {isSearchActive ? (
        // Search bar at the top of the screen
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={() => setIsSearchActive(false)}>
            <Ionicons name="arrow-back-outline" size={24} style={styles.icon} />
          </TouchableOpacity>

          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearch}
            onSubmitEditing={() => {
              setIsSearchActive(false); // Close the search input
              setFilteredassignedCar(assignedCar); // Reset the filtered list to all Car
              setSearchQuery(''); // Clear the search query
            }}
            returnKeyType="done"
            autoFocus
          />
        </View>
      ) : // Default header area with title and search icon
      null}
      <View style={styles.row}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#feb101',
            marginTop: 20,

            padding: 20,
          }}>
          <Text style={styles.heading1}>Available Car</Text>
          <View>
            <Text style={styles.info}>
              Deisel Car: <Text style={{color: '#000'}}>0</Text>
            </Text>
            <Text style={styles.info}>
              Petrol Car: <Text style={{color: '#000'}}>0</Text>
            </Text>
          </View>
        </View>
        <View
          style={{
            borderLeftWidth: 1,
            borderLeftColor: 'black',

            marginVertical: 15,

            paddingHorizontal: 20,
          }}
        />

        <View
          style={{
            flex: 1,

            backgroundColor: '#feb101',

            marginTop: 40,
            marginRight: 20,
            padding: 0,
          }}>
          <Text style={styles.heading2}>Assigned Car</Text>

          <Text style={styles.info}>
            Deisel Car: <Text style={{color: '#000'}}>0</Text>{' '}
          </Text>
          <Text style={styles.info}>
            Petrol Car: <Text style={{color: '#000'}}>0</Text>
          </Text>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.rentalDetailsContainer}>
          <View style={{alignItems: 'center', marginTop: 5, marginBottom: 30}}>
            <Text style={{fontWeight: 'bold', fontSize: 18, color: '#000'}}>
              Rental car's Details
            </Text>
          </View>
          {FilteredassignedCar.map(rental => (
            <View key={rental.id} style={styles.rentalItem}>
              {/* <Text style={styles.rentalText}>{rental.id}</Text> */}

              <Text style={styles.rentalText}>
                Name: <Text style={{color: 'green'}}> {rental.user.name}</Text>
              </Text>
              <Text style={styles.rentalText}>
                UID: <Text style={{color: 'green'}}> {rental.user.uid} </Text>
              </Text>
              <Text style={styles.rentalText}>
                Email:
                <Text style={{color: 'green'}}> {rental.user.email} </Text>
              </Text>
              <Text style={styles.rentalText}>
                Number:
                <Text style={{color: 'green'}}> {rental.user.phone} </Text>
              </Text>
              <Text style={styles.rentalText}>
                Return Time:
                <Text style={{color: 'green'}}> {convertHoursToDaysHours(rental.TimeThought)} </Text>
              </Text>
              <Text style={styles.rentalText}>
                License Plate:{' '}
                <Text style={{color: 'green'}}>{rental.Car.license_plate}</Text>
              </Text>
              <Text style={styles.rentalText}>
                Date:
                <Text style={{color: 'green'}}>
                  {' '}
                  {formatDate(rental.rental_date)}{' '}
                </Text>
              </Text>

              <Text style={styles.carItem}>Car: {rental.Car.carid}</Text>

              <View style={{width: '100%'}}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('CarDepositeDetail', {
                      bid: rental.Car.carid,
                    })
                  }
                  style={[
                    styles.startButton,
                    {
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      fontWeight: 'bold',
                      backgroundColor: 'green',
                    },
                  ]}>
                  <Text style={{...styles.buttonText}}>Deposite</Text>
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: 'black',
                }}></Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#feb101',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 3,
    borderRadius: 25,
    backgroundColor: '#fff',
    elevation: 1,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  searchInput: {
    flex: 1,

    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#000',
    marginLeft: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  // column: {
  //   flex: 1,
  //   backgroundColor: '#feb101',
  //   borderBottomLeftRadius: 20,
  //   borderBottomLeftRadius: 20,
  //   padding: 16,
  // },
  heading1: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 'bold',

    color: 'green',
    backgroundColor: '#fff',
    marginTop: -10,
    marginBottom: 20,
    padding: 8,
    borderRadius: 9,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 6,
  },
  heading2: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 'bold',

    marginTop: -10,
    marginBottom: 20,
    color: 'red',
    backgroundColor: '#fff',
    borderRadius: 9,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 6,
  },
  carItem: {
    backgroundColor: '#feb101',
    padding: 8,
    color: '#000',
    width: '40%',
    fontWeight: 'bold',

    borderRadius: 4,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  info: {
    marginBottom: 5,
    color: '#000',
    fontWeight: 'bold',
  },
  rentalDetailsContainer: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 16,
    backgroundColor: '#FFF', // Light yellow color
    // backgroundColor: '#feb101', // Light yellow color
    // Light yellow color
    padding: 20,
  },
  rentalItem: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 35,
  },
  rentalText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading2: {
    flex: 1,
    paddingHorizontal: 33,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  startButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  stopButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  icon: {
    color: '#000',
    marginHorizontal: 15,
  },
});

export default CarAvailability;
