import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import CommonTextField from '../../components/CommonTextField';
import CommonButton from '../../components/CommonButton';

export default function ChangePasswordScreen({ navigation }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        if (newPassword.length < 8) {
            Alert.alert('Error', 'New password must be at least 8 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New password and confirm password do not match.');
            return;
        }
        if (currentPassword === newPassword) {
            Alert.alert('Error', 'New password must be different from current password.');
            return;
        }
        Alert.alert('Success', 'Password changed successfully.', [
            { text: 'OK', onPress: () => navigation.goBack() },
        ]);
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>

            <View style={styles.screenHeader}>
                <TouchableOpacity  activeOpacity={0.8} onPress={() => navigation.goBack()}>
                    <MaterialDesignIcons name="arrow-back-ios" size={24} color={colors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Change Password</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.desc}>
                    Your new password must be at least 8 characters and different from your current password.
                </Text>

                <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Current Password</Text>
                    <CommonTextField
                        placeholder="Enter your current password"
                        secureTextEntry={true}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                </View>

                <View style={styles.fieldGroupSpaced}>
                    <Text style={styles.fieldLabel}>New Password</Text>
                    <CommonTextField
                        placeholder="Enter your new password"
                        secureTextEntry={true}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                </View>

                <View style={styles.fieldGroupSpaced}>
                    <Text style={styles.fieldLabel}>Confirm New Password</Text>
                    <CommonTextField
                        placeholder="Re-enter your new password"
                        secureTextEntry={true}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>

                <CommonButton
                    color={colors.secondaryColor}
                    title="Update Password"
                    textColor={colors.whiteColor}
                    style={{ marginTop: 40 }}
                    onPress={handleSubmit}
                />
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
        paddingHorizontal: 16,
        paddingTop: 20,
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
    fieldGroup: {
        width: '100%',
        gap: 8,
        marginTop: 24,
    },
    fieldGroupSpaced: {
        width: '100%',
        gap: 8,
        marginTop: 20,
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 20,
        color: colors.whiteColor,
    },
    desc: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        color: colors.lightGreyColor,
    },
});