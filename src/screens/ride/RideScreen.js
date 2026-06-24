// import React, { useEffect, useState } from 'react';
// import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
// import colors from '../../common/Colors';
// import CommonButton from '../../components/CommonButton';
// const { width, height } = Dimensions.get('window');

// export default function RideScreen({ navigation }) {

//     const [isMapClicked, setIsMapClicked] = useState(false);

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             navigation.navigate('PaymentScreen');
//         }, 10000);

//         return () => clearTimeout(timer);
//     }, []);

//     return (
//         <SafeAreaView style={styles.safeArea} edges={['bottom']}>
//             <ScrollView
//                 contentContainerStyle={styles.scrollContent}
//                 showsVerticalScrollIndicator={false}
//             >
//                 <ImageBackground
//                     source={require('../../assets/images/ride_bg.png')}
//                     style={[styles.container, { justifyContent: isMapClicked ? 'flex-end' : 'space-between' }]}
//                     resizeMode="cover"
//                     onTouchStart={() => { if (!isMapClicked) setIsMapClicked(true) }}
//                 >

//                     {isMapClicked && (
//                         <TouchableOpacity activeOpacity={0.8} onPress={() => setIsMapClicked(false)} style={styles.closeButton}>
//                             <MaterialDesignIcons name="close" size={24} color={colors.blackColor} />
//                         </TouchableOpacity>
//                     )}

//                     {!isMapClicked && (
//                         <View style={styles.topSection}>
//                             <View style={styles.carCard}>
//                                 <Image source={require('../../assets/images/car.png')} style={styles.carImage} />
//                                 <View style={styles.carDetails}>
//                                     <Text style={styles.cardTitle}>Car Details</Text>
//                                     <Text style={styles.cardSubText}>Lexus LS</Text>
//                                     <Text style={styles.cardSubText}>TN 01 AN 2435</Text>
//                                 </View>
//                             </View>

//                             <View style={styles.arrivalCard}>
//                                 <Text style={styles.arrivalText}>Your Driver is Arriving In 3 Minutes from Now</Text>
//                             </View>
//                         </View>
//                     )}

//                     <View style={styles.bottomSection}>
//                         {isMapClicked ? (
//                             <View style={[styles.driverCard, styles.driverCardMapActive]}>
//                                 <View style={styles.dragHandle} />

//                                 <View style={styles.arrivalRow}>
//                                     <View>
//                                         <Text style={styles.arrivalMinutes}>12 min</Text>
//                                         <Text style={styles.arrivalTime}>Arriving at 10:53 AM</Text>
//                                     </View>
//                                     <View style={styles.shareButton}>
//                                         <MaterialDesignIcons name='ios-share' size={32} color={colors.blackColor} />
//                                     </View>
//                                 </View>

//                                 <TouchableOpacity
//                                     activeOpacity={0.8}
//                                     onPress={() => navigation.navigate('DriverDetailsScreen')}
//                                     style={styles.driverRow}
//                                 >
//                                     <Image source={require('../../assets/images/profile.png')} style={styles.driverThumb} resizeMode='cover' />
//                                     <View>
//                                         <View style={styles.driverNameRow}>
//                                             <Text style={styles.driverName}>Jenny Nolan</Text>
//                                             <Text style={styles.driverRating}>⭐️ 4.89</Text>
//                                         </View>
//                                         <Text style={styles.driverVehicle}>Toyota Camry • ABC 123</Text>
//                                     </View>
//                                 </TouchableOpacity>

//                                 <View style={styles.routeCard}>
//                                     <View style={styles.routeRow}>
//                                         <View style={styles.routeDotGreen} />
//                                         <View style={styles.routeTextBlock}>
//                                             <Text style={styles.routeLabel}>Pickup</Text>
//                                             <Text numberOfLines={1} ellipsizeMode='clip' style={styles.routeAddress}>
//                                                 Independence Avenue, Central Business District
//                                             </Text>
//                                         </View>
//                                     </View>
//                                     <View style={styles.routeRow}>
//                                         <View style={styles.routeDotSecondary} />
//                                         <View style={styles.routeTextBlock}>
//                                             <Text style={styles.routeLabel}>Drop-off</Text>
//                                             <Text numberOfLines={1} ellipsizeMode='clip' style={styles.routeAddress}>
//                                                 Sam Nujoma Dr, Klein Windhoek, Namibia
//                                             </Text>
//                                         </View>
//                                     </View>
//                                 </View>

//                                 <View style={styles.actionRow}>
//                                     <TouchableOpacity
//                                         activeOpacity={0.8}
//                                         style={styles.actionTile}>
//                                         <MaterialDesignIcons name='message' size={24} color={colors.secondaryColor} />
//                                         <Text style={styles.actionLabel}>Message</Text>
//                                     </TouchableOpacity>
//                                     <TouchableOpacity
//                                         activeOpacity={0.8}
//                                         style={styles.actionTile}>
//                                         <MaterialDesignIcons name='call' size={24} color={colors.secondaryColor} />
//                                         <Text style={styles.actionLabel}>Call</Text>
//                                     </TouchableOpacity>
//                                     <TouchableOpacity
//                                         activeOpacity={0.8}
//                                         style={styles.actionTile}>
//                                         <MaterialDesignIcons name='privacy-tip' size={24} color={colors.secondaryColor} />
//                                         <Text style={styles.actionLabel}>Safety</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             </View>
//                         ) : (
//                             <View style={styles.driverCard}>
//                                 <TouchableOpacity
//                                     activeOpacity={0.8}
//                                     style={styles.driverHeader}
//                                     onPress={() => navigation.navigate('DriverDetailsScreen')}>
//                                     <View style={styles.profileImageWrapper}>
//                                         <Image source={require('../../assets/images/profile.png')} style={styles.profileImage} resizeMode='cover' />
//                                     </View>
//                                     <View style={styles.driverInfo}>
//                                         <Text style={styles.cardTitle}>Driver Details</Text>
//                                         <View style={styles.infoRow}>
//                                             <Text style={styles.cardSubText}>Name :</Text>
//                                             <Text style={styles.cardSubText}>Jenny</Text>
//                                         </View>
//                                         <View style={styles.infoRow}>
//                                             <Text style={styles.cardSubText}>Age :</Text>
//                                             <Text style={styles.cardSubText}>28</Text>
//                                         </View>
//                                         <View style={styles.infoRow}>
//                                             <Text style={styles.cardSubText}>Mobile :</Text>
//                                             <Text style={styles.cardSubText}>1234567890</Text>
//                                         </View>
//                                     </View>
//                                 </TouchableOpacity>

//                                 <View style={styles.divider} />

//                                 <Text style={styles.cardTitle}>Ride Details</Text>
//                                 <View style={styles.rideDetailsRow}>
//                                     <View style={styles.rideDetailsLeft}>
//                                         <View style={styles.infoRow}>
//                                             <Text style={styles.cardSubText}>Total No. of Rides :</Text>
//                                             <Text style={styles.cardSubText}>334</Text>
//                                         </View>
//                                         <View style={styles.infoRow}>
//                                             <Text style={styles.cardSubText}>⭐️ ⭐️ ⭐️ ⭐️ ⭐️</Text>
//                                             <Text style={styles.cardSubText}>( 310+ Ratings)</Text>
//                                         </View>
//                                         <Text style={styles.cardSubText}>
//                                             Text the Driver <Text style={styles.underlineText}>here</Text>
//                                         </Text>
//                                     </View>
//                                     <View style={styles.actionButtons}>
//                                         <View style={styles.callButton}>
//                                             <MaterialDesignIcons name='call' size={35} color={colors.secondaryColor} />
//                                         </View>
//                                         <MaterialDesignIcons name='message' size={35} color={colors.whiteColor} />
//                                     </View>
//                                 </View>
//                             </View>
//                         )}

//                         <CommonButton title={"Cancle Ride"} textColor={colors.whiteColor} color={colors.redColor} onPress={() => navigation.goBack()} />
//                     </View>
//                 </ImageBackground>
//             </ScrollView>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//         backgroundColor: colors.primaryColor,
//     },
//     scrollContent: {
//         flexGrow: 1,
//         backgroundColor: colors.primaryColor,
//     },
//     container: {
//         flex: 1,
//         marginTop: 60,
//         backgroundColor: colors.primaryColor,
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingHorizontal: 16,
//     },

//     closeButton: {
//         position: 'absolute',
//         alignItems: 'center',
//         justifyContent: 'center',
//         top: 20,
//         start: 20,
//         width: 40,
//         height: 40,
//         backgroundColor: colors.whiteColor,
//         borderRadius: 100,
//     },

//     topSection: {
//         width: '100%',
//     },
//     carCard: {
//         padding: 16,
//         backgroundColor: colors.appSettingCardWhiteOpacity,
//         borderRadius: 32,
//         width: '100%',
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         gap: 20,
//     },
//     carImage: {
//         width: '55%',
//         height: 120,
//     },
//     carDetails: {
//         alignItems: 'flex-start',
//         justifyContent: 'space-evenly',
//         width: '50%',
//         height: 80,
//     },
//     arrivalCard: {
//         padding: 16,
//         backgroundColor: colors.appSettingCardWhiteOpacity,
//         borderRadius: 32,
//         marginTop: 40,
//         width: '100%',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     arrivalText: {
//         fontSize: 14,
//         fontWeight: '400',
//         color: colors.whiteColor,
//     },

//     bottomSection: {
//         width: '100%',
//         gap: 20,
//     },
//     driverCard: {
//         paddingVertical: 16,
//         paddingHorizontal: 24,
//         backgroundColor: colors.appSettingCardWhiteOpacity,
//         marginTop: 16,
//         borderRadius: 32,
//         width: '100%',
//     },
//     driverCardMapActive: {
//         paddingBottom: 50,
//     },

//     dragHandle: {
//         width: 72,
//         height: 5,
//         backgroundColor: colors.lightGreyColor,
//         borderRadius: 100,
//         alignSelf: 'center',
//     },

//     arrivalRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginTop: 20,
//     },
//     arrivalMinutes: {
//         fontSize: 24,
//         fontWeight: '600',
//         lineHeight: 32,
//         color: colors.whiteColor,
//     },
//     arrivalTime: {
//         fontSize: 14,
//         fontWeight: '500',
//         lineHeight: 20,
//         color: colors.whiteColor,
//     },
//     shareButton: {
//         width: 50,
//         height: 50,
//         backgroundColor: colors.whiteColor,
//         borderRadius: 100,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },

//     driverRow: {
//         marginTop: 20,
//         flexDirection: 'row',
//         gap: 20,
//         alignItems: 'center',
//         justifyContent: 'flex-start',
//     },
//     driverThumb: {
//         width: 60,
//         height: 60,
//         borderRadius: 18,
//     },
//     driverNameRow: {
//         flexDirection: 'row',
//         gap: 20,
//     },
//     driverName: {
//         fontSize: 15,
//         fontWeight: '500',
//         lineHeight: 24,
//         color: colors.whiteColor,
//     },
//     driverRating: {
//         fontSize: 14,
//         fontWeight: '500',
//         lineHeight: 20,
//         color: colors.whiteColor,
//     },
//     driverVehicle: {
//         fontSize: 14,
//         fontWeight: '500',
//         lineHeight: 20,
//         color: colors.lightGreyColor,
//     },

//     routeCard: {
//         padding: 16,
//         backgroundColor: colors.primaryColor,
//         borderRadius: 15,
//         marginTop: 20,
//         gap: 16,
//     },
//     routeRow: {
//         flexDirection: 'row',
//         gap: 20,
//     },
//     routeDotGreen: {
//         width: 12,
//         height: 12,
//         backgroundColor: colors.greenColor,
//         borderRadius: 100,
//     },
//     routeDotSecondary: {
//         width: 12,
//         height: 12,
//         backgroundColor: colors.secondaryColor,
//         borderRadius: 100,
//     },
//     routeTextBlock: {
//         flex: 1,
//     },
//     routeLabel: {
//         fontSize: 14,
//         fontWeight: '400',
//         lineHeight: 20,
//         color: colors.lightGreyColor,
//     },
//     routeAddress: {
//         fontSize: 16,
//         fontWeight: '500',
//         lineHeight: 24,
//         color: colors.whiteColor,
//     },

//     actionRow: {
//         flexDirection: 'row',
//         marginTop: 20,
//         alignItems: 'center',
//         justifyContent: 'space-between',
//     },
//     actionTile: {
//         width: 90,
//         height: 90,
//         borderWidth: 1,
//         borderColor: colors.whiteColor,
//         borderRadius: 15,
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: 8,
//     },
//     actionLabel: {
//         fontSize: 14,
//         fontWeight: '500',
//         lineHeight: 20,
//         color: colors.whiteColor,
//     },

//     driverHeader: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: 20,
//     },
//     profileImageWrapper: {
//         marginTop: -40,
//         backgroundColor: colors.primaryColor,
//         width: 138,
//         height: 138,
//         borderWidth: 1,
//         borderRadius: 32,
//         borderColor: colors.whiteColor,
//         overflow: 'hidden',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     profileImage: {
//         width: 126,
//         height: 126,
//         borderRadius: 30,
//     },
//     driverInfo: {
//         alignItems: 'flex-start',
//         justifyContent: 'space-evenly',
//         width: '50%',
//         height: 80,
//     },
//     divider: {
//         marginVertical: 20,
//         height: 1,
//         width: '100%',
//         backgroundColor: colors.lightGreyColor,
//     },
//     rideDetailsRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     rideDetailsLeft: {
//         alignItems: 'flex-start',
//         justifyContent: 'space-evenly',
//     },
//     actionButtons: {
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         gap: 20,
//     },
//     callButton: {
//         width: 50,
//         height: 50,
//         backgroundColor: colors.whiteColor,
//         borderRadius: 100,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },

//     cardTitle: {
//         fontSize: 16,
//         fontWeight: '400',
//         color: colors.whiteColor,
//     },
//     cardSubText: {
//         fontSize: 14,
//         fontWeight: '400',
//         color: colors.lightGreyColor,
//     },
//     underlineText: {
//         fontSize: 14,
//         fontWeight: '400',
//         color: colors.lightGreyColor,
//         textDecorationLine: 'underline',
//     },
//     infoRow: {
//         flexDirection: 'row',
//         gap: 8,
//     },
// });

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Map as MapView,
  Camera,
  GeoJSONSource as ShapeSource,
  Layer,
  Marker as MarkerView,
} from '@maplibre/maplibre-react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import CommonButton from '../../components/CommonButton';

const { width, height } = Dimensions.get('window');

const MAP_STYLE =
  'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const DEFAULT_CENTER = { latitude: 30.7333, longitude: 76.7794 };

const toGeoCoord = p => [p.longitude, p.latitude];

export default function RideScreen({ navigation, route }) {
  // Receive data from HomeScreen
  const {
    pickup = null,
    dropoff = null,
    selectedRide = 'economy',
    route: activeRoute = null,
  } = route?.params ?? {};

  const cameraRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const sheetAnim = useRef(new Animated.Value(0)).current;

  // ── Auto-navigate to PaymentScreen after 10s ────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('PaymentScreen');
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // ── Map loaded → fit route on screen ───────────────────────────────────────
  const cameraInitDone = useRef(false);
  const onMapLoaded = useCallback(() => {
    setMapLoaded(true);
    if (cameraInitDone.current) return;
    cameraInitDone.current = true;

    if (activeRoute?.coordinates && activeRoute.coordinates.length > 0) {
      // Fit camera to show full route
      let minLon = Infinity,
        maxLon = -Infinity,
        minLat = Infinity,
        maxLat = -Infinity;
      activeRoute.coordinates.forEach(([lon, lat]) => {
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      });
      const lonPad = Math.max((maxLon - minLon) * 0.22, 0.008);
      const latPad = Math.max((maxLat - minLat) * 0.22, 0.008);
      const centerLon = (minLon - lonPad + maxLon + lonPad) / 2;
      const centerLat = (minLat - latPad + maxLat + latPad) / 2;
      const latRad = (centerLat * Math.PI) / 180;
      const zFL = Math.log2(
        (width / 256) *
          (360 / ((maxLon - minLon + lonPad * 2) / Math.cos(latRad))),
      );
      const zFLat = Math.log2(
        ((height * 0.45) / 256) * (360 / (maxLat - minLat + latPad * 2)),
      );
      const zoomLevel = Math.max(
        8,
        Math.min(16, Math.floor(Math.min(zFL, zFLat)) - 1),
      );
      setTimeout(() => {
        cameraRef.current?.flyTo({
          center: [centerLon, centerLat],
          zoom: zoomLevel,
          duration: 800,
        });
      }, 300);
    } else {
      cameraRef.current?.jumpTo({
        center: toGeoCoord(DEFAULT_CENTER),
        zoom: 13,
      });
    }
  }, [activeRoute]);

  // ── Toggle map expand / sheet ───────────────────────────────────────────────
  const handleMapExpand = useCallback(() => {
    setIsMapExpanded(true);
    Animated.timing(sheetAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [sheetAnim]);

  const handleMapCollapse = useCallback(() => {
    Animated.timing(sheetAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setIsMapExpanded(false));
  }, [sheetAnim]);

  // ── GeoJSON ─────────────────────────────────────────────────────────────────
  const routeGeoJson = useMemo(() => {
    if (!activeRoute?.coordinates) return null;
    return {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: activeRoute.coordinates },
    };
  }, [activeRoute]);

  // Pickup midpoint marker (driver location simulation)
  const driverCoord = useMemo(() => {
    if (!activeRoute?.coordinates || activeRoute.coordinates.length < 2)
      return null;
    const mid = Math.floor(activeRoute.coordinates.length * 0.15);
    const [lon, lat] = activeRoute.coordinates[mid];
    return { latitude: lat, longitude: lon };
  }, [activeRoute]);

  return (
    <View style={styles.container}>
      {/* ── Full screen Map ── */}
      <MapView
        style={styles.map}
        mapStyle={MAP_STYLE}
        onDidFinishLoadingMap={onMapLoaded}
      >
        <Camera ref={cameraRef} />

        {mapLoaded && (
          <>
            {/* Route Rendering */}
            {routeGeoJson && (
              <>
                <ShapeSource id="routeShadow" data={routeGeoJson}>
                  <Layer
                    type="line"
                    id="routeShadowLayer"
                    style={{
                      lineColor: 'rgba(0,0,0,0.13)',
                      lineWidth: 10,
                      lineCap: 'round',
                      lineJoin: 'round',
                    }}
                  />
                </ShapeSource>
                <ShapeSource id="routeLine" data={routeGeoJson}>
                  <Layer
                    type="line"
                    id="routeLineLayer"
                    style={{
                      lineColor: '#2563eb',
                      lineWidth: 6,
                      lineCap: 'round',
                      lineJoin: 'round',
                      lineOpacity: 0.95,
                    }}
                  />
                </ShapeSource>
              </>
            )}

            {/* Pickup marker */}
            {pickup && (
              <MarkerView
                coordinate={toGeoCoord(pickup)}
                anchor={{ x: 0.5, y: 1 }}
              >
                <View style={styles.pickupMarker}>
                  <View style={styles.pickupMarkerDot} />
                </View>
              </MarkerView>
            )}

            {/* Dropoff marker */}
            {dropoff && (
              <MarkerView
                coordinate={toGeoCoord(dropoff)}
                anchor={{ x: 0.5, y: 1 }}
              >
                <View style={styles.dropoffMarker}>
                  <Text style={{ fontSize: 22 }}>📍</Text>
                </View>
              </MarkerView>
            )}

            {/* Simulated driver marker on route */}
            {driverCoord && (
              <MarkerView
                coordinate={toGeoCoord(driverCoord)}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={styles.carContainer}>
                  <View style={styles.carGlow} />
                  <Text style={styles.carEmoji}>🚕</Text>
                </View>
              </MarkerView>
            )}
          </>
        )}
      </MapView>

      {/* ── Top Bar Container (Dynamic Based on Map Clicked/Expanded) ── */}
      <SafeAreaView style={styles.topSectionOverlay} edges={['top']}>
        {isMapExpanded ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleMapCollapse}
            style={styles.closeButton}
          >
            <MaterialDesignIcons
              name="close"
              size={24}
              color={colors.blackColor}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.topSectionInner}>
            {/* Car Details Pill - Matched to Screenshot 2026-06-23 at 5.58.26 PM.jpg */}
            <View style={styles.carCardCustom}>
              <Image
                source={require('../../assets/images/car.png')}
                style={styles.carImageCustom}
                resizeMode="contain"
              />
              <View style={styles.carDetailsCustom}>
                <Text style={styles.cardTitleCustom}>Car Details</Text>
                <Text style={styles.cardSubTextCustom}>Lexus LS</Text>
                <Text style={styles.cardSubTextCustom}>TN 01 AN 2435</Text>
              </View>
            </View>

            {/* Arrival Status Capsule - Matched to Screenshot 2026-06-23 at 5.58.26 PM.jpg */}
            <View style={styles.arrivalCardCustom}>
              <Text style={styles.arrivalTextCustom}>
                Your Driver is Arriving In 3 Minutes from Now
              </Text>
            </View>
          </View>
        )}
      </SafeAreaView>

      {/* ── Bottom Section Sheets (Swaps design smoothly) ── */}
      <View style={styles.bottomSectionOverlay}>
        {isMapExpanded ? (
          /* Map Active View Layout */
          <View style={[styles.driverCardCustom, styles.driverCardMapActive]}>
            <View style={styles.dragHandleCustom} />

            <View style={styles.arrivalRowMapActive}>
              <View>
                <Text style={styles.arrivalMinutesMapActive}>12 min</Text>
                <Text style={styles.arrivalTimeMapActive}>
                  Arriving at 10:53 AM
                </Text>
              </View>
              <View style={styles.shareIconPill}>
                <MaterialDesignIcons
                  name="share"
                  size={26}
                  color={colors.whiteColor}
                />
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('DriverDetailsScreen')}
              style={styles.driverRowMapActive}
            >
              <Image
                source={require('../../assets/images/profile.png')}
                style={styles.driverThumbMapActive}
                resizeMode="cover"
              />
              <View>
                <View style={styles.driverNameRowMapActive}>
                  <Text style={styles.driverNameMapActive}>Jenny Nolan</Text>
                  <Text style={styles.driverRatingMapActive}>⭐️ 4.89</Text>
                </View>
                <Text style={styles.driverVehicleMapActive}>
                  Toyota Camry • ABC 123
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.routeCardMapActive}>
              <View style={styles.routeRowMapActive}>
                <View style={styles.routeDotGreenMapActive} />
                <View style={styles.routeTextBlockMapActive}>
                  <Text style={styles.routeLabelMapActive}>Pickup</Text>
                  <Text numberOfLines={1} style={styles.routeAddressMapActive}>
                    {pickup?.label ?? 'Independence Avenue, Central CBD'}
                  </Text>
                </View>
              </View>
              <View style={styles.routeRowMapActive}>
                <View style={styles.routeDotSecondaryMapActive} />
                <View style={styles.routeTextBlockMapActive}>
                  <Text style={styles.routeLabelMapActive}>Drop-off</Text>
                  <Text numberOfLines={1} style={styles.routeAddressMapActive}>
                    {dropoff?.label ?? 'Sam Nujoma Dr, Klein Windhoek'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.actionRowMapActive}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.actionTileMapActive}
              >
                <MaterialDesignIcons
                  name="message"
                  size={24}
                  color={colors.secondaryColor}
                />
                <Text style={styles.actionLabelMapActive}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.actionTileMapActive}
              >
                <MaterialDesignIcons
                  name="call"
                  size={24}
                  color={colors.secondaryColor}
                />
                <Text style={styles.actionLabelMapActive}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.actionTileMapActive}
              >
                <MaterialDesignIcons
                  name="privacy-tip"
                  size={24}
                  color={colors.secondaryColor}
                />
                <Text style={styles.actionLabelMapActive}>Safety</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Default Premium Layout - Matched to Screenshot 2026-06-23 at 5.58.13 PM.jpg */
          <View
            style={styles.driverCardCustom}
            onTouchStart={() => handleMapExpand()}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.driverHeaderCustom}
              onPress={() => navigation.navigate('DriverDetailsScreen')}
            >
              <View style={styles.profileImageWrapperCustom}>
                <Image
                  source={require('../../assets/images/profile.png')}
                  style={styles.profileImageCustom}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.driverInfoCustom}>
                <Text style={styles.cardTitleCustom}>Driver Details</Text>
                <View style={styles.infoRowCustom}>
                  <Text style={styles.cardSubTextLeft}>Name :</Text>
                  <Text style={styles.cardSubTextRight}>Alan</Text>
                </View>
                <View style={styles.infoRowCustom}>
                  <Text style={styles.cardSubTextLeft}>Age :</Text>
                  <Text style={styles.cardSubTextRight}>28</Text>
                </View>
                <View style={styles.infoRowCustom}>
                  <Text style={styles.cardSubTextLeft}>Mobile :</Text>
                  <Text style={styles.cardSubTextRight}>0000000000</Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.dividerCustom} />

            <View style={styles.rideDetailsContainerCustom}>
              <View style={styles.rideDetailsLeftCustom}>
                <Text style={styles.cardTitleCustom}>Ride Details</Text>
                <View style={styles.infoRowCustom}>
                  <Text style={styles.cardSubTextLeft}>
                    Total No of Rides :
                  </Text>
                  <Text style={styles.cardSubTextRight}>334</Text>
                </View>
                <View style={styles.ratingRowCustom}>
                  <Text style={styles.starsTextCustom}>
                    ⭐️ ⭐️ ⭐️ ⭐️ ⭐️
                  </Text>
                  <Text style={styles.ratingCountCustom}>
                    ( 310+ Ratings & Reviews )
                  </Text>
                </View>
                <Text style={styles.textDriverPromptCustom}>
                  Text the Driver{' '}
                  <Text style={styles.underlineTextCustom}>here</Text>
                </Text>
              </View>

              {/* Floating circular utility buttons matching image layout */}
              <View style={styles.floatingActionButtonsCustom}>
                <TouchableOpacity
                  style={styles.circularCallButtonCustom}
                  activeOpacity={0.8}
                >
                  <MaterialDesignIcons name="call" size={28} color="#FFB300" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.msgIconInvertCustom}
                  activeOpacity={0.8}
                >
                  <MaterialDesignIcons
                    name="chat-bubble-outline"
                    size={26}
                    color={colors.whiteColor}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Global Cancel Button directly underneath the conditional frames */}
        <CommonButton
          title="Cancel Ride"
          textColor={colors.whiteColor}
          color={colors.redColor}
          onPress={() => navigation.goBack()}
          style={styles.globalCancelBtn}
        />
      </View>
    </View>
  );
}

// ─── Refined Premium Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  map: { flex: 1 },

  // Map markers styling
  pickupMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupMarkerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  dropoffMarker: { alignItems: 'center', justifyContent: 'center' },
  carContainer: { alignItems: 'center', justifyContent: 'center' },
  carGlow: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(37,99,235,0.2)',
  },
  carEmoji: { fontSize: 26 },

  // Absolute Overlay Layout Structures
  topSectionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
  },
  topSectionInner: {
    gap: 16,
    marginTop: 8,
  },
  bottomSectionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    gap: 12,
  },

  // Close map button layout
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    alignSelf: 'flex-start',
    marginTop: 10,
  },

  // Car Details Card Custom Style (Screenshot 2026-06-23 at 5.58.26 PM.jpg)
  carCardCustom: {
    backgroundColor: 'rgba(46, 49, 146, 0.9)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 16,
  },
  carImageCustom: {
    width: width * 0.35,
    height: 75,
  },
  carDetailsCustom: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitleCustom: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardSubTextCustom: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },

  // Arrival Status Capsule Custom Style (Screenshot 2026-06-23 at 5.58.26 PM.jpg)
  arrivalCardCustom: {
    backgroundColor: 'rgba(46, 49, 146, 0.85)',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrivalTextCustom: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Main Premium Bottom Card Custom Style (Screenshot 2026-06-23 at 5.58.13 PM.jpg)
  driverCardCustom: {
    backgroundColor: 'rgba(46, 49, 146, 0.92)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: -5 },
    elevation: 10,
  },
  driverCardMapActive: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
  },
  driverHeaderCustom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  profileImageWrapperCustom: {
    width: 90,
    height: 90,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#ffffff',
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
  },
  profileImageCustom: {
    width: '100%',
    height: '100%',
  },
  driverInfoCustom: {
    flex: 1,
  },
  infoRowCustom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cardSubTextLeft: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    width: 110,
  },
  cardSubTextRight: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  dividerCustom: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 16,
  },
  rideDetailsContainerCustom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  rideDetailsLeftCustom: {
    flex: 1,
  },
  ratingRowCustom: {
    marginTop: 6,
    gap: 2,
  },
  starsTextCustom: {
    fontSize: 13,
    color: '#FFB300',
  },
  ratingCountCustom: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  textDriverPromptCustom: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 12,
  },
  underlineTextCustom: {
    textDecorationLine: 'underline',
    color: '#ffffff',
    fontWeight: '700',
  },

  // Circle Interactive Floating Buttons on Right Side
  floatingActionButtonsCustom: {
    alignItems: 'center',
    gap: 16,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  circularCallButtonCustom: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  msgIconInvertCustom: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Map Active State Specific Bottom Sheet Components
  dragHandleCustom: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#e5e7eb',
    alignSelf: 'center',
    marginBottom: 14,
  },
  arrivalRowMapActive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  arrivalMinutesMapActive: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  arrivalTimeMapActive: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  shareIconPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverRowMapActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  driverThumbMapActive: { width: 46, height: 46, borderRadius: 23 },
  driverNameRowMapActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  driverNameMapActive: { fontSize: 15, fontWeight: '700', color: '#111827' },
  driverRatingMapActive: { fontSize: 13 },
  driverVehicleMapActive: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  routeCardMapActive: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 10,
  },
  routeRowMapActive: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  routeDotGreenMapActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
    marginTop: 4,
  },
  routeDotSecondaryMapActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563eb',
    marginTop: 4,
  },
  routeTextBlockMapActive: { flex: 1 },
  routeLabelMapActive: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
  },
  routeAddressMapActive: {
    fontSize: 13,
    color: '#111827',
    marginTop: 2,
    fontWeight: '500',
  },
  actionRowMapActive: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  actionTileMapActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    paddingVertical: 12,
    gap: 4,
  },
  actionLabelMapActive: { fontSize: 12, fontWeight: '600', color: '#374151' },
  globalCancelBtn: {
    marginTop: 4,
  },
});
