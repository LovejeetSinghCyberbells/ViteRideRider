import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import NotificationCard from '../../components/NotificationCard';

const SAMPLE_NOTIFICATIONS = [
    {
        id: '1',
        type: 'ride',
        title: 'Ride Confirmed',
        message: 'Your ride from Victoria Island to Murtala Airport has been confirmed. Driver is on the way.',
        time: '2m ago',
        isRead: false,
    },
    {
        id: '2',
        type: 'payment',
        title: 'Payment Successful',
        message: '₦4,500 has been deducted for your trip from Ikeja to Lekki Phase 1.',
        time: '1h ago',
        isRead: false,
    },
    {
        id: '3',
        type: 'alert',
        title: 'Ride Cancelled',
        message: 'Your driver cancelled the ride. Please book a new ride. We apologise for the inconvenience.',
        time: '3h ago',
        isRead: true,
    },
    {
        id: '4',
        type: 'promo',
        title: '30% Off This Weekend!',
        message: 'Use code VITE30 to get 30% off your next 3 rides this weekend only. Limited slots available.',
        time: 'Yesterday',
        isRead: false,
    },
    {
        id: '5',
        type: 'system',
        title: 'Profile Updated',
        message: 'Your profile information has been updated successfully.',
        time: '2d ago',
        isRead: true,
    },
];

export default function NotificationScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>

            <View style={styles.screenHeader}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()}>
                    <MaterialDesignIcons name="arrow-back-ios" size={24} color={colors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Notification</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.notifications}>
                    {SAMPLE_NOTIFICATIONS.map(notification => (
                        <NotificationCard key={notification.id} notification={notification} />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.primaryColor,
        paddingTop: 50,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 50,
        backgroundColor: colors.primaryColor,
    },

    screenHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 4,
    },
    screenTitle: {
        fontSize: 18,
        lineHeight: 28,
        fontWeight: '600',
        color: colors.whiteColor,
        flex: 1,
        textAlign: 'center',
    },
    notifications: {
        width: '100%',
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 12,
    },
});