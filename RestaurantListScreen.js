import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Linking } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const RestaurantListScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { restaurant } = route.params;

  const [reviews, setReviews] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  // For Fetching the Google Reviews using Google Places API
  useEffect(() => {
    if (restaurant.showReviews && restaurant.placeId) {
      const fetchReviews = async () => {
        try {
          //Try to load cached reviews
          const cachedReviews = await AsyncStorage.getItem(`reviews-${restaurant.placeId}`);
          if (cachedReviews) {
            setReviews(JSON.parse(cachedReviews)); // Use cached reviews
            return;
          }
  
          //If no cached data, fetch from Google Places API
          const apiKey = "AIzaSyBj-DzHK0Z04dPkkdTfgEqXiS4eJS-cD2o";
          const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${restaurant.placeId}&fields=reviews&key=${apiKey}`;
          const response = await fetch(url);
          const data = await response.json();
  
          if (data.result && data.result.reviews) {
            setReviews(data.result.reviews);
            await AsyncStorage.setItem(`reviews-${restaurant.placeId}`, JSON.stringify(data.result.reviews)); // Cache reviews
          } else {
            Alert.alert("No reviews found for this location.");
          }
        } catch (error) {
          console.error("Error fetching Google reviews:", error);
  
          //Go back to cached data if API call fails
          const cachedReviews = await AsyncStorage.getItem(`reviews-${restaurant.placeId}`);
          if (cachedReviews) {
            setReviews(JSON.parse(cachedReviews));
          }
        }
      };
  
      fetchReviews();
    }
  }, [restaurant.showReviews, restaurant.placeId]);  

  // For Fetching the User's Current Location
  useEffect(() => {
    const fetchUserLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permissions are required.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    fetchUserLocation();
  }, []);

  //For being able to open Google Maps with directions
  const openMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      restaurant.location
    )}`;
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open Google Maps", err)
    );
  };

  const renderImageItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.image} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{"\u2190"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{restaurant.name}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditRestaurant", { restaurant })}
        >
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <Text style={styles.notes}>{restaurant.notes}</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Images</Text>
          {restaurant.images && restaurant.images.length > 0 ? (
            <FlatList
              data={restaurant.images}
              horizontal
              renderItem={renderImageItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.imageList}
            />
          ) : (
            <Text>No images available</Text>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: userLocation?.latitude || restaurant.latitude || 37.7749,
              longitude: userLocation?.longitude || restaurant.longitude || -122.4194,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {userLocation && (
              <Marker
                coordinate={userLocation}
                title="Your Location"
                pinColor="blue"
              />
            )}
            {restaurant.latitude && restaurant.longitude && (
              <Marker
                coordinate={{
                  latitude: restaurant.latitude,
                  longitude: restaurant.longitude,
                }}
                title={restaurant.name}
                description={restaurant.location}
              />
            )}
            {userLocation &&
              restaurant.latitude &&
              restaurant.longitude && (
                <Polyline
                  coordinates={[
                    userLocation,
                    {
                      latitude: restaurant.latitude,
                      longitude: restaurant.longitude,
                    },
                  ]}
                  strokeColor="#FF3D00"
                  strokeWidth={4}
                />
              )}
          </MapView>
          <TouchableOpacity onPress={openMaps}>
            <Text style={styles.directionsLink}>Open in Google Maps</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {restaurant.showReviews ? (
            reviews.length > 0 ? (
              reviews.map((review, index) => (
                <View key={index} style={styles.review}>
                  <Text style={styles.reviewerName}>{review.author_name}</Text>
                  <Text style={styles.reviewText}>{review.text}</Text>
                </View>
              ))
            ) : (
              <Text>Loading reviews</Text>
            )
          ) : (
            <Text>No reviews available</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backButton: { 
    fontSize: 24, 
    color: "#FF3D00" 
  },
  title: { 
    fontSize: 20, 
    fontWeight: "bold", 
    flex: 1, 
    textAlign: "center" 
  },
  editButton: { 
    fontSize: 16, 
    color: "#FF3D00" 
  },
  notes: { 
    fontSize: 16, 
    marginHorizontal: 20, 
    marginVertical: 10 
  },
  section: { 
    marginTop: 20, 
    paddingHorizontal: 20 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  image: { 
    width: 150, 
    height: 150, 
    borderRadius: 8, 
    marginHorizontal: 5 
  },
  map: { 
    width: "100%", 
    height: 300, 
    borderRadius: 8, 
    marginBottom: 10 
  },
  directionsLink: { 
    color: "#1E90FF" 
  },
  review: { 
    marginBottom: 15 
  },
  reviewerName: { 
    fontWeight: "bold", 
    fontSize: 16 
  },
  reviewText: { 
    fontSize: 14, 
    color: "#555" 
  },
  imageList: { 
    marginVertical: 10 
  },
});

export default RestaurantListScreen;
