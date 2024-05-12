import { Text, View, ActivityIndicator } from 'react-native';

export default function SplashScreen() {

    return (
        <View className="flex-1 items-center justify-center bg-zinc-100">
            <Text className="font-bold text-red-600 text-4xl">Obscurus</Text>
            <Text className="text-red-600">© 2024 Obscurus</Text>
            <ActivityIndicator className="p-2 m-4" size="large" color="#e53935" />
        </View>
    )
};


