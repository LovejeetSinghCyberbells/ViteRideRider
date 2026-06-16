import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';

const TERMS_SECTIONS = [
    {
        id: '1',
        title: '1. Acceptance of Terms',
        content: `By downloading, installing, or using the ViteRide application, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the app.\n\nWe reserve the right to update these terms at any time. Continued use of ViteRide after changes are posted constitutes your acceptance.`,
    },
    {
        id: '2',
        title: '2. Eligibility',
        content: `You must be at least 18 years of age to use ViteRide. By creating an account, you confirm that you meet this requirement and that all information you provide is accurate and complete.\n\nViteRide reserves the right to suspend or terminate accounts found to be in violation of eligibility requirements.`,
    },
    {
        id: '3',
        title: '3. Account Responsibilities',
        content: `You are responsible for maintaining the confidentiality of your account credentials. Any activity that occurs under your account is your responsibility.\n\nPlease notify us immediately at support@viteride.com if you suspect unauthorized access to your account.`,
    },
    {
        id: '4',
        title: '4. Ride Booking & Cancellations',
        content: `When you book a ride, you enter into a direct agreement with the driver. ViteRide acts as a platform facilitating this connection and is not a party to the ride agreement.\n\nCancellations made after a driver has been assigned may incur a cancellation fee as outlined in our Fare Policy. Repeated cancellations may result in account restrictions.`,
    },
    {
        id: '5',
        title: '5. Fares & Payments',
        content: `Fares are calculated based on distance, time, demand, and applicable taxes. The estimated fare shown at booking may differ from the final fare due to route changes or wait time.\n\nAll payments are processed securely through our payment partners. ViteRide does not store full card details on its servers.`,
    },
    {
        id: '6',
        title: '6. Prohibited Conduct',
        content: `You agree not to use ViteRide for any unlawful purpose, to harass or harm drivers or other users, to manipulate the platform's pricing or matching system, or to provide false information during registration or booking.\n\nViolations may result in immediate account suspension and legal action where applicable.`,
    },
    {
        id: '7',
        title: '7. Driver Conduct & Safety',
        content: `All ViteRide drivers are independently verified and must meet our safety standards. However, ViteRide does not employ drivers and is not liable for the conduct of drivers during a ride.\n\nIf you experience unsafe behavior during a ride, please use the in-app emergency button or contact local authorities immediately.`,
    },
    {
        id: '8',
        title: '8. Limitation of Liability',
        content: `To the fullest extent permitted by law, ViteRide shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.\n\nOur total liability for any claim related to the service shall not exceed the amount you paid for the specific ride in question.`,
    },
    {
        id: '9',
        title: '9. Intellectual Property',
        content: `All content, branding, logos, and technology within the ViteRide app are the intellectual property of ViteRide Inc. and may not be copied, modified, or distributed without express written consent.\n\nUser-generated content such as reviews remains your property, but you grant ViteRide a license to display it within the platform.`,
    },
    {
        id: '10',
        title: '10. Termination',
        content: `You may delete your account at any time through the app settings. ViteRide reserves the right to suspend or terminate your account without notice if you violate these terms.\n\nUpon termination, your right to use the platform ceases immediately. Provisions that by their nature should survive termination will remain in effect.`,
    },
    {
        id: '11',
        title: '11. Governing Law',
        content: `These Terms of Service are governed by the laws of India. Any disputes arising from these terms or your use of ViteRide shall be subject to the exclusive jurisdiction of the courts of Punjab, India.\n\nWe encourage users to reach out to our support team before initiating any formal legal proceedings.`,
    },
    {
        id: '12',
        title: '12. Contact Us',
        content: `For any questions regarding these Terms of Service, please contact us at:\n\nlegal@viteride.com\n\nViteRide Inc., 123 Mobility Lane, Tech City, IN 160062`,
    },
];

export default function TermsOfServiceScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>

            <View style={styles.screenHeader}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.goBack()}>
                    <MaterialDesignIcons name="arrow-back-ios" size={24} color={colors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Terms of Service</Text>
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
                    Please read these Terms of Service carefully before using ViteRide. These terms govern your access to and use of our ride-booking platform.
                </Text>

                {TERMS_SECTIONS.map((section, index) => (
                    <View
                        key={section.id}
                        style={[styles.sectionCard, index === TERMS_SECTIONS.length - 1 && styles.lastCard]}
                    >
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <Text style={styles.sectionContent}>{section.content}</Text>
                    </View>
                ))}

                <View style={styles.agreementBox}>
                    <MaterialDesignIcons name="check-circle" size={18} color={colors.secondaryColor} />
                    <Text style={styles.agreementText}>
                        By using ViteRide, you confirm that you have read, understood, and agreed to these Terms of Service.
                    </Text>
                </View>

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
        marginBottom: 16,
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
    agreementBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        backgroundColor: colors.cardColor ?? 'rgba(255,255,255,0.07)',
        borderRadius: 12,
        padding: 14,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: colors.secondaryColor + '55',
    },
    agreementText: {
        flex: 1,
        fontSize: 13,
        fontWeight: '400',
        lineHeight: 20,
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