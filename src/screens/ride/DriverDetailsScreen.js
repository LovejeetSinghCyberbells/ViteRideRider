import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import CommonButton from '../../components/CommonButton';
const { width, height } = Dimensions.get('window');

export default function DriverDetailsScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <View style={styles.screenHeader}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialDesignIcons name="arrow-back-ios" size={24} color={colors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Driver Details</Text>
                <View style={styles.headerSpacer} />
            </View>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                <Text style={styles.driverName}>Michael Johnson</Text>
                <Text style={styles.ratingText}>⭐️ 4.92
                    <Text style={styles.tripsText}> (2,483 trips)</Text>
                </Text>

                <View style={styles.card}>
                    <MaterialDesignIcons name="directions-car-filled" size={44} color={colors.whiteColor} />
                    <View style={styles.cardInnerCol}>
                        <Text style={styles.bodyTextWhiteMd}>Toyota Camry • White</Text>
                        <Text style={styles.bodyTextGreySm}>ABC 123</Text>
                    </View>
                </View>

                <View style={[styles.card, styles.etaCard]}>
                    <View style={styles.etaRow}>
                        <MaterialDesignIcons name="access-time" size={24} color={colors.secondaryColor} />
                        <View style={styles.cardInnerCol}>
                            <Text style={styles.bodyTextSecondary}>Estimated Time of Arrival</Text>
                            <Text style={styles.etaValue}>8 mins</Text>
                        </View>
                    </View>
                    <View style={styles.progressBarBg}>
                        <View style={styles.progressBarFill} />
                    </View>
                    <View style={styles.locationRow}>
                        <View style={[styles.locationDot, styles.locationDotActive]} />
                        <Text style={styles.bodyTextWhiteSm}>Independence Avenue, Central Business District</Text>
                    </View>
                    <View style={styles.locationRow}>
                        <View style={[styles.locationDot, styles.locationDotInactive]} />
                        <Text style={styles.bodyTextWhiteSm}>Sam Nujoma Dr, Klein Windhoek, Namibia</Text>
                    </View>
                </View>

                <View style={styles.actionButtonsRow}>
                    <CommonButton title={'Call Driver'} textColor={colors.whiteColor} style={styles.actionButtonHalf} color={colors.secondaryColor} icon={'call'} isIcon={true} iconColor={colors.whiteColor} />
                    <CommonButton title={'Message'} textColor={colors.secondaryColor} style={styles.actionButtonHalfOutline} color={colors.primaryColor} icon={'message'} isIcon={true} iconColor={colors.secondaryColor} />
                </View>

                <View style={[styles.card, styles.cardTopMarginSm, { flexDirection: 'column', gap: 8 }]}>
                    <View style={styles.fareHeaderRow}>
                        <View style={styles.fareLabel}>
                            <MaterialDesignIcons name="account-balance-wallet" size={24} color={colors.secondaryColor} />
                            <Text style={styles.bodyTextWhiteMd}>Fare Estimate</Text>
                        </View>
                        <Text style={styles.fareAmount}>$24.50</Text>
                    </View>
                    <View style={styles.fareMetaRow}>
                        <Text style={styles.bodyTextSecondary}>4.3 km</Text>
                        <View style={styles.metaDot} />
                        <Text style={styles.bodyTextSecondary}>15 min</Text>
                    </View>
                </View>

                <View style={[styles.card, styles.cardTopMarginSm, styles.cardRow]}>
                    <View style={styles.shareTripLabel}>
                        <MaterialDesignIcons name="ios-share" size={24} color={colors.secondaryColor} />
                        <Text style={styles.bodyTextWhiteMd}>Share Trip Status</Text>
                    </View>
                    <MaterialDesignIcons name="arrow-forward-ios" size={24} color={colors.secondaryColor} />
                </View>

                <View style={[styles.card, styles.cardTopMarginSm]}>
                    <MaterialDesignIcons name="privacy-tip" size={44} color={colors.secondaryColor} />
                    <View style={styles.cardInnerCol}>
                        <Text style={styles.bodyTextWhiteMd}>Verification Code</Text>
                        <Text style={styles.bodyTextSecondary}>Show to driver: 2854</Text>
                    </View>
                </View>

                <CommonButton title={'Cancel Ride'} textColor={colors.redColor} icon={'info-outline'} iconColor={colors.redColor} isIcon={true} style={styles.cancelButton} />
                <Text style={styles.cancellationNote}>Cancellation fee of $5 may apply</Text>

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

    // Driver name & rating
    driverName: {
        color: colors.whiteColor,
        fontSize: 20,
        lineHeight: 28,
        fontWeight: '600',
    },
    ratingText: {
        color: colors.whiteColor,
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
    },
    tripsText: {
        color: colors.lightGreyColor,
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
    },

    // Card base
    card: {
        borderWidth: 1,
        borderColor: colors.borderColor,
        width: '100%',
        gap: 20,
        marginTop: 40,
        padding: 16,
        backgroundColor: colors.cardWhiteOpacity,
        borderRadius: 15,
        flexDirection: 'row',
    },
    cardTopMarginSm: {
        marginTop: 20,
    },
    cardRow: {
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardInnerCol: {
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
    },

    // ETA card
    etaCard: {
        flexDirection: 'column',
        gap: 0,
    },
    etaRow: {
        flexDirection: 'row',
        gap: 20,
    },
    etaValue: {
        color: colors.whiteColor,
        fontSize: 24,
        lineHeight: 32,
        fontWeight: '600',
    },
    progressBarBg: {
        width: '100%',
        height: 8,
        borderRadius: 16,
        backgroundColor: colors.whiteColor,
        marginTop: 20,
    },
    progressBarFill: {
        width: '60%',
        height: 8,
        borderRadius: 16,
        backgroundColor: colors.secondaryColor,
    },
    locationRow: {
        marginTop: 20,
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    locationDot: {
        width: 10,
        height: 10,
        borderRadius: 100,
    },
    locationDotActive: {
        backgroundColor: colors.secondaryColor,
    },
    locationDotInactive: {
        backgroundColor: colors.lightGreyColor,
    },

    // Action buttons row
    actionButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
        marginTop: 20,
    },
    actionButtonHalf: {
        width: '45%',
    },
    actionButtonHalfOutline: {
        width: '45%',
        borderWidth: 1,
        borderColor: colors.secondaryColor,
    },

    // Fare card
    fareHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    fareLabel: {
        flexDirection: 'row',
        gap: 10,
    },
    fareAmount: {
        color: colors.whiteColor,
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
    },
    fareMetaRow: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    metaDot: {
        width: 6,
        height: 6,
        borderRadius: 100,
        backgroundColor: colors.secondaryColor,
    },

    // Share trip card
    shareTripLabel: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Cancel
    cancelButton: {
        borderWidth: 1,
        borderColor: colors.redColor,
        marginTop: 40,
    },
    cancellationNote: {
        color: colors.lightGreyColor,
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '500',
    },

    // Shared text styles
    bodyTextWhiteMd: {
        color: colors.whiteColor,
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500',
    },
    bodyTextWhiteSm: {
        color: colors.whiteColor,
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
    },
    bodyTextGreySm: {
        color: colors.lightGreyColor,
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
    },
    bodyTextSecondary: {
        color: colors.secondaryColor,
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
    },
});