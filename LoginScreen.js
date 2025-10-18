import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebaseConfig';
import logo from './assets/foodielogo.png';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert("Success", "User logged in!");
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.title}>Foodie</Text>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
  
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert("Success", "Account created!");
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };
  

  return (
    <SafeAreaView style={styles.signUpContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>{"\u2190"}</Text>
      </TouchableOpacity>
      <Text style={styles.signupTitle}>Sign up</Text>
      <View style={styles.formContainer}>
        <Text style={styles.signUpLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="grey"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.signUpLabel}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="grey"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Text style={styles.signUpLabel}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="grey"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
          <Text style={styles.createAccountText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FF6633', 
    justifyContent: 'center',
  },
  signUpContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0F0F0', 
    justifyContent: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 20,
    width: 125,
    height: 125,
  },
  title: {
    fontSize: 64,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  signupTitle: {
    fontSize: 32,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    color: 'white',
    marginTop: 15,
  },
  signUpLabel: {
    color: 'black',
    marginTop: 15,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 5,
    height: 40,
  },
  loginButton: {
    backgroundColor: '#FF3D00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 80,
  },
  loginText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  createAccountText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  signUpText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 15,
    fontWeight: 'bold',
  },
  backButton: {
    fontSize: 32,
    color: 'black',
    marginBottom: 20,
  },
  signupButton: {
    backgroundColor: '#FF3D00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
});

export { LoginScreen, SignUpScreen };
