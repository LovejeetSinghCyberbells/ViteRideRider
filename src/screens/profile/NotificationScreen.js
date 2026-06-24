import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import NotificationCard from '../../components/NotificationCard';
// Redux Hooks aur Thunks import kiye
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  markNotificationsAsRead,
} from '../../redux/fetures/notificationSlice';

// Helper Utility to format dynamic time segments (e.g., 5m ago, 2h ago, Yesterday)
const formatTimeAgo = dateString => {
  if (!dateString) return '';
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now - past;

  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMins < 1) return 'Just now';
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return 'Yesterday';
  return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function NotificationScreen({ navigation }) {
  const dispatch = useDispatch();
  const { list, isLoading } = useSelector(state => state.notification);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAllRead = () => {
    // Sirf tab trigger hoga jab unread notifications available honge
    const hasUnread = list.some(n => !n.isRead);
    if (hasUnread) {
      dispatch(markNotificationsAsRead());
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.screenHeader}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <MaterialDesignIcons
            name="arrow-back-ios"
            size={24}
            color={colors.whiteColor}
          />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Notification</Text>

        {/* Dynamic Mark All Read Action Controller */}
        <TouchableOpacity activeOpacity={0.7} onPress={handleMarkAllRead}>
          <Text style={styles.markAllText}>Mark read</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.secondaryColor} />
        </View>
      ) : list.length === 0 ? (
        <View style={styles.loaderContainer}>
          <MaterialDesignIcons
            name="notifications-none"
            size={48}
            color={colors.lightGreyColor}
          />
          <Text style={styles.noDataText}>No notifications yet.</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.notifications}>
            {list.map(notification => {
              // Adapting model enum schemas to match your generic NotificationCard types
              let cardType = 'alert';
              if (notification.type === 'ride_update') cardType = 'ride';
              if (notification.type === 'payment') cardType = 'payment';
              if (notification.type === 'general') cardType = 'promo';

              const preparedData = {
                id: notification._id,
                type: cardType,
                title: notification.title,
                message: notification.message,
                time: formatTimeAgo(notification.createdAt),
                isRead: notification.isRead,
              };

              return (
                <NotificationCard
                  key={notification._id}
                  notification={preparedData}
                />
              );
            })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primaryColor, paddingTop: 50 },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 50,
    backgroundColor: colors.primaryColor,
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
    marginLeft: 24,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.secondaryColor,
  },
  notifications: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  noDataText: { color: colors.lightGreyColor, fontSize: 16, fontWeight: '500' },
});
