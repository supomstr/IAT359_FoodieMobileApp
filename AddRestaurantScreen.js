import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch, Image, ScrollView, FlatList, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebaseConfig";
import Geocoder from "react-native-geocoding";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';

Geocoder.init("AIzaSyBj-DzHK0Z04dPkkdTfgEqXiS4eJS-cD2o");

const AddRestaurantScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [placeId, setPlaceId] = useState(null);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || libraryStatus !== "granted") {
      alert("Permission to access camera and media library is required!");
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  const handleImagePicker = async (type) => {
    try {
      let result;

      if (type === "camera") {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      } else if (type === "library") {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      }

      if (!result.canceled) {
        const newImageUri = result.assets ? result.assets[0].uri : result.uri;
        setImages((prevImages) => [...prevImages, newImageUri]); 
      }
    } catch (error) {
      console.error("Error opening image picker:", error);
    }
  };

const handleAddRestaurant = async () => {
  if (!name.trim()) {
    Alert.alert("Error", "Restaurant name is required.");
    return;
  }
  if (!location.trim()) {
    Alert.alert("Error", "Restaurant location is required.");
    return;
  }

  try {
    const newRestaurant = {
      name,
      notes,
      images,
      location,
      latitude,
      longitude,
      placeId,
      showReviews,
      createdAt: new Date(),
    };

    //Saving to Firestore
    const docRef = await addDoc(collection(db, "restaurants"), newRestaurant);

    //To Cache locally
    await AsyncStorage.setItem(`restaurant-${docRef.id}`, JSON.stringify(newRestaurant));

    Alert.alert("Success", "Restaurant added successfully!");
    navigation.goBack();
  } catch (error) {
    Alert.alert("Error", "Failed to add restaurant.");
  }
};

  const renderImageItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.image} />
  );

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{"\u2190"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create Restaurant</Text>
      </View>
      <ScrollView style={styles.container}>
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
        <View style={styles.imageContainer}>
          {images.length > 0 ? (
            <FlatList
              data={images}
              horizontal
              renderItem={renderImageItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.imageList}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text>No Images</Text>
            </View>
          )}
          <View style={styles.imageButtons}>
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={() => handleImagePicker("camera")}
            >
              <Text style={styles.addImageText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={() => handleImagePicker("library")}
            >
              <Text style={styles.addImageText}>Library</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.autocompleteContainer}>
          <GooglePlacesAutocomplete
            placeholder="Enter Restaurant Location"
            fetchDetails={true}
            onPress={(data, details = null) => {
              const { lat, lng } = details.geometry.location;
              setLocation(data.description);
              setLatitude(lat);
              setLongitude(lng);
              const placeId = data.place_id;
              setPlaceId(placeId);
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
          />
        </View>

        <View style={styles.toggleContainer}>
          <Text>Show Google Reviews of this restaurant</Text>
          <Switch
            value={showReviews}
            onValueChange={(value) => setShowReviews(value)}
          />
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleAddRestaurant}>
          <Text style={styles.createButtonText}>Create</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: { 
    fontSize: 24, 
    color: "#FF3D00" 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    textAlign: "center", 
    flex: 1 
  },
  container: { 
    flex: 1, 
    paddingHorizontal: 20 
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
  imageContainer: { 
    marginBottom: 15 
  },
  imageList: { 
    marginVertical: 10 
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: "#eee",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  image: { 
    width: 150, 
    height: 150, 
    borderRadius: 8,
    marginHorizontal: 5 
  },
  imageButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addImageButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: "#FF3D00",
    borderRadius: 8,
    alignItems: "center",
  },
  addImageText: { 
    color: "#fff" 
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
  createButton: {
    backgroundColor: "#FF3D00", 
    padding: 15, 
    borderRadius: 8, 
    alignItems: "center" 
  },
  createButtonText: { 
    color: "#fff", 
    fontWeight: "bold" 
  },
});

export default AddRestaurantScreen;
