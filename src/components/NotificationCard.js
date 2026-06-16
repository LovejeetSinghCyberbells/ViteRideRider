import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../common/Colors';

const NOTIFICATION_ICONS = {
    ride: { icon: 'directions-car', bg: colors.lightBlueColor, border: colors.lightBlueColor, color: colors.blueColor },
    payment: { icon: 'account-balance-wallet', bg: colors.lightGreenColor, border: colors.greenColor, color: colors.greenColor },
    alert: { icon: 'notifications-active', bg: colors.lightRedColor, border: colors.redColor, color: colors.redColor },
    promo: { icon: 'local-offer', bg: colors.lightPurpleColor, border: colors.purpleColor, color: colors.purpleColor },
    system: { icon: 'info', bg: colors.lightBlueColor, border: colors.lightBlueColor, color: colors.blueColor },
};

export default function NotificationCard({ notification }) {
    const {
        type = 'system',
        title,
        message,
        time,
        isRead = false,
    } = notification;

    const style = NOTIFICATION_ICONS[type] ?? NOTIFICATION_ICONS.system;

    return (
        <View style={[styles.card, isRead && styles.cardRead]}>
            {!isRead && <View style={styles.unreadDot} />}

            <View style={[styles.iconBox, { backgroundColor: style.bg, borderColor: style.border }]}>
                <MaterialDesignIcons name={style.icon} size={22} color={style.color} />
            </View>

            <View style={styles.content}>
                <View style={styles.topRow}>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                    <Text style={styles.time}>{time}</Text>
                </View>
                <Text style={styles.message} numberOfLines={2}>{message}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: colors.cardWhiteOpacity,
        borderWidth: 0.5,
        borderColor: colors.borderColor,
        borderRadius: 16,
        padding: 14,
        gap: 12,
        width: '100%',
    },
    cardRead: {
        opacity: 0.6,
    },
    unreadDot: {
        position: 'absolute',
        top: 14,
        right: 14,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.secondaryColor,
    },
    iconBox: {
        width: 46,
        height: 46,
        borderRadius: 13,
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    content: {
        flex: 1,
        gap: 5,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.whiteColor,
        flex: 1,
    },
    time: {
        fontSize: 11,
        color: colors.lightGreyColor,
        flexShrink: 0,
    },
    message: {
        fontSize: 13,
        color: colors.lightGreyColor,
        lineHeight: 19,
    },
});