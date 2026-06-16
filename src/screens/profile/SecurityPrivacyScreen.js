import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';


const PRIVACY_SETTINGS = [
    {
        icon: 'person-outline',
        title: 'Privacy Policy',
        onPressNavigationScreen: 'PrivacyPolicyScreen'
    },
    {
        icon: 'lock-outline',
        title: 'Terms of Service ',
        onPressNavigationScreen: 'TermsOfServiceScreen'
    },
];


const SettingCard = ({ icon, title, onPressNavigationScreen, navigation }) => {
    return (
        <TouchableOpacity style={styles.settingCard} onPress={() => { onPressNavigationScreen ? navigation.navigate(onPressNavigationScreen) : console.log('hiiii') }} activeOpacity={0.8} >
            <View style={styles.settingLeft}>
                <MaterialDesignIcons
                    name={icon}
                    size={20}
                    color={colors.whiteColor}
                />
                <Text style={styles.settingTitle}>{title}</Text>
            </View>
            <MaterialDesignIcons
                name="arrow-forward-ios"
                size={20}
                color={colors.whiteColor}
            />
        </TouchableOpacity>
    );
};

export default function SecurityAndPrivacyScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>

            <View style={styles.screenHeader}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()}>
                    <MaterialDesignIcons name="arrow-back-ios" size={24} color={colors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Security & Privacy</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionTitle}>Password Settings</Text>
                <SettingCard title={'Change Password'} icon={'lock-outline'} onPressNavigationScreen={'ChangePasswordScreen'} navigation={navigation} />
                <Text style={styles.sectionTitle}>Privacy Settings</Text>
                {PRIVACY_SETTINGS.map((setting, index) => (
                    <SettingCard
                        key={index}
                        icon={setting.icon}
                        title={setting.title}
                        navigation={navigation}
                        onPressNavigationScreen={setting.onPressNavigationScreen}
                    />
                ))}

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
        paddingHorizontal: 16,
        paddingTop: 16
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
    settingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        padding: 20,
        backgroundColor: colors.appSettingCardWhiteOpacity,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.whiteColor,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        color: colors.whiteColor,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 27,
        color: colors.whiteColor,
        marginTop: 30,
    },
});