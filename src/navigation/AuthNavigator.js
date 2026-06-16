import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import SplashScreen from '../screens/splash/SplashScreen';
import OnboardingSecondScreen from '../screens/onboarding/OnboardingSecondScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="SplashScreen">
            <Stack.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="OnboardingScreen"
                component={OnboardingScreen}
                options={{
                    headerShown: false,
                    animationDuration: 150,
                }}
            />
            <Stack.Screen
                name="OnboardingSecondScreen"
                component={OnboardingSecondScreen}
                options={{
                    headerShown: false,
                    animationDuration: 150,
                }}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                    headerShown: false,
                    animationDuration: 150,
                }}
            />
            <Stack.Screen
                name="SignUpScreen"
                component={SignUpScreen}
                options={{
                    headerShown: false,
                    animationDuration: 150,
                }}
            />
        </Stack.Navigator>
    );
};

export default AuthNavigator;