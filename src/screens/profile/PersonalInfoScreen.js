import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import CommonTextField from '../../components/CommonTextField';

export default function PersonalInfoScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>

            <View style={styles.screenHeader}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.goBack()}>
                    <MaterialDesignIcons name="arrow-back-ios" size={24} color={colors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Personal Information</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.avatarWrapper}>
                    <Image
                        source={require('../../assets/images/profile.png')
                        }
                        style={styles.profileImage}
                        resizeMode='cover'
                    />
                </View>


                <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Name</Text>
                    <CommonTextField value={'Jenny Nolan'} isEditable={false} />
                </View>

                <View style={styles.fieldGroupSpaced}>
                    <Text style={styles.fieldLabel}>Email</Text>
                    <CommonTextField value={'jenny@gmail.com'} isEditable={false} />
                </View>

                <View style={styles.fieldGroupSpaced}>
                    <Text style={styles.fieldLabel}>Phone Number</Text>
                    <CommonTextField value={'+91 1234567890'} isEditable={false} />
                </View>

                <View style={styles.fieldGroupSpaced}>
                    <Text style={styles.fieldLabel}>Address</Text>
                    <CommonTextField value={'Sector 25, Chandigarh, India'} isEditable={false} />
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
        paddingTop: 16,
        paddingHorizontal: 16,
        alignItems: 'center'
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
    avatarContainer: {
        width: 120,
        height: 120,
        marginBottom: 24,
    },
    avatarWrapper: {
        width: 120,
        height: 120,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.whiteColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:20
    },
    profileImage: {
        width: 105,
        height: 105,
        borderRadius: 16,
    },
    editImageButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: colors.secondaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.primaryColor,
    },
    fieldGroup: {
        width: '100%',
        gap: 8,
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
});