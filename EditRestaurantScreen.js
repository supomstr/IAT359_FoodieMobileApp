import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch, Alert, ScrollView, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditRestaurantScreen = ({ route, navigation }) => {
  const { restaurant } = route.params;

  const [name, setName] = useState(restaurant.name);
  const [notes, setNotes] = useState(restaurant.notes);
  const [location, setLocation] = useState(restaurant.location);
  const [latitude, setLatitude] = useState(restaurant.latitude);
  const [longitude, setLongitude] = useState(restaurant.longitude);
  const [showReviews, setShowReviews] = useState(restaurant.showReviews);

  const handleUpdateRestaurant = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Restaurant name is required.");
      return;
    }
    if (!location.trim()) {
      Alert.alert("Error", "Restaurant location is required.");
      return;
    }

    try {
      const updatedRestaurant = {
        name,
        notes,
        location,
        latitude,
        longitude,
        showReviews,
      };

      //To update the Firestore
      const restaurantRef = doc(db, "restaurants", restaurant.id);
      await updateDoc(restaurantRef, updatedRestaurant);

      //To save the 'showReviews' preference to AsyncStorage
      await AsyncStorage.setItem(`restaurant-showReviews-${restaurant.id}`, JSON.stringify(showReviews));

      Alert.alert("Success", "Restaurant details updated!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to update restaurant details.");
    }
  };

  const handleToggleShowReviews = async (value) => {
    setShowReviews(value);
    try {
      //To save the preference to AsyncStorage immediately after toggle
      await AsyncStorage.setItem(`restaurant-showReviews-${restaurant.id}`, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving showReviews preference to AsyncStorage", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>{"\u2190"}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Restaurant</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Restaurant Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Type notes here"
          value={notes}
          onChangeText={setNotes}
          multiline
        />
        <View style={styles.autocompleteContainer}>
          <GooglePlacesAutocomplete
            placeholder="Enter Restaurant Location"
            fetchDetails={true}
            onPress={(data, details = null) => {
              const { lat, lng } = details.geometry.location;
              setLocation(data.description);
              setLatitude(lat);
              setLongitude(lng);
            }}
            query={{
              key: "AIzaSyBj-DzHK0Z04dPkkdTfgEqXiS4eJS-cD2o",
              language: "en",
            }}
            styles={{
              textInput: styles.input,
              listView: styles.listView,
              row: styles.autocompleteRow,
            }}
            defaultValue={location}
          />
        </View>

        <View style={styles.toggleContainer}>
          <Text>Show Google Reviews</Text>
          <Switch
            value={showReviews}
            onValueChange={handleToggleShowReviews}
          />
        </View>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateRestaurant}
        >
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: { 
    flex: 1,
    backgroundColor: "#fff" 
  },
  container: { 
    flex: 1, 
    padding: 20 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: { 
    fontSize: 24, 
    color: "#FF3D00", 
    marginRight: 10 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold" 
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  notesInput: { 
    height: 100, 
    textAlignVertical: "top" 
  },
  autocompleteContainer: { 
    marginBottom: 20 
  },
  listView: { 
    zIndex: 1000 
  },
  autocompleteRow: {
    backgroundColor: "#fff",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  updateButton: {
    backgroundColor: "#FF3D00",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  updateButtonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
});

export default EditRestaurantScreen;
