import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, ImageBackground, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import CommonButton from '../../components/CommonButton';

const RIDE_OPTIONS = [
    {
        id: 'economy',
        label: 'Economy',
        icon: 'directions-car',
        eta: '3 min',
        price: '$12-15',
    },
    {
        id: 'premium',
        label: 'Premium',
        icon: 'directions-car',
        eta: '5 min',
        price: '$18-22',
    },
    {
        id: 'pool',
        label: 'Pool',
        icon: 'directions-car',
        eta: '7 min',
        price: '$8-10',
    },
];

function RideOptionList() {
    const [selected, setSelected] = useState('');

    return (
        <FlatList
            data={RIDE_OPTIONS}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
                <TouchableOpacity
                    onPress={() => setSelected(item.id)}
                    style={[styles.card, selected === item.id && styles.cardSelected]}
                    activeOpacity={0.8}
                >
                    <View style={styles.left}>
                        <View style={styles.iconWrapper}>
                            <MaterialDesignIcons
                                name={item.icon}
                                size={28}
                                color={colors.secondaryColor}
                            />
                        </View>
                        <View style={styles.labelGroup}>
                            <Text style={styles.rideType}>{item.label}</Text>
                            <View style={styles.etaRow}>
                                <MaterialDesignIcons name="schedule" size={13} color={colors.lightGreyColor} />
                                <Text style={styles.etaText}>{item.eta}</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.price}>{item.price}</Text>
                </TouchableOpacity>
            )}
        />
    );
}

export default function HomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea} edges={'bottom'}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <ImageBackground
                    source={require('../../assets/images/ride_bg.png')}
                    style={styles.container}
                    resizeMode="cover"
                >
                    <View style={styles.topSection}>
                        <View style={styles.locationTopBar}>
                            <View style={styles.locationContainer}>
                                <MaterialDesignIcons name='location-on' size={50} color={colors.secondaryColor} />
                                <View style={styles.locationTextColumn}>
                                    <Text style={styles.labelText}>Current Location</Text>
                                    <Text style={styles.labelHighlight}>Mandume Ndemufayo Ave, Windhoek</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => { navigation.navigate('ProfileScreen') }} activeOpacity={0.8} >
                                <Image
                                    source={require('../../assets/images/profile.png')}
                                    style={styles.profileImage}
                                    resizeMode='cover'
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.routeCard}>
                            <View style={styles.routeIconColumn}>
                                <View style={styles.routeIconCircle}>
                                    <MaterialDesignIcons name='near-me' size={35} color={colors.secondaryColor} />
                                </View>
                                <View style={styles.dotLine} />
                                <View style={[styles.dotLine, styles.dotLineMiddle]} />
                                <View style={styles.dotLine} />
                                <View style={styles.routeIconCircle}>
                                    <MaterialDesignIcons name='location-on' size={35} color={colors.secondaryColor} />
                                </View>
                            </View>

                            <View style={styles.routeInputColumn}>
                                <View style={styles.routeInputBox}>
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        style={styles.routeInputText}
                                    >
                                        Independence Avenue, Central Business District
                                    </Text>
                                </View>
                                <View style={styles.routeInputBox}>
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        style={styles.routeInputText}
                                    >
                                        Sam Nujoma Dr, Klein Windhoek, Namibia
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.bottomSheet}>
                        <Text style={styles.chooseRideTitle}>Choose your ride</Text>
                        <RideOptionList />
                        <View style={styles.divider} />
                        <View style={styles.quickActionsRow}>
                            <View style={styles.quickActionItem}>
                                <View style={styles.routeIconCircle}>
                                    <MaterialDesignIcons name='location-on' size={35} color={colors.primaryColor} />
                                </View>
                                <Text style={styles.quickActionLabel}>Places</Text>
                            </View>
                            <View style={styles.quickActionItem}>
                                <View style={styles.routeIconCircle}>
                                    <MaterialDesignIcons name='gpp-good' size={35} color={colors.primaryColor} />
                                </View>
                                <Text style={styles.quickActionLabel}>Safety</Text>
                            </View>
                        </View>
                        <CommonButton onPress={() => { navigation.navigate('RideScreen') }} color={colors.secondaryColor} style={styles.confirmButton} title={"Confirm Pickup"} textColor={colors.whiteColor} />
                    </View>
                </ImageBackground>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.primaryColor,
    },
    scrollContent: {
        flexGrow: 1,
        paddingTop: 60,
    },
    container: {
        flex: 1,
        backgroundColor: colors.primaryColor,
        justifyContent: 'space-between',
    },
    topSection: {
        paddingHorizontal: 16,
    },
    locationTopBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    locationContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 10,
        alignItems: 'center',
    },
    locationTextColumn: {
        justifyContent: 'flex-start',
    },
    labelText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.secondaryColor,
    },
    labelHighlight: {
        fontSize: 12,
        color: colors.whiteColor,
        fontWeight: '400',
    },
    profileImage: {
        height: 50,
        width: 50,
        borderRadius: 100,
    },
    routeCard: {
        backgroundColor: colors.cardWhiteOpacity,
        padding: 24,
        borderWidth: 1,
        borderColor: colors.borderColor,
        borderRadius: 38,
        marginTop: 20,
        flexDirection: 'row',
    },
    routeIconColumn: {
        alignItems: 'center',
        width: 55,
    },
    routeIconCircle: {
        width: 50,
        height: 50,
        borderRadius: 100,
        backgroundColor: colors.whiteColor,
        borderWidth: 1,
        borderColor: colors.borderColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dotLine: {
        height: 5,
        width: 1,
        backgroundColor: colors.whiteColor,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dotLineMiddle: {
        marginVertical: 5,
    },
    routeInputColumn: {
        flex: 1,
        gap: 25,
        marginStart: 20,
    },
    routeInputBox: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        backgroundColor: colors.cardWhiteOpacity,
        padding: 16,
        borderRadius: 15,
    },
    routeInputText: {
        fontSize: 14,
        fontWeight: '400',
        color: colors.whiteColor,
    },
    bottomSheet: {
        padding: 24,
        paddingBottom: 40,
        backgroundColor: colors.cardWhiteOpacity,
        width: '100%',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderTopWidth: 1,
        borderWidth: 1,
        borderColor: colors.borderColor,
    },
    chooseRideTitle: {
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 28,
        color: colors.whiteColor,
        marginBottom: 16,
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: colors.whiteColor,
        marginTop: 30,
    },
    quickActionsRow: {
        flexDirection: 'row',
        gap: 20,
        marginTop: 20,
    },
    quickActionItem: {
        alignContent: 'center',
        justifyContent: 'center',
        width: 50,
    },
    quickActionLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.whiteColor,
        textAlign: 'center',
    },
    confirmButton: {
        marginTop: 20,
    },
    listContainer: {
        gap: 12,
        alignItems: 'center',
    },
    card: {
        width: '95%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.whiteColor,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: 'transparent',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    cardSelected: {
        borderColor: colors.secondaryColor,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    labelGroup: {
        gap: 4,
    },
    rideType: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.blackColor,
    },
    etaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    etaText: {
        fontSize: 13,
        fontWeight: '400',
        color: colors.lightGreyColor,
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.blackColor,
    },
});