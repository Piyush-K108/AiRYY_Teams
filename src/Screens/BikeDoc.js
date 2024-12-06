import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import axios from 'axios';
import {DOMAIN} from '@env';

const BikeDoc = ({navigation, route}) => {
  const [bikes, setBikes] = useState([]);
  const [bikeDocs, setBikeDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBikes, setFilteredBikes] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [copyIconState, setCopyIconState] = useState({});
  const {car} = route.params;

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

  useEffect(() => {
    fetch(`https://${DOMAIN}/Admin/${car ? 'car' : 'bike'}-data/`)
      .then(response => response.json())
      .then(data => {
        setBikes(data);
        setFilteredBikes(data);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        console.error('Error fetching bike data:', error);
      });

    fetch(`https://${DOMAIN}/Admin/${car ? 'car' : 'bike'}-doc/`)
      .then(response => response.json())
      .then(data => {
        setBikeDocs(data);
      })
      .catch(error => {
        setIsLoading(false);
        console.error('Error fetching bike documents:', error);
      });
  }, []);

  const handleSearch = query => {
    let filtered;
    setSearchQuery(query);
    if (query === '') {
      setFilteredBikes(bikes);
    } else {
      if (car) {
        filtered = bikes.filter(
          bike =>
            bike.carid.toString().includes(query) ||
            bike.license_plate.toLowerCase().includes(query.toLowerCase()),
        );
      } else {
        filtered = bikes.filter(
          bike =>
            bike.b_id.toString().includes(query) ||
            bike.license_plate.toLowerCase().includes(query.toLowerCase()),
        );
      }

      setFilteredBikes(filtered);
    }
  };

  const handleCopyUrls = async bikeId => {
    setCopyIconState(prevState => ({
      ...prevState,
      [bikeId]: true,
    }));

    setTimeout(() => {
      setCopyIconState(prevState => ({
        ...prevState,
        [bikeId]: false,
      }));
    }, 5000);

    setIsSearchActive(false);
    setFilteredBikes(bikes);
    setSearchQuery('');
    var bikeDoc;
    if (car) {
      
      bikeDoc = bikeDocs.find(
        doc => doc.Car.toString() === bikeId.toString(),
      );
    } else {
      bikeDoc = bikeDocs.find(doc => doc.bike.toString() === bikeId.toString());
    }

    if (!bikeDoc) {
      Alert.alert('Error', 'No documents found for this bike.');
      return;
    }

    const urls = [bikeDoc.Bill, bikeDoc.RC_card, bikeDoc.Insurance].filter(
      url => url,
    );
    console.log(urls,bikeDoc)

    try {
      const shortenedUrls = await Promise.all(
        urls.map(async url => {
          const response = await axios.get(
            `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`,
          );
          return response.data;
        }),
      );

      const shortenedUrlsString = shortenedUrls.join('\n\n');
      Clipboard.setString(shortenedUrlsString);
      Alert.alert('Success', 'Shortened URLs copied to clipboard!');
    } catch (error) {
      console.error('Error shortening URLs:', error);
      Alert.alert('Error', 'Failed to shorten URLs.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Fetching Data</Text>
      </View>
    );
  }

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
            autoFocus
          />
        </View>
      ) : // Default header area with title and search icon
      null}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredBikes.map(bike => (
          <View key={bike.b_id} style={styles.card}>
            <View style={styles.infoContainer}>
              {car ? (
                <Text style={styles.title}>Car ID: {bike.b_id}</Text>
              ) : (
                <Text style={styles.title}>Bike ID: {bike.carid}</Text>
              )}

              <Text style={styles.text}>
                License Plate: {bike.license_plate}
              </Text>
              <Text style={styles.text}>KM Now: {bike.KM_Now}</Text>
            </View>
            {/* <View
              style={[
                styles.indicator,
                bike.is_assigned ? styles.redIndicator : styles.greenIndicator,
              ]}
            /> */}
            <View style={styles.copyContainer}>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => {
                  if (car) {
                    handleCopyUrls(bike.carid);
                  } else {
                    handleCopyUrls(bike.b_id);
                  }
                }}>
                <Text style={styles.copyText}>Copy Documents</Text>

                {copyIconState[car ? bike.carid : bike.b_id] ? (
                  <Ionicons
                    name="checkmark-done-outline"
                    size={16}
                    color="#007bff"
                    style={styles.icon2}
                  />
                ) : (
                  <Ionicons
                    name="copy-outline"
                    size={16}
                    color="#007bff"
                    style={styles.icon2}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfafa',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#000',
    fontWeight: '600',
    marginTop: 20,
    fontSize: 15,
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  icon: {
    color: '#000',
    marginHorizontal: 15,
  },
  scrollContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 15,
    width: '90%',
    borderWidth: 1,
    borderColor: '#e0f2fe',

    // elevation: 1,
  },
  infoContainer: {
    flex: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  text: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
  indicator: {
    height: 12,
    width: 12,
    borderRadius: 6,
    marginHorizontal: 10,
  },
  greenIndicator: {
    backgroundColor: '#34c759',
  },
  redIndicator: {
    backgroundColor: '#ff3b30',
  },
  copyContainer: {
    flex: 2,
    alignItems: 'flex-end',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  copyText: {
    color: '#007bff',
    fontWeight: '600',
    marginRight: 5,
    fontSize: 13,
  },
  icon2: {
    alignSelf: 'center',
  },
});

export default BikeDoc;
