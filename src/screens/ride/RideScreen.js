import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import CommonButton from '../../components/CommonButton';
const { width, height } = Dimensions.get('window');


export default function RideScreen({ navigation }) {

    const [isMapClicked, setIsMapClicked] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('PaymentScreen');
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <ImageBackground
                    source={require('../../assets/images/ride_bg.png')}
                    style={[styles.container, { justifyContent: isMapClicked ? 'flex-end' : 'space-between' }]}
                    resizeMode="cover"
                    onTouchStart={() => { if (!isMapClicked) setIsMapClicked(true) }}
                >

                    {isMapClicked && (
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setIsMapClicked(false)} style={styles.closeButton}>
                            <MaterialDesignIcons name="close" size={24} color={colors.blackColor} />
                        </TouchableOpacity>
                    )}

                    {!isMapClicked && (
                        <View style={styles.topSection}>
                            <View style={styles.carCard}>
                                <Image source={require('../../assets/images/car.png')} style={styles.carImage} />
                                <View style={styles.carDetails}>
                                    <Text style={styles.cardTitle}>Car Details</Text>
                                    <Text style={styles.cardSubText}>Lexus LS</Text>
                                    <Text style={styles.cardSubText}>TN 01 AN 2435</Text>
                                </View>
                            </View>

                            <View style={styles.arrivalCard}>
                                <Text style={styles.arrivalText}>Your Driver is Arriving In 3 Minutes from Now</Text>
                            </View>
                        </View>
                    )}

                    <View style={styles.bottomSection}>
                        {isMapClicked ? (
                            <View style={[styles.driverCard, styles.driverCardMapActive]}>
                                <View style={styles.dragHandle} />

                                <View style={styles.arrivalRow}>
                                    <View>
                                        <Text style={styles.arrivalMinutes}>12 min</Text>
                                        <Text style={styles.arrivalTime}>Arriving at 10:53 AM</Text>
                                    </View>
                                    <View style={styles.shareButton}>
                                        <MaterialDesignIcons name='ios-share' size={32} color={colors.blackColor} />
                                    </View>
                                </View>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => navigation.navigate('DriverDetailsScreen')}
                                    style={styles.driverRow}
                                >
                                    <Image source={require('../../assets/images/profile.png')} style={styles.driverThumb} resizeMode='cover' />
                                    <View>
                                        <View style={styles.driverNameRow}>
                                            <Text style={styles.driverName}>Jenny Nolan</Text>
                                            <Text style={styles.driverRating}>⭐️ 4.89</Text>
                                        </View>
                                        <Text style={styles.driverVehicle}>Toyota Camry • ABC 123</Text>
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.routeCard}>
                                    <View style={styles.routeRow}>
                                        <View style={styles.routeDotGreen} />
                                        <View style={styles.routeTextBlock}>
                                            <Text style={styles.routeLabel}>Pickup</Text>
                                            <Text numberOfLines={1} ellipsizeMode='clip' style={styles.routeAddress}>
                                                Independence Avenue, Central Business District
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.routeRow}>
                                        <View style={styles.routeDotSecondary} />
                                        <View style={styles.routeTextBlock}>
                                            <Text style={styles.routeLabel}>Drop-off</Text>
                                            <Text numberOfLines={1} ellipsizeMode='clip' style={styles.routeAddress}>
                                                Sam Nujoma Dr, Klein Windhoek, Namibia
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.actionRow}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={styles.actionTile}>
                                        <MaterialDesignIcons name='message' size={24} color={colors.secondaryColor} />
                                        <Text style={styles.actionLabel}>Message</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={styles.actionTile}>
                                        <MaterialDesignIcons name='call' size={24} color={colors.secondaryColor} />
                                        <Text style={styles.actionLabel}>Call</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={styles.actionTile}>
                                        <MaterialDesignIcons name='privacy-tip' size={24} color={colors.secondaryColor} />
                                        <Text style={styles.actionLabel}>Safety</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.driverCard}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.driverHeader}
                                    onPress={() => navigation.navigate('DriverDetailsScreen')}>
                                    <View style={styles.profileImageWrapper}>
                                        <Image source={require('../../assets/images/profile.png')} style={styles.profileImage} resizeMode='cover' />
                                    </View>
                                    <View style={styles.driverInfo}>
                                        <Text style={styles.cardTitle}>Driver Details</Text>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.cardSubText}>Name :</Text>
                                            <Text style={styles.cardSubText}>Jenny</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.cardSubText}>Age :</Text>
                                            <Text style={styles.cardSubText}>28</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.cardSubText}>Mobile :</Text>
                                            <Text style={styles.cardSubText}>1234567890</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                <View style={styles.divider} />

                                <Text style={styles.cardTitle}>Ride Details</Text>
                                <View style={styles.rideDetailsRow}>
                                    <View style={styles.rideDetailsLeft}>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.cardSubText}>Total No. of Rides :</Text>
                                            <Text style={styles.cardSubText}>334</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.cardSubText}>⭐️ ⭐️ ⭐️ ⭐️ ⭐️</Text>
                                            <Text style={styles.cardSubText}>( 310+ Ratings)</Text>
                                        </View>
                                        <Text style={styles.cardSubText}>
                                            Text the Driver <Text style={styles.underlineText}>here</Text>
                                        </Text>
                                    </View>
                                    <View style={styles.actionButtons}>
                                        <View style={styles.callButton}>
                                            <MaterialDesignIcons name='call' size={35} color={colors.secondaryColor} />
                                        </View>
                                        <MaterialDesignIcons name='message' size={35} color={colors.whiteColor} />
                                    </View>
                                </View>
                            </View>
                        )}

                        <CommonButton title={"Cancle Ride"} textColor={colors.whiteColor} color={colors.redColor} onPress={() => navigation.goBack()} />
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
        backgroundColor: colors.primaryColor,
    },
    container: {
        flex: 1,
        marginTop: 60,
        backgroundColor: colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },

    closeButton: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: 20,
        start: 20,
        width: 40,
        height: 40,
        backgroundColor: colors.whiteColor,
        borderRadius: 100,
    },

    topSection: {
        width: '100%',
    },
    carCard: {
        padding: 16,
        backgroundColor: colors.appSettingCardWhiteOpacity,
        borderRadius: 32,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
    },
    carImage: {
        width: '55%',
        height: 120,
    },
    carDetails: {
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        width: '50%',
        height: 80,
    },
    arrivalCard: {
        padding: 16,
        backgroundColor: colors.appSettingCardWhiteOpacity,
        borderRadius: 32,
        marginTop: 40,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrivalText: {
        fontSize: 14,
        fontWeight: '400',
        color: colors.whiteColor,
    },

    bottomSection: {
        width: '100%',
        gap: 20,
    },
    driverCard: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        backgroundColor: colors.appSettingCardWhiteOpacity,
        marginTop: 16,
        borderRadius: 32,
        width: '100%',
    },
    driverCardMapActive: {
        paddingBottom: 50,
    },

    dragHandle: {
        width: 72,
        height: 5,
        backgroundColor: colors.lightGreyColor,
        borderRadius: 100,
        alignSelf: 'center',
    },

    arrivalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    arrivalMinutes: {
        fontSize: 24,
        fontWeight: '600',
        lineHeight: 32,
        color: colors.whiteColor,
    },
    arrivalTime: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
        color: colors.whiteColor,
    },
    shareButton: {
        width: 50,
        height: 50,
        backgroundColor: colors.whiteColor,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },

    driverRow: {
        marginTop: 20,
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    driverThumb: {
        width: 60,
        height: 60,
        borderRadius: 18,
    },
    driverNameRow: {
        flexDirection: 'row',
        gap: 20,
    },
    driverName: {
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 24,
        color: colors.whiteColor,
    },
    driverRating: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
        color: colors.whiteColor,
    },
    driverVehicle: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
        color: colors.lightGreyColor,
    },

    routeCard: {
        padding: 16,
        backgroundColor: colors.primaryColor,
        borderRadius: 15,
        marginTop: 20,
        gap: 16,
    },
    routeRow: {
        flexDirection: 'row',
        gap: 20,
    },
    routeDotGreen: {
        width: 12,
        height: 12,
        backgroundColor: colors.greenColor,
        borderRadius: 100,
    },
    routeDotSecondary: {
        width: 12,
        height: 12,
        backgroundColor: colors.secondaryColor,
        borderRadius: 100,
    },
    routeTextBlock: {
        flex: 1,
    },
    routeLabel: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        color: colors.lightGreyColor,
    },
    routeAddress: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 24,
        color: colors.whiteColor,
    },

    actionRow: {
        flexDirection: 'row',
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    actionTile: {
        width: 90,
        height: 90,
        borderWidth: 1,
        borderColor: colors.whiteColor,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    actionLabel: {
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 20,
        color: colors.whiteColor,
    },

    driverHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    profileImageWrapper: {
        marginTop: -40,
        backgroundColor: colors.primaryColor,
        width: 138,
        height: 138,
        borderWidth: 1,
        borderRadius: 32,
        borderColor: colors.whiteColor,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImage: {
        width: 126,
        height: 126,
        borderRadius: 30,
    },
    driverInfo: {
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        width: '50%',
        height: 80,
    },
    divider: {
        marginVertical: 20,
        height: 1,
        width: '100%',
        backgroundColor: colors.lightGreyColor,
    },
    rideDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rideDetailsLeft: {
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
    },
    actionButtons: {
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
    },
    callButton: {
        width: 50,
        height: 50,
        backgroundColor: colors.whiteColor,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },

    cardTitle: {
        fontSize: 16,
        fontWeight: '400',
        color: colors.whiteColor,
    },
    cardSubText: {
        fontSize: 14,
        fontWeight: '400',
        color: colors.lightGreyColor,
    },
    underlineText: {
        fontSize: 14,
        fontWeight: '400',
        color: colors.lightGreyColor,
        textDecorationLine: 'underline',
    },
    infoRow: {
        flexDirection: 'row',
        gap: 8,
    },
});