import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import PaymentHistoryCard from '../../components/PaymentHistoryCard';

const SAMPLE_PAYMENTS = [
    {
        id: '1',
        pickup: 'Sector 17, Chandigarh',
        dropoff: 'Mohali Airport',
        date: '10 Jun 2025',
        time: '09:45 AM',
        amount: '185',
        status: 'completed',
        paymentMethod: 'card',
        paymentMethodLabel: 'Visa •• 4242',
        transactionId: 'TXN8842901',
    },
    {
        id: '2',
        pickup: 'Phase 7, Mohali',
        dropoff: 'Elante Mall, Chandigarh',
        date: '09 Jun 2025',
        time: '06:20 PM',
        amount: '240',
        status: 'completed',
        paymentMethod: 'upi',
        paymentMethodLabel: 'Google Pay',
        transactionId: 'TXN8842902',
    },
    {
        id: '3',
        pickup: 'Kharar Bus Stand',
        dropoff: 'ISBT Sector 43',
        date: '08 Jun 2025',
        time: '11:10 AM',
        amount: '120',
        status: 'failed',
        paymentMethod: 'card',
        paymentMethodLabel: 'Mastercard •• 8891',
        transactionId: 'TXN8842903',
    },
    {
        id: '4',
        pickup: 'Zirakpur',
        dropoff: 'Chandigarh Railway Station',
        date: '07 Jun 2025',
        time: '03:15 PM',
        amount: '95',
        status: 'refunded',
        paymentMethod: 'wallet',
        paymentMethodLabel: 'App Wallet',
        transactionId: 'TXN8842904',
    },
    {
        id: '5',
        pickup: 'Sector 22, Chandigarh',
        dropoff: 'PGI Chandigarh',
        date: '06 Jun 2025',
        time: '08:30 AM',
        amount: '140',
        status: 'pending',
        paymentMethod: 'cash',
        paymentMethodLabel: 'Cash Payment',
        transactionId: 'TXN8842905',
    },
    {
        id: '6',
        pickup: 'Sunny Enclave',
        dropoff: 'VR Punjab Mall',
        date: '05 Jun 2025',
        time: '07:10 PM',
        amount: '210',
        status: 'completed',
        paymentMethod: 'upi',
        paymentMethodLabel: 'PhonePe',
        transactionId: 'TXN8842906',
    },
    {
        id: '7',
        pickup: 'Sector 70, Mohali',
        dropoff: 'Fortis Hospital',
        date: '04 Jun 2025',
        time: '10:00 AM',
        amount: '160',
        status: 'completed',
        paymentMethod: 'card',
        paymentMethodLabel: 'Visa •• 7361',
        transactionId: 'TXN8842907',
    },
    {
        id: '8',
        pickup: 'Sector 35, Chandigarh',
        dropoff: 'Rock Garden',
        date: '03 Jun 2025',
        time: '04:45 PM',
        amount: '110',
        status: 'completed',
        paymentMethod: 'cash',
        paymentMethodLabel: 'Cash Payment',
        transactionId: 'TXN8842908',
    },
    {
        id: '9',
        pickup: 'Airport Road',
        dropoff: 'Sector 67, Mohali',
        date: '02 Jun 2025',
        time: '09:20 PM',
        amount: '275',
        status: 'pending',
        paymentMethod: 'wallet',
        paymentMethodLabel: 'App Wallet',
        transactionId: 'TXN8842909',
    },
    {
        id: '10',
        pickup: 'Sector 15, Chandigarh',
        dropoff: 'Panjab University',
        date: '01 Jun 2025',
        time: '08:00 AM',
        amount: '85',
        status: 'completed',
        paymentMethod: 'upi',
        paymentMethodLabel: 'Paytm',
        transactionId: 'TXN8842910',
    },
    {
        id: '11',
        pickup: 'Derabassi',
        dropoff: 'Zirakpur Bus Stand',
        date: '31 May 2025',
        time: '01:30 PM',
        amount: '130',
        status: 'refunded',
        paymentMethod: 'card',
        paymentMethodLabel: 'Mastercard •• 5521',
        transactionId: 'TXN8842911',
    },
    {
        id: '12',
        pickup: 'Sector 44, Chandigarh',
        dropoff: 'Industrial Area Phase 1',
        date: '30 May 2025',
        time: '05:15 PM',
        amount: '105',
        status: 'completed',
        paymentMethod: 'wallet',
        paymentMethodLabel: 'App Wallet',
        transactionId: 'TXN8842912',
    },
    {
        id: '13',
        pickup: 'Kharar',
        dropoff: 'Chandigarh IT Park',
        date: '29 May 2025',
        time: '09:50 AM',
        amount: '320',
        status: 'failed',
        paymentMethod: 'upi',
        paymentMethodLabel: 'Google Pay',
        transactionId: 'TXN8842913',
    },
    {
        id: '14',
        pickup: 'Sector 34, Chandigarh',
        dropoff: 'Mohali Phase 11',
        date: '28 May 2025',
        time: '07:40 PM',
        amount: '145',
        status: 'completed',
        paymentMethod: 'card',
        paymentMethodLabel: 'Visa •• 9123',
        transactionId: 'TXN8842914',
    },
    {
        id: '15',
        pickup: 'Sector 8, Chandigarh',
        dropoff: 'Sukhna Lake',
        date: '27 May 2025',
        time: '06:55 AM',
        amount: '90',
        status: 'completed',
        paymentMethod: 'cash',
        paymentMethodLabel: 'Cash Payment',
        transactionId: 'TXN8842915',
    },
];

export default function PaymentHistoryScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>

            <View style={styles.screenHeader}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()}>
                    <MaterialDesignIcons name="arrow-back-ios" size={24} color={colors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Payment History</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.payments}>
                    {SAMPLE_PAYMENTS.map(payment => (
                        <PaymentHistoryCard
                            key={payment.id}
                            item={payment}
                        />
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
    payments: {
        width: '100%',
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 12,
    },
})