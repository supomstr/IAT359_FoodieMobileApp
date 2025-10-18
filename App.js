import 'react-native-get-random-values';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen, SignUpScreen } from './LoginScreen';
import HomeScreen from './HomeScreen';
import AddRestaurantScreen from './AddRestaurantScreen';
import RestaurantListScreen from './RestaurantListScreen';
import EditRestaurantScreen from './EditRestaurantScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddRestaurant" component={AddRestaurantScreen} />
        <Stack.Screen name="RestaurantList" component={RestaurantListScreen} />
        <Stack.Screen name="EditRestaurant" component={EditRestaurantScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
