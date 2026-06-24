import React, { useState, useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { fetchRideHistory } from '../../redux/fetures/rideHistorySlice';

const TABS = ['All', 'This Month', 'Last Month', 'Custom'];

function FilterTabs({ onTabChange }) {
  const [activeTab, setActiveTab] = useState('All');

  const handlePress = tab => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {TABS.map(tab => {
          const isActive = tab === activeTab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => handlePress(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default function RideHistoryScreen({ navigation }) {
  const dispatch = useDispatch();
  const { rides, historyLoading } = useSelector(state => state.rideHistory);
  const [selectedTab, setSelectedTab] = useState('All');

  useEffect(() => {
    dispatch(fetchRideHistory());
  }, [dispatch]);

  // Backend dates local string formatting utility helper
  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return (
      date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }) +
      ' • ' +
      date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  };

  // Filter local dataset based on selected category segment
  const filteredRides = rides.filter(ride => {
    if (selectedTab === 'All') return true;

    const rideDate = new Date(ride.date);
    const now = new Date();

    if (selectedTab === 'This Month') {
      return (
        rideDate.getMonth() === now.getMonth() &&
        rideDate.getFullYear() === now.getFullYear()
      );
    }
    if (selectedTab === 'Last Month') {
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const targetYear =
        now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      return (
        rideDate.getMonth() === lastMonth &&
        rideDate.getFullYear() === targetYear
      );
    }
    return true; // Fallback structure configuration
  });

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
        <Text style={styles.screenTitle}>Ride History</Text>
        <View style={{ width: 24 }} />
      </View>

      <FilterTabs onTabChange={setSelectedTab} />

      {historyLoading ? (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={colors.secondaryColor} />
        </View>
      ) : filteredRides.length === 0 ? (
        <View style={styles.centeredContainer}>
          <Text style={styles.noDataText}>No rides found for this filter.</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredRides.map(ride => (
            <View key={ride.rideId} style={styles.historyCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.dateText}>{formatDate(ride.date)}</Text>
                <Text style={styles.priceText}>${ride.fare}</Text>
              </View>

              <View style={styles.routeContainer}>
                <View style={styles.indicatorColumn}>
                  <View style={styles.dotWhite} />
                  <View style={styles.verticalLine} />
                  <View style={[styles.dotWhite, styles.dotYellow]} />
                </View>

                <View style={styles.locationContainer}>
                  <View style={styles.locationTextColumn}>
                    <Text style={styles.locationName} numberOfLines={1}>
                      {ride.pickup}
                    </Text>
                    <Text style={styles.locationLabel}>Pickup Location</Text>
                  </View>
                  <View style={styles.locationTextColumn}>
                    <Text style={styles.locationName} numberOfLines={1}>
                      {ride.dropoff}
                    </Text>
                    <Text style={styles.locationLabel}>Drop Location</Text>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.cardFooter}>
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName}>
                    {ride.driver?.name || 'Driver Assignment Pending'}
                  </Text>
                  {ride.driver && (
                    <View style={styles.ratingRow}>
                      <MaterialDesignIcons
                        name="star"
                        size={16}
                        color={colors.secondaryColor}
                      />
                      <Text style={styles.ratingText}>
                        {ride.driver.rating}
                      </Text>
                    </View>
                  )}
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        ride.status === 'completed' ? '#4CAF5020' : '#F4433620',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          ride.status === 'completed' ? '#4CAF50' : '#F44336',
                      },
                    ]}
                  >
                    {ride.status ? ride.status.toUpperCase() : 'UNKNOWN'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primaryColor, paddingTop: 50 },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  screenTitle: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: colors.whiteColor,
    flex: 1,
    textAlign: 'center',
  },
  wrapper: { width: '100%', marginBottom: 10 },
  container: { gap: 12, paddingHorizontal: 16, paddingVertical: 8 },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.whiteColor,
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: colors.secondaryColor,
    borderColor: colors.secondaryColor,
  },
  label: { color: colors.whiteColor, fontSize: 14, fontWeight: '500' },
  labelActive: { color: colors.whiteColor },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: { color: colors.lightGreyColor, fontSize: 16, fontWeight: '500' },
  historyCard: {
    backgroundColor: colors.appSettingCardWhiteOpacity,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: { fontSize: 14, color: colors.lightGreyColor, fontWeight: '400' },
  priceText: { fontSize: 18, color: colors.whiteColor, fontWeight: '700' },
  routeContainer: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  indicatorColumn: { alignItems: 'center', width: 20 },
  dotWhite: {
    width: 8,
    height: 8,
    borderRadius: 100,
    backgroundColor: colors.whiteColor,
    marginTop: 4,
  },
  dotYellow: { backgroundColor: colors.secondaryColor },
  verticalLine: {
    width: 2,
    height: 36,
    backgroundColor: colors.secondaryColor,
    opacity: 0.4,
    marginTop: 2,
  },
  locationContainer: { flex: 1, gap: 4 },
  locationTextColumn: { flex: 1, paddingBottom: 10 },
  locationName: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.whiteColor,
    lineHeight: 22,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.lightGreyColor,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: colors.lightGreyColor,
    opacity: 0.2,
    marginTop: 4,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverInfo: { flexDirection: 'column', gap: 4 },
  driverName: { fontSize: 14, fontWeight: '500', color: colors.whiteColor },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 13, color: colors.whiteColor, fontWeight: '400' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '600' },
});
