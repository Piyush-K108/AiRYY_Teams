import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {DOMAIN} from '@env';

const CarAvailability = ({navigation}) => {
  const [assignedCar, setAssignedCar] = useState([]);
  const [FilteredassignedCar, setFilteredassignedCar] = useState([]);
  const [availableCar, setAvailableCar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    navigation.setOptions({
      headerShown: !isSearchActive,
      title: isSearchActive ? 'Search Cars' : 'Car Availability',

      headerTitleStyle: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 18,
        
      },
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerLeft: () =>
        isSearchActive ? (
          <TouchableOpacity onPress={() => setIsSearchActive(false)}>
            <Ionicons name="arrow-back-outline" size={24} style={styles.icon} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Ionicons
              name="menu"
              size={24}
              style={[styles.icon, {marginRight: 20, color: '#facc15'}]}
            />
          </TouchableOpacity>
        ),
      headerRight: () =>
        !isSearchActive && (
          <TouchableOpacity onPress={() => setIsSearchActive(true)}>
            <Ionicons name="search-outline" size={24} style={styles.icon} />
          </TouchableOpacity>
        ),
    });
  }, [isSearchActive, navigation]);

  const fetchData = async () => {
    try {
      const response = await fetch(`https://${DOMAIN}/Car/carInfo/`);
      const response2 = await fetch(`https://${DOMAIN}/Car/carInfo2/`);
      const data = await response.json();
      const data2 = await response2.json();
      const assigned = data2.Carrental.filter(
        rental => rental.return_date === null,
      );
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = query => {
    setSearchQuery(query);
    if (!query) {
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setIsLoading(true);
    fetchData();
  }, []);

  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  };

  const convertHoursToDaysHours = totalHours => {
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const parts = [];
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    return parts.length > 0 ? parts.join(', ') : 'No time';
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Fetching Data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isSearchActive && (
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={() => setIsSearchActive(false)}>
            <Ionicons name="arrow-back-outline" size={24} style={styles.icon} />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      )}

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.contentContainer}>
        <View style={styles.summary}>
          <View style={[styles.summaryCard, styles.availableCard]}>
            <View
              style={{
                backgroundColor: '#f0fdf4',
                paddingHorizontal: 8,
                paddingVertical: 8,
                borderRadius: 12,
                position: 'absolute',
                top: 0,
                left: 0,
                alignItems: 'center',
              }}>
              <Text style={styles.summaryText}>Available Cars.</Text>
            </View>

            <View
              style={{
                flexDirection: 'Column',
                justifyContent: 'space-evenly',
                marginTop: 20,
              }}>
              <View style={{flexDirection: 'row', marginBottom: 8}}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 15,
                    fontWeight: '700',
                    marginRight: 10,
                  }}>
                  Diesel :
                </Text>
                <Text
                  style={{
                    color: '#166534',
                    fontSize: 15,
                    fontWeight: '700',
                    marginRight: 10,
                  }}></Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 15,
                    fontWeight: '700',
                    marginRight: 10,
                  }}>
                  Patrol :
                </Text>
                <Text
                  style={{
                    color: '#166534',
                    fontSize: 15,
                    fontWeight: '700',
                    marginRight: 10,
                  }}></Text>
              </View>
            </View>
          </View>
          <View style={[styles.summaryCard, styles.assignedCard]}>
            <View
              style={{
                backgroundColor: '#fef2f2',
                paddingHorizontal: 8,
                paddingVertical: 8,
                borderRadius: 12,
                position: 'absolute',
                top: 0,
                left: 0,
                alignItems: 'center',
              }}>
              <Text style={styles.summaryText}>Assigned Cars.</Text>
            </View>

            <View
              style={{
                flexDirection: 'Column',
                justifyContent: 'space-evenly',
                marginTop: 20,
              }}>
              <View style={{flexDirection: 'row', marginBottom: 8}}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 15,
                    fontWeight: '700',
                    marginRight: 10,
                  }}>
                  Diesel :
                </Text>
                <Text
                  style={{
                    color: '#991b1b',
                    fontSize: 15,
                    fontWeight: '700',
                    marginRight: 10,
                  }}></Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: 15,
                    fontWeight: '700',
                    marginRight: 10,
                  }}>
                  Patrol :
                </Text>
                <Text
                  style={{
                    color: '#991b1b',
                    fontSize: 15,
                    fontWeight: '700',
                    marginRight: 10,
                  }}></Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{margin: 10}}>
          <Text style={styles.sectionTitle}>Assigned Cars</Text>
          {FilteredassignedCar.map(rental => (
            <View key={rental.id} style={styles.card}>
              <View
                style={{
                  marginTop: 30,
                  backgroundColor: '#fefce8',
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                  borderRadius: 30,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons
                    name="person-circle-outline"
                    size={18}
                    style={{color: '#000', marginRight: 5}}
                  />
                  <Text style={[styles.cardText, {marginTop: 5}]}>
                    {rental.user.name}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons
                    name="call-outline"
                    size={18}
                    style={{color: '#000', marginRight: 5}}
                  />
                  <Text style={[styles.cardText, {marginTop: 5}]}>
                    {rental.user.phone}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons
                    name="mail-open-outline"
                    size={18}
                    style={{color: '#000', marginRight: 5}}
                  />
                  <Text style={[styles.cardText, {marginTop: 5}]}>
                    {rental.user.email || 'None'}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <FontAwesome
                    name="drivers-license-o"
                    size={18}
                    style={{color: '#000', marginRight: 5}}
                  />
                  <Text
                    style={[
                      styles.cardText,
                      {fontStyle: 'italic', textDecorationLine: 'underline'},
                    ]}>
                    License Plate: {rental.Car.license_plate}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <FontAwesome
                    name="clock-o"
                    size={18}
                    style={{color: '#000', marginRight: 5}}
                  />
                  <Text
                    style={[
                      styles.cardText,
                      {fontStyle: 'italic', textDecorationLine: 'underline'},
                    ]}>
                    Rental Time:{' '}
                    {new Date(rental.rental_date).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  position: 'absolute',
                  top: 12,
                  right: 14,
                }}>
                <Ionicons name="alarm" size={16} style={{color: '#eab308'}} />
                <Text
                  style={{
                    fontSize: 14,
                    color: '#000',
                    marginLeft: 8,
                    fontWeight: '500',
                  }}>
                  {convertHoursToDaysHours(rental.TimeThought)}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  position: 'absolute',
                  top: 12,
                  left: 14,
                }}>
                <Ionicons
                  name="calendar"
                  size={16}
                  style={{color: '#eab308'}}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: '#000',
                    marginLeft: 8,
                    fontWeight: '500',
                  }}>
                  {formatDate(rental.rental_date)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate('CarDepositeDetail', {
                    bid: rental.Car.carid,
                  })
                }>
                <Text style={styles.buttonText}>Go to Deposite</Text>
              </TouchableOpacity>
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
    backgroundColor: '#fafafa',
    marginLeft: 8,
    marginRigth: 8,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    margin: 25,
    borderRadius: 30,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 40,
  },
  summaryCard: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 5,
  },
  availableCard: {
    backgroundColor: '#d4edda',
  },
  assignedCard: {
    backgroundColor: '#f8d7da',
  },
  summaryText: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 0,
    letterSpacing: 1,
  },
  count: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    // elevation: 1,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#000',
    fontWeight: '600',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#000',
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#facc15',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 20,
    color: '#eab308',
  },
});

export default CarAvailability;
