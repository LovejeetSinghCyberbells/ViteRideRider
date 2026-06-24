import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  Keyboard,
  PermissionsAndroid,
  Platform,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Map as MapView,
  Camera,
  GeoJSONSource as ShapeSource,
  Layer,
} from '@maplibre/maplibre-react-native';
import Geolocation from 'react-native-geolocation-service';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';

const { width, height } = Dimensions.get('window');
const OSRM_URL = 'https://router.project-osrm.org';
const PHOTON_URL = 'https://photon.komoot.io';
const MAP_STYLE =
  'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const DEFAULT_CENTER = {
  latitude: -1.2921,
  longitude: 36.8219,
};
const CACHE_TTL = 5 * 60 * 1000;

const RIDE_OPTIONS = [
  {
    id: 'economy',
    label: 'Economy',
    icon: 'directions-car',
    eta: '3 min',
    pricePerKm: 12,
  },
  {
    id: 'premium',
    label: 'Premium',
    icon: 'directions-car',
    eta: '5 min',
    pricePerKm: 18,
  },
  {
    id: 'pool',
    label: 'Pool',
    icon: 'directions-car',
    eta: '7 min',
    pricePerKm: 8,
  },
];

const ROUTE_COLORS = [colors.primaryColor || '#2563eb', '#94a3b8', '#0d9488'];
const ROUTE_COLORS_INACTIVE = ['#93c5fd', '#cbd5e1', '#5eead4'];

const searchCache = new Map();

const toGeoCoord = p => [p.longitude, p.latitude];

const haversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const safeJsonParse = async response => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

const usePermission = () => {
  const requestLocation = useCallback(async () => {
    if (Platform.OS === 'ios') {
      return new Promise(resolve => {
        Geolocation.requestAuthorization('whenInUse');
        setTimeout(() => resolve(true), 300);
      });
    }
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Allow access to your location',
          buttonPositive: 'Allow',
        },
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  }, []);
  return { requestLocation };
};

const AnimatedSuggestionRow = React.memo(({ item, onPress, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 120,
        delay: index * 25,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 90,
        friction: 10,
        delay: index * 25,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
    >
      <TouchableOpacity
        style={styles.suggestionRow}
        onPress={() => onPress(item)}
        activeOpacity={0.55}
      >
        <View style={styles.suggestionIcon}>
          <Text style={{ fontSize: 14 }}>📍</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.suggestionMain} numberOfLines={1}>
            {item.name}
          </Text>
          {item.subtext ? (
            <Text style={styles.suggestionSub} numberOfLines={1}>
              {item.subtext}
            </Text>
          ) : null}
        </View>
        <Text style={styles.suggestionDist}>{item.distLabel ?? ''}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

// ─── HomeScreen ───────────────────────────────────────────────────────────────
export default function HomeScreen({ navigation }) {
  const cameraRef = useRef(null);
  const { requestLocation } = usePermission();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Profile data config
  const [userProfile, setUserProfile] = useState({
    name: 'Aman',
    photo: null,
  });

  // Map state
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [driverPosition, setDriverPosition] = useState(null);
  const [currentLocationAddress, setCurrentLocationAddress] =
    useState('Locating...');

  // Search state
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [pickupText, setPickupText] = useState('');
  const [dropoffText, setDropoffText] = useState('');
  const [activeField, setActiveField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLocating, setIsLocating] = useState(false);

  // Route state
  const [routes, setRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const activeRoute = routes[selectedRouteIndex] ?? null;

  // Ride modal state
  const [selectedRide, setSelectedRide] = useState('economy');
  const [showRideModal, setShowRideModal] = useState(false);
  const modalAnim = useRef(new Animated.Value(300)).current;

  const searchQuery = activeField === 'pickup' ? pickupText : dropoffText;
  const debouncedQuery = useDebounce(searchQuery, 220);

  // ── Map init ────────────────────────────────────────────────────────────────
  const cameraInitDone = useRef(false);
  const onMapLoaded = useCallback(() => {
    if (!isMounted.current) return;
    setMapLoaded(true);
    if (cameraInitDone.current) return;
    cameraInitDone.current = true;
    try {
      cameraRef.current?.jumpTo({ center: toGeoCoord(mapCenter), zoom: 13 });
    } catch (e) {
      console.warn('[HomeScreen] jumpTo skipped:', e.message);
    }
  }, [mapCenter]);

  // Fetches position and updates text description for top display block
  useEffect(() => {
    (async () => {
      const ok = await requestLocation();
      if (!ok) {
        if (isMounted.current) setCurrentLocationAddress('Permission Denied');
        return;
      }
      Geolocation.getCurrentPosition(
        async ({ coords }) => {
          if (!isMounted.current) return;
          const currentLoc = {
            latitude: coords.latitude,
            longitude: coords.longitude,
          };
          setMapCenter(currentLoc);
          try {
            cameraRef.current?.flyTo({
              center: [currentLoc.longitude, currentLoc.latitude],
              zoom: 14,
              duration: 600,
            });
          } catch (e) {
            console.warn('[HomeScreen] flyTo skipped:', e.message);
          }

          try {
            const res = await fetch(
              `${PHOTON_URL}/reverse?lon=${currentLoc.longitude}&lat=${currentLoc.latitude}`,
            );
            const data = await safeJsonParse(res);
            if (!isMounted.current) return;
            if (data?.features?.[0]?.properties) {
              const props = data.features[0].properties;
              const street = props.name || props.street || 'Current Area';
              const city = props.city || props.state || '';
              setCurrentLocationAddress(city ? `${street}, ${city}` : street);
            } else {
              setCurrentLocationAddress('Location Found');
            }
          } catch {
            if (isMounted.current) setCurrentLocationAddress('Location Found');
          }
        },
        error => {
          console.log('Initial location fetch failed:', error);
          if (isMounted.current)
            setCurrentLocationAddress('Location Unavailable');
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 },
      );
    })();
  }, [requestLocation]);

  useEffect(() => {
    (async () => {
      const ok = await requestLocation();
      if (!ok) return;
      Geolocation.getCurrentPosition(
        ({ coords }) => {
          if (!isMounted.current) return;
          setDriverPosition({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
        },
        () => {},
        { enableHighAccuracy: false, timeout: 5000 },
      );
    })();
  }, [requestLocation]);

  // ── Ride modal animation ────────────────────────────────────────────────────
  const openRideModal = useCallback(() => {
    setShowRideModal(true);
    Animated.spring(modalAnim, {
      toValue: 0,
      tension: 70,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [modalAnim]);

  const closeRideModal = useCallback(() => {
    Animated.timing(modalAnim, {
      toValue: 300,
      duration: 220,
      useNativeDriver: true,
    }).start(() => setShowRideModal(false));
  }, [modalAnim]);

  // ── Place search ────────────────────────────────────────────────────────────
  const searchPlaces = useCallback(async (query, lat, lon, signal) => {
    if (!query || query.length < 2) return [];
    const cacheKey = `${query}_${Math.floor(lat * 10)}_${Math.floor(lon * 10)}`;
    const cached = searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.data;
    try {
      const [searchRes, reverseRes] = await Promise.all([
        fetch(
          `${PHOTON_URL}/api?q=${encodeURIComponent(
            query,
          )}&limit=8&lat=${lat}&lon=${lon}&lang=en`,
          { signal },
        ),
        fetch(`${PHOTON_URL}/reverse?lon=${lon}&lat=${lat}&limit=3`, {
          signal,
        }),
      ]);
      const [searchData, reverseData] = await Promise.all([
        safeJsonParse(searchRes),
        safeJsonParse(reverseRes),
      ]);
      const results = [];
      (reverseData?.features ?? []).forEach(f => {
        if (f.properties && f.geometry) {
          const d = haversineKm(
            lat,
            lon,
            f.geometry.coordinates[1],
            f.geometry.coordinates[0],
          );
          results.push({
            id: `rev_${f.properties.osm_id ?? Date.now()}`,
            name: f.properties.name || f.properties.street || 'Current Area',
            subtext:
              [f.properties.city, f.properties.state, f.properties.country]
                .filter(Boolean)
                .join(', ') || 'Near you',
            latitude: f.geometry.coordinates[1],
            longitude: f.geometry.coordinates[0],
            distLabel:
              d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`,
            priority: 1,
          });
        }
      });
      (searchData?.features ?? []).forEach(f => {
        if (f.properties?.name && f.geometry) {
          const d = haversineKm(
            lat,
            lon,
            f.geometry.coordinates[1],
            f.geometry.coordinates[0],
          );
          results.push({
            id: f.properties.osm_id ?? `${f.properties.name}_${Date.now()}`,
            name: f.properties.name,
            subtext:
              [f.properties.city, f.properties.state, f.properties.country]
                .filter(Boolean)
                .join(', ') ||
              f.properties.type ||
              'Location',
            latitude: f.geometry.coordinates[1],
            longitude: f.geometry.coordinates[0],
            distLabel:
              d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`,
            priority: 0,
          });
        }
      });
      const unique = results.filter(
        (v, i, a) =>
          a.findIndex(
            t =>
              t.name === v.name && Math.abs(t.latitude - v.latitude) < 0.0001,
          ) === i,
      );
      const sorted = unique
        .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))
        .slice(0, 7);
      if (sorted.length > 0)
        searchCache.set(cacheKey, { data: sorted, timestamp: Date.now() });
      return sorted;
    } catch (err) {
      if (err.name !== 'AbortError')
        console.warn('[searchPlaces] Error:', err.message);
      return [];
    }
  }, []);

  useEffect(() => {
    if (!activeField || !debouncedQuery || debouncedQuery.length < 2) {
      setSuggestions([]);
      setIsSearchingPlaces(false);
      return;
    }
    const controller = new AbortController();
    setIsSearchingPlaces(true);
    (async () => {
      const results = await searchPlaces(
        debouncedQuery,
        mapCenter.latitude,
        mapCenter.longitude,
        controller.signal,
      );
      if (!controller.signal.aborted) {
        setSuggestions(results);
        setIsSearchingPlaces(false);
      }
    })();
    return () => controller.abort();
  }, [debouncedQuery, activeField, mapCenter, searchPlaces]);

  // ── Route fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!pickup || !dropoff) {
      setRoutes([]);
      setSelectedRouteIndex(0);
      return;
    }
    const controller = new AbortController();
    (async () => {
      try {
        const url = `${OSRM_URL}/route/v1/driving/${pickup.longitude},${pickup.latitude};${dropoff.longitude},${dropoff.latitude}?overview=full&geometries=geojson&alternatives=3`;
        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const processed = data.routes.map((route, index) => ({
            id: index,
            coordinates: route.geometry.coordinates,
            distance: Number((route.distance / 1000).toFixed(1)),
            duration: Math.ceil(route.duration / 60),
          }));
          setRoutes(processed);
          setSelectedRouteIndex(0);
          showFullRouteForCoords(processed[0].coordinates);
        }
      } catch (err) {
        if (err.name !== 'AbortError')
          console.warn('[RouteEffect] Error:', err.message);
      }
    })();
    return () => controller.abort();
  }, [pickup, dropoff]);

  const showFullRouteForCoords = useCallback(coords => {
    if (!coords || coords.length === 0) return;
    let minLon = Infinity,
      maxLon = -Infinity,
      minLat = Infinity,
      maxLat = -Infinity;
    coords.forEach(([lon, lat]) => {
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
      ((height * 0.48) / 256) * (360 / (maxLat - minLat + latPad * 2)),
    );
    const zoomLevel = Math.max(
      8,
      Math.min(16, Math.floor(Math.min(zFL, zFLat)) - 1),
    );
    if (!isMounted.current || !cameraRef.current) return;
    try {
      cameraRef.current.flyTo({
        center: [centerLon, centerLat],
        zoom: zoomLevel,
        duration: 850,
      });
    } catch (e) {
      console.warn('[HomeScreen] showFullRoute flyTo skipped:', e.message);
    }
  }, []);

  // ── My location ─────────────────────────────────────────────────────────────
  const moveToMyLocation = useCallback(async () => {
    const ok = await requestLocation();
    if (!ok) return;
    if (isMounted.current) setIsLocating(true);
    Geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        if (!isMounted.current) return;
        setDriverPosition({ latitude, longitude });
        try {
          cameraRef.current?.flyTo({
            center: [longitude, latitude],
            zoom: 16,
            duration: 700,
          });
        } catch (e) {
          console.warn('[HomeScreen] myLocation flyTo skipped:', e.message);
        }
        try {
          const res = await fetch(
            `${PHOTON_URL}/reverse?lon=${longitude}&lat=${latitude}`,
          );
          const data = await safeJsonParse(res);
          if (!isMounted.current) return;
          const name =
            data?.features?.[0]?.properties?.name ?? 'Current Location';
          setPickup({ latitude, longitude, label: name });
          setPickupText(name);
        } catch {
          if (!isMounted.current) return;
          setPickup({ latitude, longitude, label: 'Current Location' });
          setPickupText('Current Location');
        } finally {
          if (isMounted.current) setIsLocating(false);
        }
      },
      () => {
        if (isMounted.current) setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 },
    );
  }, [requestLocation]);

  // ── Swap ────────────────────────────────────────────────────────────────────
  const handleSwap = useCallback(() => {
    setPickup(dropoff);
    setDropoff(pickup);
    setPickupText(dropoffText);
    setDropoffText(pickupText);
  }, [pickup, dropoff, pickupText, dropoffText]);

  // ── Select suggestion ───────────────────────────────────────────────────────
  const selectSuggestion = useCallback(
    item => {
      Keyboard.dismiss();
      const pt = {
        latitude: item.latitude,
        longitude: item.longitude,
        label: item.name,
      };
      setRecentSearches(prev =>
        [item, ...prev.filter(s => s.name !== item.name)].slice(0, 5),
      );
      if (activeField === 'pickup') {
        setPickup(pt);
        setPickupText(item.name);
      } else {
        setDropoff(pt);
        setDropoffText(item.name);
      }
      setSuggestions([]);
      setActiveField(null);
      if (!isMounted.current || !cameraRef.current) return;
      try {
        cameraRef.current.flyTo({
          center: [item.longitude, item.latitude],
          zoom: 15,
          duration: 700,
        });
      } catch (e) {
        console.warn('[HomeScreen] suggestion flyTo skipped:', e.message);
      }
    },
    [activeField],
  );

  // ── GeoJSON for route ───────────────────────────────────────────────────────
  const routeGeoJsonList = useMemo(() => {
    if (routes.length === 0) return [];
    return routes.map((route, index) => ({
      id: index,
      isSelected: index === selectedRouteIndex,
      color: ROUTE_COLORS[index] ?? ROUTE_COLORS[2],
      inactiveColor: ROUTE_COLORS_INACTIVE[index] ?? ROUTE_COLORS_INACTIVE[2],
      geoJson: {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: route.coordinates },
      },
    }));
  }, [routes, selectedRouteIndex]);

  // ── Marker GeoJSON (native layers, no Marker component) ────────────────────
  const pickupGeoJson = useMemo(() => {
    if (!pickup) return null;
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [pickup.longitude, pickup.latitude],
      },
      properties: { label: 'PICKUP' },
    };
  }, [pickup]);

  const dropoffGeoJson = useMemo(() => {
    if (!dropoff) return null;
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [dropoff.longitude, dropoff.latitude],
      },
      properties: { label: 'DROP' },
    };
  }, [dropoff]);

  const driverGeoJson = useMemo(() => {
    if (!driverPosition) return null;
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [driverPosition.longitude, driverPosition.latitude],
      },
      properties: {},
    };
  }, [driverPosition]);

  // ── Fare calculation ────────────────────────────────────────────────────────
  const getFare = useCallback(
    rideId => {
      const ride = RIDE_OPTIONS.find(r => r.id === rideId);
      if (!activeRoute || !ride) return '—';
      const fare = Math.round(activeRoute.distance * ride.pricePerKm);
      return `$${fare}-${fare + 4}`;
    },
    [activeRoute],
  );

  const handleConfirmPickup = useCallback(() => {
    if (!pickup || !dropoff) return;
    closeRideModal();
    navigation.navigate('RideScreen', {
      pickup: pickup,
      dropoff: dropoff,
      selectedRide,
      route: activeRoute,
    });
  }, [pickup, dropoff, selectedRide, activeRoute, navigation, closeRideModal]);

  return (
    <View style={styles.container}>
      {/* ── Full screen Map ── */}
      <MapView
        style={styles.map}
        mapStyle={MAP_STYLE}
        onDidFinishLoadingMap={onMapLoaded}
        onRegionDidChange={event => {
          const { center } = event.nativeEvent;
          const [lon, lat] = center;
          setMapCenter({ latitude: lat, longitude: lon });
        }}
      >
        <Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: toGeoCoord(DEFAULT_CENTER),
            zoomLevel: 13,
          }}
        />

        {/* Inactive Route lines - Render directly when map is loaded */}
        {mapLoaded &&
          routeGeoJsonList
            .filter(r => !r.isSelected)
            .map(r => (
              <React.Fragment key={`route_inactive_${r.id}`}>
                <ShapeSource id={`routeShadow_${r.id}`} data={r.geoJson}>
                  <Layer
                    type="line"
                    id={`routeShadowLayer_${r.id}`}
                    style={{
                      lineColor: 'rgba(0,0,0,0.08)',
                      lineWidth: 7,
                      lineCap: 'round',
                      lineJoin: 'round',
                    }}
                  />
                </ShapeSource>
                <ShapeSource id={`route_inactive_${r.id}`} data={r.geoJson}>
                  <Layer
                    type="line"
                    id={`routeInactiveLayer_${r.id}`}
                    style={{
                      lineColor: r.inactiveColor,
                      lineWidth: 4,
                      lineCap: 'round',
                      lineJoin: 'round',
                      lineOpacity: 0.75,
                    }}
                  />
                </ShapeSource>
              </React.Fragment>
            ))}

        {/* Active Route lines - Render directly */}
        {mapLoaded &&
          routeGeoJsonList
            .filter(r => r.isSelected)
            .map(r => (
              <React.Fragment key={`route_sel_${r.id}`}>
                <ShapeSource id="routeShadow_sel" data={r.geoJson}>
                  <Layer
                    type="line"
                    id="routeShadowLayer_sel"
                    style={{
                      lineColor: 'rgba(0,0,0,0.14)',
                      lineWidth: 10,
                      lineCap: 'round',
                      lineJoin: 'round',
                    }}
                  />
                </ShapeSource>
                <ShapeSource id="route_sel" data={r.geoJson}>
                  <Layer
                    type="line"
                    id="routeLayer_sel"
                    style={{
                      lineColor: r.color,
                      lineWidth: 6,
                      lineCap: 'round',
                      lineJoin: 'round',
                      lineOpacity: 0.95,
                    }}
                  />
                </ShapeSource>
              </React.Fragment>
            ))}

        {/* ── Pickup marker (native CircleLayer + SymbolLayer) ── */}
        {mapLoaded && pickupGeoJson && (
          <React.Fragment>
            {/* Outer white ring */}
            <ShapeSource id="pickupSource" data={pickupGeoJson}>
              <Layer
                type="circle"
                id="pickupCircleOuter"
                style={{
                  circleRadius: 14,
                  circleColor: '#ffffff',
                  circleStrokeWidth: 4,
                  circleStrokeColor: '#22c55e',
                  circlePitchAlignment: 'map',
                }}
              />
            </ShapeSource>
            {/* Inner green dot */}
            <ShapeSource id="pickupDotSource" data={pickupGeoJson}>
              <Layer
                type="circle"
                id="pickupCircleInner"
                style={{
                  circleRadius: 5,
                  circleColor: '#22c55e',
                  circlePitchAlignment: 'map',
                }}
              />
            </ShapeSource>
            {/* PICKUP label above */}
            <ShapeSource id="pickupLabelSource" data={pickupGeoJson}>
              <Layer
                type="symbol"
                id="pickupLabel"
                style={{
                  textField: 'PICKUP',
                  textSize: 11,
                  textColor: '#ffffff',
                  textHaloColor: '#22c55e',
                  textHaloWidth: 2,
                  textOffset: [0, -2.2],
                  textAnchor: 'bottom',
                  symbolZOrder: 'auto',
                }}
              />
            </ShapeSource>
          </React.Fragment>
        )}

        {/* ── Dropoff marker (native CircleLayer + SymbolLayer) ── */}
        {mapLoaded && dropoffGeoJson && (
          <React.Fragment>
            {/* Red pin circle */}
            <ShapeSource id="dropoffSource" data={dropoffGeoJson}>
              <Layer
                type="circle"
                id="dropoffCircle"
                style={{
                  circleRadius: 14,
                  circleColor: '#ef4444',
                  circleStrokeWidth: 3,
                  circleStrokeColor: '#ffffff',
                  circlePitchAlignment: 'map',
                }}
              />
            </ShapeSource>
            {/* White center dot */}
            <ShapeSource id="dropoffDotSource" data={dropoffGeoJson}>
              <Layer
                type="circle"
                id="dropoffDot"
                style={{
                  circleRadius: 5,
                  circleColor: '#ffffff',
                  circlePitchAlignment: 'map',
                }}
              />
            </ShapeSource>
            {/* DROP label above */}
            <ShapeSource id="dropoffLabelSource" data={dropoffGeoJson}>
              <Layer
                type="symbol"
                id="dropoffLabel"
                style={{
                  textField: 'DROP',
                  textSize: 11,
                  textColor: '#ffffff',
                  textHaloColor: '#ef4444',
                  textHaloWidth: 2,
                  textOffset: [0, -2.2],
                  textAnchor: 'bottom',
                  symbolZOrder: 'auto',
                }}
              />
            </ShapeSource>
          </React.Fragment>
        )}

        {/* ── Driver / taxi marker ── */}
        {mapLoaded && driverGeoJson && (
          <React.Fragment>
            <ShapeSource id="driverGlowSource" data={driverGeoJson}>
              <Layer
                type="circle"
                id="driverGlow"
                style={{
                  circleRadius: 20,
                  circleColor: 'rgba(37,99,235,0.18)',
                  circlePitchAlignment: 'map',
                }}
              />
            </ShapeSource>
            <ShapeSource id="driverSource" data={driverGeoJson}>
              <Layer
                type="symbol"
                id="driverEmoji"
                style={{
                  textField: '🚕',
                  textSize: 26,
                  textAnchor: 'center',
                  symbolZOrder: 'auto',
                }}
              />
            </ShapeSource>
          </React.Fragment>
        )}
      </MapView>
      <SafeAreaView style={styles.searchPanelSafe} edges={['top']}>
        <View style={styles.locationProfileHeader}>
          <View style={styles.locationHeaderLeft}>
            <View style={styles.yellowPinWrapper}>
              <MaterialDesignIcons
                name="location-on"
                size={28}
                color="#eab308"
              />
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationHeadingMain}>Current Location</Text>
              <Text style={styles.locationHeadingSub} numberOfLines={1}>
                {currentLocationAddress}
              </Text>
            </View>
          </View>

          {/* Profile Picture / Letter initial Fallback wrapper */}
          <TouchableOpacity
            style={styles.profileAvatarFrame}
            activeOpacity={0.75}
          >
            {userProfile.photo ? (
              <Image
                source={{ uri: userProfile.photo }}
                style={styles.avatarImageSrc}
              />
            ) : (
              <Text style={styles.avatarLetterFallback}>
                {userProfile.name
                  ? userProfile.name.charAt(0).toUpperCase()
                  : 'A'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Floating input layout frame container */}
        <View style={styles.searchPanelContainer}>
          <View style={styles.routeCard}>
            {/* Left side circle pins and path */}
            <View style={styles.routeIconColumn}>
              <View style={styles.routeIconCircle}>
                <MaterialDesignIcons
                  name="near-me"
                  size={24}
                  color={colors.secondaryColor}
                />
              </View>
              <View style={styles.dotLine} />

              <TouchableOpacity
                style={styles.swapIconBtn}
                onPress={handleSwap}
                hitSlop={8}
              >
                <Text style={styles.swapIconText}>⇅</Text>
              </TouchableOpacity>

              <View style={styles.dotLine} />
              <View style={styles.routeIconCircle}>
                <MaterialDesignIcons
                  name="location-on"
                  size={24}
                  color={colors.secondaryColor}
                />
              </View>
            </View>

            {/* Right side functional text inputs box layout */}
            <View style={styles.routeInputColumn}>
              <View
                style={[
                  styles.routeInputBox,
                  activeField === 'pickup' && styles.routeInputBoxActive,
                ]}
              >
                <TextInput
                  style={styles.routeInputText}
                  placeholder="Pickup location"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={pickupText}
                  onChangeText={setPickupText}
                  onFocus={() => setActiveField('pickup')}
                  returnKeyType="search"
                />
                <TouchableOpacity
                  onPress={moveToMyLocation}
                  style={styles.locateInputBtn}
                  hitSlop={8}
                >
                  {isLocating ? (
                    <ActivityIndicator
                      color={colors.secondaryColor}
                      size="small"
                    />
                  ) : (
                    <Text style={{ fontSize: 16 }}>🎯</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.routeInputBox,
                  activeField === 'dropoff' && styles.routeInputBoxActive,
                ]}
              >
                <TextInput
                  style={styles.routeInputText}
                  placeholder="Destination"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  value={dropoffText}
                  onChangeText={setDropoffText}
                  onFocus={() => setActiveField('dropoff')}
                  returnKeyType="search"
                />
              </View>
            </View>
          </View>

          {/* Place Search List Suggestions layout elements inside the panel */}
          {!isSearchingPlaces &&
            suggestions.length === 0 &&
            recentSearches.length > 0 &&
            activeField &&
            !debouncedQuery && (
              <View style={styles.recentSection}>
                <Text style={styles.recentTitle}>RECENT</Text>
                {recentSearches.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.recentItem}
                    onPress={() => selectSuggestion(item)}
                  >
                    <Text style={styles.recentIcon}>🕐</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.recentName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      {item.subtext && (
                        <Text style={styles.recentSub} numberOfLines={1}>
                          {item.subtext}
                        </Text>
                      )}
                    </View>
                    {item.distLabel && (
                      <Text style={styles.distLabel}>{item.distLabel}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

          {/* Search loading Indicator */}
          {isSearchingPlaces && (
            <View style={styles.searchLoader}>
              <ActivityIndicator size="small" color={colors.secondaryColor} />
              <Text style={styles.searchLoaderText}>Searching…</Text>
            </View>
          )}
          {!isSearchingPlaces && suggestions.length > 0 && (
            <FlatList
              data={suggestions}
              keyExtractor={item => String(item.id)}
              renderItem={({ item, index }) => (
                <AnimatedSuggestionRow
                  item={item}
                  onPress={selectSuggestion}
                  index={index}
                />
              )}
              showsVerticalScrollIndicator={false}
              style={styles.suggestionsList}
              keyboardShouldPersistTaps="handled"
              removeClippedSubviews
              maxToRenderPerBatch={6}
              initialNumToRender={6}
            />
          )}
        </View>
      </SafeAreaView>

      {/* ── FAB: My location ── */}
      <View style={styles.fabGroup}>
        <TouchableOpacity
          style={styles.fab}
          onPress={moveToMyLocation}
          activeOpacity={0.8}
        >
          {isLocating ? (
            <ActivityIndicator color="#1a1a1a" size="small" />
          ) : (
            <Text style={{ fontSize: 20 }}>📍</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.fab}
          onPress={() =>
            cameraRef.current?.easeTo({ bearing: 0, duration: 400 })
          }
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 20 }}>🧭</Text>
        </TouchableOpacity>
      </View>

      {/* ── Ride Modal (bottom sheet) ── */}
      {showRideModal && (
        <Animated.View
          style={[styles.rideModal, { transform: [{ translateY: modalAnim }] }]}
        >
          <Text style={styles.chooseRideTitle}>Choose your ride</Text>
          <FlatList
            data={RIDE_OPTIONS}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedRide(item.id)}
                style={[
                  styles.card,
                  selectedRide === item.id && styles.cardSelected,
                ]}
                activeOpacity={0.8}
              >
                <View style={styles.left}>
                  <View style={styles.iconWrapper}>
                    <MaterialDesignIcons
                      name={item.icon}
                      size={28}
                      color={colors.secondaryColor}
                    />
                  </View>
                  <View style={styles.labelGroup}>
                    <Text style={styles.rideType}>{item.label}</Text>
                    <View style={styles.etaRow}>
                      <MaterialDesignIcons
                        name="schedule"
                        size={13}
                        color={colors.lightGreyColor}
                      />
                      <Text style={styles.etaText}>{item.eta}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.price}>{getFare(item.id)}</Text>
              </TouchableOpacity>
            )}
          />

          <View style={styles.divider} />

          {/* Quick actions row */}
          <View style={styles.quickActionsRow}>
            <View style={styles.quickActionItem}>
              <View style={styles.routeIconCircle}>
                <MaterialDesignIcons
                  name="location-on"
                  size={24}
                  color={colors.primaryColor}
                />
              </View>
              <Text style={styles.quickActionLabel}>Places</Text>
            </View>
            <View style={styles.quickActionItem}>
              <View style={styles.routeIconCircle}>
                <MaterialDesignIcons
                  name="gpp-good"
                  size={24}
                  color={colors.primaryColor}
                />
              </View>
              <Text style={styles.quickActionLabel}>Safety</Text>
            </View>
          </View>

          {/* Confirm Pickup button */}
          <TouchableOpacity
            style={[
              styles.confirmButton,
              (!pickup || !dropoff) && styles.confirmBtnDisabled,
            ]}
            onPress={handleConfirmPickup}
            activeOpacity={0.85}
            disabled={!pickup || !dropoff}
          >
            <Text style={styles.confirmBtnText}>Confirm Pickup</Text>
          </TouchableOpacity>

          {/* Close modal operation */}
          <TouchableOpacity
            style={styles.closeModalBtn}
            onPress={closeRideModal}
          >
            <Text style={styles.closeModalText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* ── View Ride Options button ── */}
      {!showRideModal && pickup && dropoff && (
        <TouchableOpacity
          style={styles.showModalBtn}
          onPress={openRideModal}
          activeOpacity={0.9}
        >
          <Text style={styles.showModalBtnText}>View Ride Options</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  map: { flex: 1 },

  // ── Search Panel Container Layout ──
  searchPanelSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },

  // New Header Layout directly styling layout based on Screenshot 2026-06-23 at 12.40.15 PM.png
  locationProfileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    marginTop: 8,
    marginBottom: 10,
    width: '100%',
  },
  locationHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 15,
  },
  yellowPinWrapper: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationTextContainer: {
    justifyContent: 'center',
  },
  locationHeadingMain: {
    fontSize: 18,
    fontWeight: '700',
    color: '#eab308', // Yellow gold matching illustration
    letterSpacing: 0.3,
  },
  locationHeadingSub: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryColor, // White address text
    marginTop: 2,
  },
  profileAvatarFrame: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatarImageSrc: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarLetterFallback: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryColor || '#1e1b4b',
  },

  searchPanelContainer: {
    marginHorizontal: 16,
    backgroundColor: colors.primaryColor,
    borderRadius: 38,
    borderWidth: 1,
    borderColor: colors.borderColor,
    padding: 12,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    maxHeight: height * 0.55,
  },

  // ── Route inputs ──
  routeCard: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  routeIconColumn: {
    alignItems: 'center',
    width: 55,
    justifyContent: 'center',
  },
  routeIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 100,
    backgroundColor: colors.whiteColor,
    borderWidth: 1,
    borderColor: colors.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotLine: {
    height: 8,
    width: 1.5,
    backgroundColor: colors.whiteColor,
  },
  swapIconBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.whiteColor,
    borderWidth: 1,
    borderColor: colors.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  swapIconText: {
    fontSize: 12,
    color: colors.blackColor,
    fontWeight: '700',
  },
  routeInputColumn: {
    flex: 1,
    gap: 16,
    marginStart: 12,
    justifyContent: 'center',
  },
  routeInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    backgroundColor: colors.cardWhiteOpacity,
    paddingHorizontal: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  routeInputBoxActive: {
    borderColor: colors.secondaryColor,
  },
  routeInputText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: colors.whiteColor,
    padding: 0,
  },
  locateInputBtn: {
    paddingLeft: 6,
    justifyContent: 'center',
  },

  // ── Suggestions Layout ──
  suggestionsList: { marginTop: 8, paddingHorizontal: 10 },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  suggestionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  suggestionMain: { fontSize: 14, color: colors.whiteColor, fontWeight: '500' },
  suggestionSub: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 1 },
  suggestionDist: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 6,
  },

  // ── Recent Searches ──
  recentSection: { marginTop: 8, paddingHorizontal: 10 },
  recentTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 6,
    letterSpacing: 0.8,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  recentIcon: { fontSize: 14, marginRight: 12, color: '#fff' },
  recentName: { fontSize: 14, color: colors.whiteColor, fontWeight: '500' },
  recentSub: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 1 },
  distLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginLeft: 6 },

  // ── Search loader ──
  searchLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  searchLoaderText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginLeft: 8,
  },

  // ── FABs ──
  fabGroup: {
    position: 'absolute',
    right: 16,
    bottom: 200,
    gap: 10,
    alignItems: 'center',
  },
  fab: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  // ── Map markers ──
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
  carContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40, // Taxi container ka size set kiya
    height: 40,
  },
  carGlow: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(37,99,235,0.18)',
  },
  carEmoji: { fontSize: 26 },

  // ── Ride modal ──
  rideModal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: colors.primaryColor,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderTopWidth: 1,
    borderWidth: 1,
    borderColor: colors.borderColor,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  chooseRideTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.whiteColor,
    marginBottom: 14,
  },
  listContainer: {
    gap: 12,
    alignItems: 'center',
  },
  card: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.whiteColor,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cardSelected: {
    borderColor: colors.secondaryColor,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelGroup: {
    gap: 4,
  },
  rideType: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.blackColor,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  etaText: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.lightGreyColor,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.blackColor,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: colors.whiteColor,
    marginTop: 20,
    marginBottom: 4,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  quickActionItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  quickActionLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.whiteColor,
    textAlign: 'center',
    marginTop: 4,
  },
  confirmButton: {
    marginTop: 15,
    backgroundColor: colors.secondaryColor,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDisabled: { opacity: 0.5 },
  confirmBtnText: { fontSize: 16, fontWeight: '700', color: colors.whiteColor },
  closeModalBtn: { alignItems: 'center', marginTop: 12 },
  closeModalText: {
    fontSize: 14,
    color: colors.whiteColor,
    fontWeight: '500',
    opacity: 0.6,
  },
  showModalBtn: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: colors.secondaryColor,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  showModalBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.whiteColor,
  },
  customMarkerContainer: {
    width: 90, // Explicit width text aur pin ko space degi
    height: 65,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  markerLabelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
  markerLabelText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  pickupCircleOuter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 4,
    borderColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  pickupCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
  },
  nativeMarkerContainer: {
    width: 100,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
