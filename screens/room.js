import { useState, useEffect } from 'react';
import { ActivityIndicator, Button, SafeAreaView, StyleSheet, Text, View, KeyboardAvoidingView, Keyboard, } from 'react-native';
import React from 'react';
import axios from 'axios';
import global from '../global';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import WS from 'react-native-websocket';

export default function Room({ navigation, route }) {

    // const ws = new WebSocket('ws://192.168.178.56:8000/ws/chat/' + route.params.room.hash_number + '/?token=' + global.app.accessToken);

    const ws_url = global.publicWs + ':8000/ws/chat/' + route.params.room.hash_number + '/?token=' + global.app.accessToken;

    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [room, setRoom] = useState([]);
    const [message, setMessage] = useState('');
    const [maxId, setMaxId] = useState(0);
    const [update, setUpdate] = useState('');

    handleTitlePress = () => {
        setMessages([]);
        setIsLoading(true);
        navigation.navigate('Rooms');
    }



    handleSendMessage = () => {

        this.messageInput.clear();

        this.ws.send(JSON.stringify({
            'username': global.app.user.username,
            'user_id': global.app.user.id,
            'room_hash': room.hash_number,
            'message': this.messageInput.value
        }));


        url = global.publicUrl + ':8000/api/send-message/'
        headers
            = {
            'Authorization': 'Bearer ' + global.app.accessToken,
            'Content-Type': 'application/json'
        }

        data = {
            'room_hash': room.hash_number,
            'message': message
        }

        axios.post(url, data, { headers: headers })
            .then(function (response) {
                // setUpdate(true);
                setUpdate(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    handleText = (text) => {
        setMessage(text);
    }


    handleStrollToEnd = () => {
        this.flatList.scrollToEnd();
    }

    useEffect(() => {

        navigation.setOptions({
            title: <Text onPress={handleTitlePress} className='text-2xl text-red-600'>{route.params.room.users[0].username === user.username ? route.params.room.users[1].username : route.params.room.users[0].username}</Text>,
        });

        setRoom(route.params.room);

        url = global.publicUrl + ':8000/api/messages/'
        headers = {
            'Authorization': 'Bearer ' + global.app.accessToken,
            'Content-Type': 'application/json'
        }

        data = {
            'room_hash': route.params.room.hash_number
        }

        axios.post(url, data, { headers: headers })
            .then(function (response) {
                setMessages(response.data.messages);
                setIsLoading(false);
                // setUpdate(false);

            })
            .catch(function (error) {
                console.log(error);
            });

    }, [route.params, update]);


    if (isLoading) {
        return (
            <View>
                <ActivityIndicator size="large" color="#e53935" />
            </View>
        )
    }

    return (

        <KeyboardAvoidingView boardAvoidingView behavior="padding" keyboardVerticalOffset={70} className="flex-1" >
            <WS
                ref={ref => { this.ws = ref }}
                url={ws_url}
                onOpen={() => {
                    console.log('opened');
                }}
                onMessage={(msg) => {
                    route.params.room.users.forEach(user => {
                        if (user.id !== global.app.user.id) {
                            setUpdate(msg.data);
                        }
                    });


                }}
                onError={(err) => {
                    console.log(err);
                }}
                onClose={() => {
                    console.log('closed');
                }}
            />

            <FlatList
                ref={ref => this.flatList = ref}
                data={messages}
                renderItem={({ item }) => (
                    <View>

                        {item.user === global.app.user.id ?
                            <View className='flex-row justify-end'>
                                <View className='bg-zinc-50 rounded-lg p-2 m-2'>
                                    <Text className='text-black'>{item.message}</Text>
                                </View>
                            </View>
                            :
                            <View className='flex-row justify-start'>
                                <View className='bg-red-600 rounded-lg p-2 m-2'>
                                    <Text className='text-zinc-50'>{item.message}</Text>
                                </View>
                            </View>
                        }
                    </View>
                )}
                keyExtractor={item => item.id}
                onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
                onLayout={() => this.flatList.scrollToEnd({ animated: true })}
            >

            </FlatList>

            <View className='bg-zinc-50 w-full h-24'>
                <View className='flex-row items-start justify-end'>
                    <TextInput onSubmitEditing={handleSendMessage} ref={input => { this.messageInput = input }} onFocus={handleStrollToEnd} onChangeText={handleText} placeholder='Message' className='bg-zinc-100 rounded-lg p-5 m-2 w-72' />
                    <Button title='Send' color='#e53935' onPress={handleSendMessage} />
                </View>
            </View>
        </KeyboardAvoidingView>

    )
}

