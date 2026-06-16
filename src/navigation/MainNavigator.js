import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import RideHistoryScreen from '../screens/ride_history/RideHistoryScreen';
import RideScreen from '../screens/ride/RideScreen';
import DriverDetailsScreen from '../screens/ride/DriverDetailsScreen';
import PaymentScreen from '../screens/payment/PaymentScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import NotificationScreen from '../screens/profile/NotificationScreen';
import PersonalInfoScreen from '../screens/profile/PersonalInfoScreen';
import SecurityPrivacyScreen from '../screens/profile/SecurityPrivacyScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import PrivacyPolicyScreen from '../screens/profile/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/profile/TermsOfServiceScreen';
import AboutAppScreen from '../screens/profile/AboutAppScreen';
import PaymentHistoryScreen from '../screens/profile/PaymentHistoryScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="HomeScreen">
            <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="RideHistoryScreen"
                component={RideHistoryScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="RideScreen"
                component={RideScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="DriverDetailsScreen"
                component={DriverDetailsScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="PaymentScreen"
                component={PaymentScreen}
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="EditProfileScreen"
                component={EditProfileScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="NotificationScreen"
                component={NotificationScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="PersonalInfoScreen"
                component={PersonalInfoScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="SecurityPrivacyScreen"
                component={SecurityPrivacyScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="ChangePasswordScreen"
                component={ChangePasswordScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="PrivacyPolicyScreen"
                component={PrivacyPolicyScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="TermsOfServiceScreen"
                component={TermsOfServiceScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="AboutAppScreen"
                component={AboutAppScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="PaymentHistoryScreen"
                component={PaymentHistoryScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};

export default MainNavigator;