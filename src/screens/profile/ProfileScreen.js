import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import CommonButton from '../../components/CommonButton';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/fetures/authSlice';
import { getProfile } from '../../redux/fetures/getProfileSlice'; // Imported from profileSlice

const APP_SETTINGS = [
  { icon: 'settings', title: 'App Preferences' },
  { icon: 'help-outline', title: 'Help & Support' },
  {
    icon: 'info-outline',
    title: 'About App',
    onPressNavigationScreen: 'AboutAppScreen',
  },
];

const ACCOUNT_SETTINGS = [
  {
    icon: 'person-outline',
    title: 'Personal Information',
    onPressNavigationScreen: 'PersonalInfoScreen',
  },
  {
    icon: 'lock-outline',
    title: 'Security & Privacy',
    onPressNavigationScreen: 'SecurityPrivacyScreen',
  },
  {
    icon: 'history',
    title: 'Ride History',
    onPressNavigationScreen: 'RideHistoryScreen',
  },
  {
    icon: 'notifications-none',
    title: 'Notifications',
    onPressNavigationScreen: 'NotificationScreen',
  },
];

const PAYMENT_METHODS = [
  { icon: 'credit-card', title: 'Credit & Debit Cards' },
  { icon: 'grid-view', title: 'Bank Account' },
  {
    icon: 'history-edu',
    title: 'Payment History',
    onPressNavigationScreen: 'PaymentHistoryScreen',
  },
];

const SettingCard = ({ icon, title, onPressNavigationScreen, navigation }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.settingCard}
      onPress={() => {
        onPressNavigationScreen
          ? navigation.navigate(onPressNavigationScreen)
          : console.log('hiiii');
      }}
    >
      <View style={styles.settingLeft}>
        <MaterialDesignIcons name={icon} size={20} color={colors.whiteColor} />
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

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();

  // Reading state from the new profile slice
  const { userProfile, profileLoading } = useSelector(state => state.profile);
  console.log(
    'ProfileScreen Rendered - userProfile:',
    userProfile,
    'Loading:',
    profileLoading,
  );

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  if (profileLoading && !userProfile) {
    return (
      <View
        style={[
          styles.safeArea,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color={colors.secondaryColor} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={'bottom'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <MaterialDesignIcons
            name="arrow-back-ios"
            size={28}
            color={colors.whiteColor}
          />
        </TouchableOpacity>

        <View style={styles.profileSection}>
          <View style={styles.profileImageWrapper}>
            <View style={styles.profilePictureContainer}>
              <Image
                source={
                  userProfile?.profilePicture
                    ? { uri: userProfile.profilePicture }
                    : require('../../assets/images/profile.png')
                }
                style={styles.profileImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.cameraIconContainer}>
              <MaterialDesignIcons
                name="camera-alt"
                size={18}
                color={colors.whiteColor}
              />
            </View>
          </View>

          <Text style={styles.largeProfileName}>
            {userProfile?.name || 'User'}
          </Text>
          <Text style={styles.largeProfileEmail}>
            {userProfile?.email || 'N/A'}
          </Text>

          <CommonButton
            onPress={() => navigation.navigate('EditProfileScreen')}
            color={colors.secondaryColor}
            style={styles.editProfileButton}
            title={'Edit Profile'}
            textColor={colors.whiteColor}
          />
        </View>

        <Text style={styles.sectionTitle}>Account Settings</Text>
        {ACCOUNT_SETTINGS.map((setting, index) => (
          <SettingCard
            key={index}
            icon={setting.icon}
            title={setting.title}
            onPressNavigationScreen={setting.onPressNavigationScreen}
            navigation={navigation}
          />
        ))}

        <Text style={styles.sectionTitle}>Payment Methods</Text>
        {PAYMENT_METHODS.map((setting, index) => (
          <SettingCard
            key={index}
            icon={setting.icon}
            title={setting.title}
            navigation={navigation}
            onPressNavigationScreen={setting.onPressNavigationScreen}
          />
        ))}

        <Text style={styles.sectionTitle}>App Settings</Text>
        {APP_SETTINGS.map((setting, index) => (
          <SettingCard
            key={index}
            icon={setting.icon}
            title={setting.title}
            navigation={navigation}
            onPressNavigationScreen={setting.onPressNavigationScreen}
          />
        ))}

        <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
          <MaterialDesignIcons
            name="logout"
            size={20}
            color={colors.redColor}
          />
          <Text style={[styles.settingTitle, { color: colors.redColor }]}>
            Log Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primaryColor },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 50,
    backgroundColor: colors.primaryColor,
  },
  profileSection: { alignItems: 'center', justifyContent: 'center' },
  profileImageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 140,
    height: 140,
  },
  profilePictureContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  profileImage: { width: '100%', height: '100%', borderRadius: 60 },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#4285F4',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  largeProfileName: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    color: colors.whiteColor,
  },
  largeProfileEmail: {
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
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    padding: 15,
    backgroundColor: colors.appSettingCardWhiteOpacity,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.whiteColor,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  settingTitle: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: colors.whiteColor,
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 80,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.redColor,
  },
  editProfileButton: { width: '50%', marginTop: 20 },
});
