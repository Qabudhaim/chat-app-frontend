import { Text, View, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import global from '../global';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';


export default function Rooms({ navigation }) {

  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState([]);

  handleTitlePress = () => {
    navigation.navigate('Rooms');
  }

  handleChangeRoom = (room) => {
    navigation.navigate('Room', { room: room });
    setRooms([]);
    setIsLoading(true);
  }


  const handleLogout = () => {
    removeKey('access');
    removeKey('refresh');
    removeKey('username');
    global.app.setIsAuthenticated(false);
  }

  removeKey = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.log(e);
    }
  }

  useFocusEffect(
    React.useCallback(() => {

      navigation.setOptions({
        title: <Text className='text-2xl text-red-600'>Chats</Text>,

        headerRight: () => (
          <TouchableWithoutFeedback onPress={() => { navigation.navigate('AddRoom') }}>
            <View className='p-2'>
              <AntDesign name="plus" size={24} color="#e53935" />
            </View>
          </TouchableWithoutFeedback>
        ),
      });

      axios.get(global.publicUrl + ':8000/api/list-rooms-and-messages/', {
        headers: {
          'Authorization': 'Bearer ' + global.app.accessToken
        }
      }).then(function (response) {
        setRooms(response.data.rooms);
        setIsLoading(false);
      }).catch(function (error) {
        console.log(error);

      });

    }, [])
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-100">
        <ActivityIndicator size="large" color="#e53935" />
      </View>
    )
  } else {


    if (rooms.length === 0) {
      return (
        <TouchableWithoutFeedback onPress={() => { navigation.navigate('AddRoom') }}>
          <View className="flex-1 items-center justify-center bg-zinc-100">
            <Text className='font-bold text-red-600 p-2'>No rooms found</Text>
            <AntDesign name="pluscircle" size={24} color="#e53935" />
          </View>
        </TouchableWithoutFeedback>
      )
    } else {
      return (
        <View className='flex-1'>

          <FlatList
            data={rooms}
            renderItem={({ item }) => (

              <TouchableWithoutFeedback onPress={() => { handleChangeRoom(item) }}>
                <View className='p-3 mb-1 bg-zinc-50 '>

                  <Text className='text-xl text-red-600 p-2'>{item.users[0].username === user.username ? item.users[1].username : item.users[0].username}</Text>
                  <Text className='font-light text-xs text-red-600 p-2'>{item.last_message}</Text>
                </View>
              </TouchableWithoutFeedback>
            )}
            keyExtractor={item => item.id}
          ></FlatList>
        </View>
      )
    }
  }


};


