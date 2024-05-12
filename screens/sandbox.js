import { Text, View, ActivityIndicator, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import global from '../global';

export default function SandBox({ navigation }) {

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



    return (
        <View className="flex-1 items-center justify-center bg-zinc-100">
            <Text className='font-bold'>Hi {global.app.user}</Text>
            <Button title="Logout" onPress={handleLogout} />
        </View>
    )
};


