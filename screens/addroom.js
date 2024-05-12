import { useEffect, useState } from 'react';
import { Text, View, TextInput, FlatList, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import axios from 'axios';
import global from '../global';


export default function AddRoom({ navigation }) {

    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState('');

    handleQuery = (text) => {
        setQuery(text);
    }

    createRoom = (user_id) => {

        url = 'http://192.168.178.56:8000/api/create-room/'
        headers = {
            'Authorization': 'Bearer ' + global.app.accessToken,
            'Content-Type': 'application/json'
        }
        data = {
            'users': [user_id],
        }

        axios.post(url, data, { headers: headers })
            .then(function (response) {
                navigation.navigate('Room', { room: response.data.room });
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    useEffect(() => {

        url = 'http://192.168.178.56:8000/api/filter-users/'
        headers = {
            'Authorization': 'Bearer ' + global.app.accessToken,
            'Content-Type': 'application/json'
        }

        data = {
            'query': query
        }

        axios.post(url, data, { headers: headers })
            .then(function (response) {
                // remove the current user from the list
                response.data.users = response.data.users.filter(user => user.id !== global.app.user.id);
                setUsers(response.data.users);
            })
            .catch(function (error) {
                console.log(error);
            });

    }, [query]);

    return (
        <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
        }}>
            <KeyboardAvoidingView boardAvoidingView behavior="padding" className="flex-1 items-center justify-center bg-zinc-100">
                <View className='p-3 m-3 w-96'>
                    <TextInput onChangeText={handleQuery} placeholder='Email or Phone' className="border rounded-md p-3 border-red-600 text-sm" />
                </View>
                <FlatList
                    data={users}
                    renderItem={({ item }) => (
                        <TouchableWithoutFeedback onPress={() => this.createRoom(item.id)}>
                            <View className='p-3 m-2 w-80 bg-zinc-50 rounded-lg shadow-sm'>
                                <Text className="text-red-600">{item.username}</Text>
                                <Text className="text-red-600 font-thin">{item.phone_number}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    )}
                    keyExtractor={item => item.id.toString()}
                >

                </FlatList>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    )
};


