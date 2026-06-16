import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';

const PRIVACY_SECTIONS = [
    {
        id: '1',
        title: '1. Information We Collect',
        content: `We collect information you provide directly to us when you create an account, book a ride, or contact support. This includes your name, email address, phone number, profile photo, and payment information.\n\nWe also collect location data while the app is in use to enable ride booking and tracking features.`,
    },
    {
        id: '2',
        title: '2. How We Use Your Information',
        content: `Your information is used to provide, maintain, and improve our services. This includes processing ride bookings, sending ride confirmations, connecting you with drivers, and handling payments.\n\nWe may also use your data to personalize your experience, send promotional offers (with your consent), and ensure platform safety.`,
    },
    {
        id: '3',
        title: '3. Location Data',
        content: `ViteRide collects precise location data to match you with nearby drivers and provide accurate ETAs. Location access is required while using the app for core functionality.\n\nWe do not share your precise location with third parties except your assigned driver during an active ride.`,
    },
    {
        id: '4',
        title: '4. Sharing Your Information',
        content: `We do not sell your personal data. We may share information with drivers to complete your ride, payment processors to handle transactions, and service providers who assist our operations.\n\nAll third parties are contractually required to protect your data.`,
    },
    {
        id: '5',
        title: '5. Data Retention',
        content: `We retain your account data for as long as your account is active. Ride history is kept for up to 3 years for safety and dispute resolution purposes.\n\nYou may request deletion of your account and associated data at any time through the app settings.`,
    },
    {
        id: '6',
        title: '6. Your Rights',
        content: `You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time.\n\nTo exercise any of these rights, contact our support team or visit the Account Settings section of the app.`,
    },
    {
        id: '7',
        title: '7. Security',
        content: `We implement industry-standard security measures including data encryption in transit and at rest, secure authentication, and regular security audits to protect your information.\n\nHowever, no method of transmission over the internet is 100% secure. We encourage you to keep your password confidential.`,
    },
    {
        id: '8',
        title: '8. Changes to This Policy',
        content: `We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notification.\n\nContinued use of ViteRide after changes are posted constitutes your acceptance of the updated policy.`,
    },
    {
        id: '9',
        title: '9. Contact Us',
        content: `If you have any questions or concerns about this Privacy Policy or how your data is handled, please reach out to us at:\n\nprivacy@viteride.com\n\nViteRide Inc., 123 Mobility Lane, Tech City, IN 160062`,
    },
];

export default function PrivacyPolicyScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>

            <View style={styles.screenHeader}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()}>
                    <MaterialDesignIcons name="arrow-back-ios" size={24} color={colors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Privacy Policy</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.effectiveBadge}>
                    <MaterialDesignIcons name="info-outline" size={14} color={colors.lightGreyColor} />
                    <Text style={styles.effectiveText}>Effective Date: January 1, 2025</Text>
                </View>

                <Text style={styles.intro}>
                    At ViteRide, your privacy matters. This policy explains what data we collect, how we use it, and the choices you have.
                </Text>

                {PRIVACY_SECTIONS.map((section, index) => (
                    <View
                        key={section.id}
                        style={[styles.sectionCard, index === PRIVACY_SECTIONS.length - 1 && styles.lastCard]}
                    >
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <Text style={styles.sectionContent}>{section.content}</Text>
                    </View>
                ))}

                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2025 ViteRide. All rights reserved.</Text>
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
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 50,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    effectiveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 14,
    },
    effectiveText: {
        fontSize: 12,
        fontWeight: '400',
        color: colors.lightGreyColor,
    },
    intro: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 22,
        color: colors.lightGreyColor,
        marginBottom: 20,
    },
    sectionCard: {
        backgroundColor: colors.cardColor ?? 'rgba(255,255,255,0.07)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    lastCard: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.whiteColor,
        marginBottom: 10,
    },
    sectionContent: {
        fontSize: 13,
        fontWeight: '400',
        lineHeight: 21,
        color: colors.lightGreyColor,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    footerText: {
        fontSize: 12,
        color: colors.lightGreyColor,
        opacity: 0.6,
    },
});