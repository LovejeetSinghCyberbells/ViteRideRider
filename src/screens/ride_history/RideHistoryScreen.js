import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';

const TABS = ['All', 'This Month', 'Last Month', 'Custom'];

function FilterTabs({ onTabChange }) {
    const [activeTab, setActiveTab] = useState('All');

    const handlePress = (tab) => {
        setActiveTab(tab);
        onTabChange?.(tab);
    };

    return (
        <View style={styles.wrapper}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                {TABS.map((tab) => {
                    const isActive = tab === activeTab;
                    return (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, isActive && styles.tabActive]}
                            onPress={() => handlePress(tab)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.label, isActive && styles.labelActive]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const RideCard = ({ dateTime, amount, from, to, driverName, rating, rideType }) => {
    return (
        <View style={styles.tripCard}>

            <View style={styles.cardHeader}>
                <Text style={styles.dateTimeText}>{dateTime}</Text>
                <View style={styles.amountRow}>
                    <Text style={styles.amountText}>{amount}</Text>
                    <MaterialDesignIcons name="chevron-right" size={20} color={colors.whiteColor} />
                </View>
            </View>

            <View style={styles.locationsColumn}>

                <View style={styles.locationRow}>
                    <View style={styles.dotLineWrapper}>
                        <View style={[styles.dot, styles.dotYellow]} />
                        <View style={styles.verticalLine} />
                    </View>
                    <View style={styles.locationTextColumn}>
                        <Text style={styles.locationName}>{from}</Text>
                        <Text style={styles.locationLabel}>Pickup location</Text>
                    </View>
                </View>

                <View style={styles.locationRow}>
                    <View style={styles.dotLineWrapper}>
                        <View style={[styles.dot, styles.dotYellow]} />
                    </View>
                    <View style={styles.locationTextColumn}>
                        <Text style={styles.locationName}>{to}</Text>
                        <Text style={styles.locationLabel}>Drop-off location</Text>
                    </View>
                </View>

            </View>

            <View style={styles.divider} />

            <View style={styles.cardFooter}>
                <View style={styles.driverInfo}>
                    <Text style={styles.driverName}>{driverName}</Text>
                    <View style={styles.ratingRow}>
                        <MaterialDesignIcons name="star" size={16} color="#F5A623" />
                        <Text style={styles.ratingText}>{rating}</Text>
                    </View>
                </View>
                <View style={styles.rideTypeInfo}>
                    <MaterialDesignIcons name="directions-car" size={22} color="#F5A623" />
                    <Text style={styles.rideTypeText}>{rideType}</Text>
                </View>
            </View>

        </View>
    );
};

const SAMPLE_RIDES = [
    {
        id: '1',
        dateTime: 'Feb 10, 2024 • 2:30 PM',
        amount: '$ 24.50',
        from: 'Khomasdal, Windhoek',
        to: 'Ocean View, Swakopmund',
        driverName: 'Michael Chen',
        rating: '4.8',
        rideType: 'Standard',
    },
    {
        id: '2',
        dateTime: 'Feb 10, 2024 • 2:30 PM',
        amount: '$ 24.50',
        from: 'Ocean View, Swakopmund',
        to: 'Kuisebmond, Walvis Bay',
        driverName: 'Michael Chen',
        rating: '4.8',
        rideType: 'Standard',
    },
    {
        id: '3',
        dateTime: 'Feb 10, 2024 • 2:30 PM',
        amount: '$ 24.50',
        from: 'Kuisebmond, Walvis Bay',
        to: '5th Road, Walvis Bay',
        driverName: 'Michael Chen',
        rating: '4.8',
        rideType: 'Standard',
    },
    {
        id: '4',
        dateTime: 'Feb 10, 2024 • 2:30 PM',
        amount: '$ 24.50',
        from: 'Kuisebmond, Walvis Bay',
        to: '5th Road, Walvis Bay',
        driverName: 'Michael Chen',
        rating: '4.8',
        rideType: 'Standard',
    },
];

export default function RideHistoryScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>

            <View style={styles.screenHeader}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.goBack()}>
                    <MaterialDesignIcons name="arrow-back-ios" size={24} color={colors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Ride History</Text>
                <View style={{ width: 24 }} />
            </View>

            <FilterTabs onTabChange={(tab) => console.log('Selected:', tab)} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.cardsList}>
                    {SAMPLE_RIDES.map((ride) => (
                        <RideCard key={ride.id} {...ride} />
                    ))}
                </View>
            </ScrollView>

        </SafeAreaView>
    );
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

    wrapper: {
        paddingBottom: 16,
        paddingStart: 20,
        marginTop: 20,
        backgroundColor: 'transparent',
        alignSelf: 'stretch',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    tab: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 50,
        backgroundColor: colors.appSettingCardWhiteOpacity,
    },
    tabActive: {
        backgroundColor: colors.secondaryColor,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.lightGreyColor,
    },
    labelActive: {
        color: colors.whiteColor,
        fontWeight: '700',
    },

    cardsList: {
        paddingHorizontal: 20,
        marginTop: 24,
        gap: 16,
    },

    tripCard: {
        backgroundColor: colors.cardWhiteOpacity,
        padding: 20,
        borderRadius: 16,
    },

    // Card Header
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
    },
    dateTimeText: {
        fontSize: 14,
        fontWeight: '400',
        color: colors.lightGreyColor,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    amountText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.whiteColor,
    },

    locationsColumn: {
        marginTop: 20,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    dotLineWrapper: {
        width: 20,
        alignItems: 'center',
        marginRight: 14,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginTop: 4,
    },
    dotYellow: {
        backgroundColor: colors.secondaryColor,
    },
    verticalLine: {
        width: 2,
        height: 36,
        backgroundColor: colors.secondaryColor,
        opacity: 0.4,
        marginTop: 2,
    },
    locationTextColumn: {
        flex: 1,
        paddingBottom: 10,
    },
    locationName: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.whiteColor,
        lineHeight: 22,
    },
    locationLabel: {
        fontSize: 12,
        fontWeight: '400',
        color: colors.lightGreyColor,
        lineHeight: 18,
    },

    divider: {
        height: 1,
        width: '100%',
        backgroundColor: colors.lightGreyColor,
        marginTop: 16,
        marginBottom: 16,
    },

    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    driverInfo: {
        flexDirection: 'column',
        gap: 4,
    },
    driverName: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.whiteColor,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 13,
        fontWeight: '400',
        color: colors.whiteColor,
    },
    rideTypeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    rideTypeText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.secondaryColor,
    },
});