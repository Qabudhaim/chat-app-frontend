import { Text, View, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import global from '../global';
import Footer from '../components/footer';

export default function SignUp({ navigation }) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleUsername = (text) => {
        setUsername(text);
    }

    const handlePassword = (text) => {
        setPassword(text);
    }

    const handleFirstName = (text) => {
        setFirstName(text);
    }

    const handleLastName = (text) => {
        setLastName(text);
    }

    const handleEmail = (text) => {
        setEmail(text);
    }

    const handlePhoneNumber = (text) => {
        setPhoneNumber(text);
    }

    const storeKey = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value)
        } catch (e) {
            console.log(e);
        }
    }

    const getKey = async (key) => {
        try {
            const value = await AsyncStorage.getItem(key)
            if (value !== null) {
                return value;
            }
        } catch (e) {
            console.log(e);
        }
    }

    const handleSignUp = () => {

        if (username === '' || password === '') {
            setErrorMessage('Username and password are required');
            setIsInvalid(true);
            return;
        }

        // check first name and last name
        if (firstName === '' || lastName === '') {
            setErrorMessage('First name and last name are required');
            setIsInvalid(true);
            return;
        }

        // Check if email is valid
        if ((!email.includes('@') || !email.includes('.') || email.length < 5)) {
            setErrorMessage('Invalid email');
            setIsInvalid(true);
            return;
        }

        // check if phone number is valid and contains only numbers and + sign
        if (!phoneNumber.match(/^[0-9+]+$/ || phoneNumber.length < 5)) {
            setErrorMessage('Invalid phone number');
            setIsInvalid(true);
            return;
        }


        setIsLoading(true);
        setIsInvalid(false);

        axios.post('http://192.168.178.56:8000/register/', {
            username: username,
            password: password,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone_number: phoneNumber
        })
            .then(function (response) {

                if (response.data.error) {
                    setIsInvalid(true);
                    setIsLoading(false);
                    setErrorMessage('Server error, please try again later');
                    return;
                }

                setIsLoading(false);
                navigation.navigate('SignIn');
            })
            .catch(function (error) {
                console.log(error);
                setIsLoading(false);
            });

    }


    return (
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
        }}>

            <KeyboardAvoidingView boardAvoidingView behavior="padding" className="flex-1 items-center justify-center bg-red-600">

                <View className="flex items-center">
                    <Text className="font-bold text-zinc-100 text-4xl">Obscurus</Text>
                </View>

                <View className="flex m-5 p-5 w-80 rounded-lg shadow-lg  bg-zinc-100">


                    <View className='p-1 ml-2'>
                        <Text className="font-bold text-sm text-red-600">Username</Text>
                        <TextInput onChangeText={handleUsername} textContentType='oneTimeCode' onSubmitEditing={handleSignUp} className="border-b p-1 border-red-600 text-sm" />
                    </View>

                    <View className='p-1 ml-2'>
                        <Text className="font-bold text-sm text-red-600">Password</Text>
                        <TextInput secureTextEntry={true} textContentType='oneTimeCode' onChangeText={handlePassword} onSubmitEditing={handleSignUp} className="border-b p-1 border-red-600 text-sm" />
                    </View>

                    <View className='p-1 ml-2'>
                        <Text className="font-bold text-sm text-red-600">First Name</Text>
                        <TextInput onChangeText={handleFirstName} textContentType='oneTimeCode' onSubmitEditing={handleSignUp} className="border-b p-1 border-red-600 text-sm" />
                    </View>

                    <View className='p-1 ml-2'>
                        <Text className="font-bold text-sm text-red-600">Last Name</Text>
                        <TextInput onChangeText={handleLastName} textContentType='oneTimeCode' onSubmitEditing={handleSignUp} className="border-b p-1 border-red-600 text-sm" />
                    </View>

                    <View className='p-1 ml-2'>
                        <Text className="font-bold text-sm text-red-600">Email</Text>
                        <TextInput onChangeText={handleEmail} textContentType='oneTimeCode' onSubmitEditing={handleSignUp} className="border-b p-1 border-red-600 text-sm" />
                    </View>

                    <View className='p-1 ml-2 mb-3'>
                        <Text className="font-bold text-sm text-red-600">Phone Number</Text>
                        <TextInput onChangeText={handlePhoneNumber} textContentType='oneTimeCode' onSubmitEditing={handleSignUp} className="border-b p-1 border-red-600 text-sm" />
                    </View>

                    {isInvalid && <Text className="text-red-600 font-bold text-center p-2 m-4">{errorMessage}</Text>}
                    {isLoading && <ActivityIndicator className="p-2 m-4" size="large" color="#e53935" />}

                </View>
                <View className='p-3 m-3'>
                    <Text className="text-zinc-100" onPress={() => navigation.navigate('SignIn')}>Already have an acount! Sign in</Text>
                </View>

                <Footer />

            </KeyboardAvoidingView>

        </TouchableWithoutFeedback >
    )
};


