import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../common/Colors';

// status: 'completed' | 'failed' | 'refunded' | 'pending'
export default function PaymentHistoryCard({ item }) {
    const statusConfig = {
        completed: {
            icon: 'check-circle',
            color: '#4CAF50',
            label: 'Completed',
        },
        failed: {
            icon: 'cancel',
            color: '#F44336',
            label: 'Failed',
        },
        refunded: {
            icon: 'replay',
            color: '#FF9800',
            label: 'Refunded',
        },
        pending: {
            icon: 'access-time',
            color: '#2196F3',
            label: 'Pending',
        },
    };

    const paymentMethodIcons = {
        card: 'credit-card',
        upi: 'account-balance',
        cash: 'payments',
        wallet: 'account-balance-wallet',
    };

    const status = statusConfig[item.status] ?? statusConfig.pending;
    const methodIcon = paymentMethodIcons[item.paymentMethod] ?? 'payments';

    return (
        <View style={styles.card}>

            {/* Top Row */}
            <View style={styles.topRow}>
                <View style={styles.iconWrapper}>
                    <MaterialDesignIcons name="directions-car" size={22} color={colors.secondaryColor} />
                </View>

                <View style={styles.rideInfo}>
                    <Text style={styles.routeText} numberOfLines={1}>
                        {item.pickup} → {item.dropoff}
                    </Text>
                    <Text style={styles.dateText}>{item.date}  •  {item.time}</Text>
                </View>

                <View style={styles.amountBlock}>
                    <Text style={[
                        styles.amountText,
                        item.status === 'refunded' && styles.refundedAmount,
                        item.status === 'failed' && styles.failedAmount,
                    ]}>
                        {item.status === 'refunded' ? '+' : ''}₹{item.amount}
                    </Text>
                </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Bottom Row */}
            <View style={styles.bottomRow}>

                <View style={styles.methodBadge}>
                    <MaterialDesignIcons name={methodIcon} size={14} color={colors.lightGreyColor} />
                    <Text style={styles.methodText}>{item.paymentMethodLabel}</Text>
                </View>

                <View style={styles.transactionIdBlock}>
                    <Text style={styles.txnText} numberOfLines={1}>#{item.transactionId}</Text>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: status.color + '22' }]}>
                    <MaterialDesignIcons name={status.icon} size={13} color={status.color} />
                    <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                </View>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.cardColor ?? 'rgba(255,255,255,0.07)',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 14,
        marginBottom: 12,
    },

    // Top Row
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.secondaryColor + '22',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rideInfo: {
        flex: 1,
        gap: 4,
    },
    routeText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.whiteColor,
        lineHeight: 18,
    },
    dateText: {
        fontSize: 12,
        fontWeight: '400',
        color: colors.lightGreyColor,
        lineHeight: 16,
    },
    amountBlock: {
        alignItems: 'flex-end',
    },
    amountText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.whiteColor,
    },
    refundedAmount: {
        color: '#4CAF50',
    },
    failedAmount: {
        color: '#F44336',
        textDecorationLine: 'line-through',
    },

    // Divider
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginVertical: 10,
    },

    // Bottom Row
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    methodBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    methodText: {
        fontSize: 12,
        color: colors.lightGreyColor,
        fontWeight: '400',
    },
    transactionIdBlock: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    txnText: {
        fontSize: 11,
        color: colors.lightGreyColor,
        opacity: 0.5,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
});