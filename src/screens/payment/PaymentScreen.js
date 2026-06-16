import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import CommonButton from '../../components/CommonButton';

const { width } = Dimensions.get('window');


const TABS = ['No Tip', '5%', '10%', '15%', '20%', '25%', '30%', '35%', '40%'];

const FARE_ROWS = [
    { label: 'Base Fare', value: '$ 5.00' },
    { label: 'Distance (4.5 miles)', value: '$ 11.25' },
    { label: 'Time (25 mins)', value: '$ 6.25' },
    { label: 'Service Fee', value: '$ 2.50' },
];

const PAYMENT_METHODS = [
    { id: 'card', icon: 'credit-card', primary: '•••• 4242', secondary: 'Visa' },
    { id: 'apple', icon: 'apple', primary: 'Apple Pay' },
    { id: 'paypal', icon: 'paypal', primary: 'PayPal' },
    { id: 'cash', icon: 'money', primary: 'Cash' },
];

const TOGGLES = [
    { id: 'business', icon: 'business', label: 'Business Trip', active: false },
    { id: 'receipt', icon: 'receipt-long', label: 'Request Receipt', active: true },
];


function TipTabs({ onTabChange }) {
    const [activeTab, setActiveTab] = useState('20%');

    const handlePress = (tab) => {
        setActiveTab(tab);
        onTabChange?.(tab);
    };

    return (
        <View style={styles.tipWrapper}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tipContainer}
            >
                {TABS.map((tab) => {
                    const isActive = tab === activeTab;
                    return (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tipTab, isActive && styles.tipTabActive]}
                            onPress={() => handlePress(tab)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.tipLabel, isActive && styles.tipLabelActive]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

function FareRow({ label, value }) {
    return (
        <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>{label}</Text>
            <Text style={styles.fareValue}>{value}</Text>
        </View>
    );
}

function PaymentMethodRow({ item, isActive, onPress }) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.paymentRow, isActive && styles.paymentRowActive]}
        >
            <MaterialDesignIcons
                name={item.icon}
                size={30}
                color={isActive ? colors.secondaryColor : colors.lightGreyColor}
            />

            <View style={styles.paymentTextBlock}>
                <Text style={[styles.paymentPrimary, isActive && styles.paymentPrimaryActive]}>
                    {item.primary}
                </Text>
                {item.secondary ? (
                    <Text style={[styles.paymentSecondary, isActive && styles.paymentSecondaryActive]}>
                        {item.secondary}
                    </Text>
                ) : null}
            </View>

            <View style={[styles.checkBadge, isActive && styles.checkBadgeActive]}>
                {isActive && (
                    <MaterialDesignIcons name="check" size={14} color={colors.whiteColor} />
                )}
            </View>
        </TouchableOpacity>
    );
}

function ToggleRow({ item }) {
    return (
        <View style={styles.toggleRow}>
            <View style={styles.toggleLeft}>
                <MaterialDesignIcons name={item.icon} size={34} color={colors.secondaryColor} />
                <Text style={styles.toggleLabel}>{item.label}</Text>
            </View>
            <View style={[styles.toggleTrack, item.active && styles.toggleTrackActive]} />
        </View>
    );
}


export default function PaymentScreen({ navigation }) {
    const [activeMethodId, setActiveMethodId] = useState('card');

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            {/* Header */}
            <View style={styles.screenHeader}>
                <TouchableOpacity  activeOpacity={0.8} onPress={() => navigation.goBack()}>
                    <MaterialDesignIcons name="arrow-back-ios" size={24} color={colors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Payment</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    <Image
                        source={require('../../assets/images/map.png')}
                        style={styles.mapImage}
                        resizeMode="cover"
                    />
                    <View style={styles.routeRows}>
                        <View style={styles.routeRow}>
                            <View style={[styles.routeDot, styles.routeDotPickup]} />
                            <Text numberOfLines={1} ellipsizeMode="clip" style={styles.routeAddress}>
                                Independence Avenue, Central Business District
                            </Text>
                        </View>
                        <View style={styles.routeRow}>
                            <View style={[styles.routeDot, styles.routeDotDrop]} />
                            <Text numberOfLines={1} ellipsizeMode="clip" style={styles.routeAddress}>
                                Sam Nujoma Dr, Klein Windhoek, Namibia
                            </Text>
                        </View>
                    </View>
                    <View style={styles.routeMeta}>
                        <View style={styles.routeMetaLeft}>
                            <MaterialDesignIcons name="access-time" size={24} color={colors.secondaryColor} />
                            <Text style={styles.routeMetaText}>25 mins</Text>
                        </View>
                        <Text style={styles.routeMetaText}>4.5 miles</Text>
                    </View>
                </View>

                <View style={styles.darkCard}>
                    <Text style={styles.cardTitle}>Fare Breakdown</Text>
                    {FARE_ROWS.map((row) => (
                        <FareRow key={row.label} label={row.label} value={row.value} />
                    ))}
                    <View style={styles.divider} />
                    <View style={styles.fareRow}>
                        <Text style={styles.subtotalLabel}>Subtotal</Text>
                        <Text style={styles.subtotalValue}>$25.00</Text>
                    </View>
                </View>

                <View style={styles.darkCard}>
                    <Text style={styles.cardTitle}>Add Tip</Text>
                    <TipTabs onTabChange={(tab) => console.log('Selected:', tab)} />
                    <View style={styles.fareRow}>
                        <Text style={styles.fareValue}>Tip amount</Text>
                        <Text style={styles.fareValue}>$5.00</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Payment Method</Text>
                    {PAYMENT_METHODS.map((method) => (
                        <PaymentMethodRow
                            key={method.id}
                            item={method}
                            isActive={activeMethodId === method.id}
                            onPress={() => setActiveMethodId(method.id)}
                        />
                    ))}
                </View>

                <View style={styles.darkCard}>
                    {TOGGLES.map((toggle) => (
                        <ToggleRow key={toggle.id} item={toggle} />
                    ))}
                </View>

                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>$29.50</Text>
                </View>

                <CommonButton
                    title="Confirm Payment"
                    textColor={colors.whiteColor}
                    color={colors.secondaryColor}
                    style={styles.confirmButton}
                />
            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    // Layout
    safeArea: {
        flex: 1,
        backgroundColor: colors.primaryColor,
        paddingTop: 50,
    },
    scrollContent: {
        flexGrow: 1,
        backgroundColor: colors.primaryColor,
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 20,
        paddingBottom: 50,
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
    headerSpacer: {
        width: 24,
    },

    card: {
        borderWidth: 1,
        borderColor: colors.lightGreyColor,
        marginTop: 20,
        padding: 16,
        backgroundColor: colors.cardWhiteOpacity,
        width: '100%',
        borderRadius: 15,
        gap: 20,
    },
    darkCard: {
        borderWidth: 1,
        borderColor: colors.lightGreyColor,
        marginTop: 20,
        padding: 16,
        backgroundColor: colors.appSettingCardWhiteOpacity,
        width: '100%',
        borderRadius: 15,
        gap: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 28,
        color: colors.whiteColor,
    },

    mapImage: {
        width: '100%',
        height: 128,
        borderRadius: 15,
    },
    routeRows: {
        gap: 8,
    },
    routeRow: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    routeDot: {
        width: 8,
        height: 8,
        borderRadius: 100,
    },
    routeDotPickup: {
        backgroundColor: colors.blueColor,
    },
    routeDotDrop: {
        backgroundColor: colors.greenColor,
    },
    routeAddress: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 24,
        color: colors.whiteColor,
        width: '90%'
    },
    routeMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    routeMetaLeft: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    routeMetaText: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
        color: colors.secondaryColor,
    },

    fareRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    fareLabel: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
        color: colors.lightGreyColor,
    },
    fareValue: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
        color: colors.whiteColor,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: colors.lightGreyColor,
    },
    subtotalLabel: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
        color: colors.whiteColor,
    },
    subtotalValue: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
        color: colors.whiteColor,
    },

    tipWrapper: {
        backgroundColor: 'transparent',
        alignSelf: 'stretch',
    },
    tipContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    tipTab: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: colors.whiteColor,
    },
    tipTabActive: {
        backgroundColor: colors.secondaryColor,
    },
    tipLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.blackColor,
    },
    tipLabelActive: {
        color: colors.whiteColor,
        fontWeight: '700',
    },

    paymentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 10,
        gap: 16,
        borderWidth: 1.5,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
    },
    paymentRowActive: {
        backgroundColor: colors.whiteColor,
        borderColor: colors.secondaryColor,
    },
    paymentTextBlock: {
        flex: 1,
        gap: 4,
    },
    paymentPrimary: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
        color: colors.lightGreyColor,
    },
    paymentPrimaryActive: {
        color: colors.blackColor,
        fontWeight: '700',
    },
    paymentSecondary: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
        color: colors.lightGreyColor,
    },
    paymentSecondaryActive: {
        color: colors.lightGreyColor,
    },
    checkBadge: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1.5,
        borderColor: colors.lightGreyColor,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    checkBadgeActive: {
        backgroundColor: colors.secondaryColor,
        borderColor: colors.secondaryColor,
    },

    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    toggleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        justifyContent: 'center',
    },
    toggleLabel: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
        color: colors.whiteColor,
    },
    toggleTrack: {
        width: 50,
        height: 30,
        backgroundColor: colors.lightGreyColor,
        borderRadius: 80,
    },
    toggleTrackActive: {
        backgroundColor: colors.secondaryColor,
    },

    totalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '90%',
        marginTop: 40,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 28,
        color: colors.whiteColor,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 28,
        color: colors.whiteColor,
    },
    confirmButton: {
        marginTop: 20,
    },
});