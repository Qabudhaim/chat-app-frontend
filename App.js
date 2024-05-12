import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Text, View, Button, SafeAreaView } from 'react-native';
import axios from 'axios';
import SplashScreen from './screens/splashScreen';
import SandBox from './screens/sandbox';
import Rooms from './screens/rooms';
import SignIn from './screens/signin';
import SignUp from './screens/signup';
import Room from './screens/room';
import AddRoom from './screens/addroom';
import global from './global';

const AuthenticationStack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {

  global.app = this;

  [isLoading, setIsLoading] = useState(true);
  [isAuthenticated, setIsAuthenticated] = useState(false);
  [refreshToken, setRefreshToken] = useState('');
  [accessToken, setAccessToken] = useState('');
  [user, setUser] = useState('');
  [error, setError] = useState(null);

  deleteKey = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
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

  const getSession = async () => {
    const access = await getKey('access');
    const refresh = await getKey('refresh');
    const user = await getKey('user');
    if (access && refresh && user) {
      return { 'access': access, 'refresh': refresh, 'user': user }
    } else {
      return { 'access': null, 'refresh': null, 'user': null }
    }
  }


  setTimeout(() => {
    setIsLoading(false);
  }, 2000);

  useEffect(() => {

    getSession().then((data) => {

      data.user = JSON.parse(data.user);
      data.access = JSON.parse(data.access);
      data.refresh = JSON.parse(data.refresh);

      if (data.access && data.refresh && data.user) {

        axios.get('http://192.168.178.56:8000/whoami/', {
          headers: {
            'Authorization': 'Bearer ' + data.access
          }
        })
          .then(function (response) {
            if (response.data.user.username === data.user.username) {
              setAccessToken(data.access);
              setRefreshToken(data.refresh);
              setUser(data.user);
              setIsAuthenticated(true);
            } else {
              deleteKey('access');
              deleteKey('refresh');
              deleteKey('user');
              setIsAuthenticated(false);
            }
          })
      }
    });

  }, []);

  const getScreenOptions = (navigation) => ({
    headerTintColor: '#e53935',
    title: <Text onPress={() => { navigation.navigate('Rooms') }} className='text-2xl text-red-600'>Obscurus</Text>,
  });

  if (isLoading && !isAuthenticated) {
    return <SplashScreen />
  }
  else {

    if (isAuthenticated) {
      return (
        <NavigationContainer>
          <Drawer.Navigator
            screenOptions={({ navigation }) => getScreenOptions(navigation)}

            drawerContent={(props) => {
              return (
                <SafeAreaView className="flex-1">
                  <View>
                    <View className='m-1 p-1'>
                      <Text className='text-2xl font-bold text-red-600'>{user.username}</Text>
                    </View>

                    <View className='m-1 p-2'>
                      <Text onPress={() => { props.navigation.navigate("Rooms") }} className='text-lg text-red-600'>Home</Text>
                    </View>

                    <View className='m-1 p-2'>
                      <Text onPress={() => { props.navigation.navigate("AddRoom") }} className='text-lg text-red-600'>Create Room</Text>
                    </View>

                  </View>
                  <View className="flex-1 justify-end items-center">
                    <Text className='text-red-600 text-lg' onPress={() => {
                      deleteKey('access');
                      deleteKey('refresh');
                      deleteKey('user');
                      setIsAuthenticated(false);
                    }} >Logout</Text>
                  </View>
                </SafeAreaView>
              )
            }
            }
          >
            <Drawer.Screen options={{ 'gestureEnabled': false, 'headerShown': true }} name="Rooms" component={Rooms} />
            <Drawer.Screen options={{ 'gestureEnabled': true, 'headerShown': true }} name="Room" component={Room} />
            <Drawer.Screen options={{ 'gestureEnabled': false, 'headerShown': true }} name="AddRoom" component={AddRoom} />
          </Drawer.Navigator>
        </NavigationContainer>
      );
    } else {

      return (
        <NavigationContainer>
          <AuthenticationStack.Navigator>
            <AuthenticationStack.Screen options={{ 'gestureEnabled': true, 'headerShown': false }} name="SignIn" component={SignIn} />
            <AuthenticationStack.Screen options={{ 'gestureEnabled': true, 'headerShown': false }} name="SignUp" component={SignUp} />
          </AuthenticationStack.Navigator>
        </NavigationContainer>
      );

    }

  }
}