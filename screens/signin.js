import { Text, View, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import global from '../global';
import Footer from '../components/footer';

export default function SignIn({ navigation }) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleUsername = (text) => {
        setUsername(text);
    }

    const handlePassword = (text) => {
        setPassword(text);
    }

    const storeKey = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value))

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

    const handleSignIn = () => {

        if (username === '' || password === '') {
            return;
        }

        setIsLoading(true);
        setIsInvalid(false);

        axios.post('http://192.168.178.56:8000/login/', {
            username: username,
            password: password
        })
            .then(function (response) {

                if (response.data.error) {
                    if (response.data.error === 'Invalid credentials') {
                        setIsInvalid(true);
                        setIsLoading(false);
                        setErrorMessage('Invalid credentials');
                    }
                    return;
                }

                storeKey('access', response.data.access);
                storeKey('refresh', response.data.refresh);
                storeKey('user', response.data.user);
                setIsLoading(false);
                global.app.setUser(response.data.user);
                global.app.setIsAuthenticated(true);
                global.app.setAccessToken(response.data.access);
                global.app.setRefreshToken(response.data.refresh);
            })
            .catch(function (error) {
                setIsLoading(false);
                setErrorMessage('Server Error, please try again later');
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

                <View className="flex m-5 p-3 w-64 rounded-lg shadow-lg bg-zinc-100">

                    <View className='p-3'>
                        <Text className="font-bold text-lg text-red-600">Username</Text>
                        <TextInput onChangeText={handleUsername} textContentType='oneTimeCode' onSubmitEditing={handleSignIn} className="border-b p-1 border-red-600 text-lg" />
                    </View>

                    <View className='p-3'>
                        <Text className="font-bold text-lg text-red-600">Password</Text>
                        <TextInput secureTextEntry={true} textContentType='oneTimeCode' onChangeText={handlePassword} onSubmitEditing={handleSignIn} className="border-b p-1 border-red-600 text-lg" />
                    </View>

                    {isInvalid && <Text className="text-red-600 font-bold text-center p-2 m-4">{errorMessage}</Text>}
                    {isLoading && <ActivityIndicator className="p-2 m-4" size="large" color="#e53935" />}

                </View>
                <View className='p-3 m-3'>
                    <Text className="text-zinc-100" onPress={() => navigation.navigate('SignUp')}>Dont' have an account? Register Now!</Text>
                </View>

                <Footer />

            </KeyboardAvoidingView>

        </TouchableWithoutFeedback>
    )
};


