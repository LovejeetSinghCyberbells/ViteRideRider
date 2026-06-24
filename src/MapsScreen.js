import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Keyboard,
  PermissionsAndroid,
  Platform,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  Map as MapView,
  Camera,
  GeoJSONSource as ShapeSource,
  Layer,
  Marker as MarkerView,
} from '@maplibre/maplibre-react-native';

const { width, height } = Dimensions.get('window');
const OSRM_URL = 'https://router.project-osrm.org';
const PHOTON_URL = 'https://photon.komoot.io';
const MAP_STYLE =
  'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const DEFAULT_CENTER = { latitude: 30.7333, longitude: 76.7794 };

const CACHE_TTL = 5 * 60 * 1000;
const LANDMARK_CACHE_TTL = 10 * 60 * 1000;

const SIM_INTERVAL_MS = 1500; // tick every 300ms
const SIM_STEP = 3; // advance 3 coords per tick

const FARE_PER_KM = { auto: 12, cab: 16, bike: 8, share: 7 };
const FARE_PER_MIN = { auto: 1.5, cab: 2, bike: 1, share: 1 };

const RIDE_TYPES = [
  { id: 'auto', label: '🚖 Auto' },
  { id: 'cab', label: '🚕 Cab' },
  { id: 'bike', label: '🛵 Bike' },
  { id: 'share', label: '🚐 Share' },
];

const ROUTE_COLORS = ['#2563eb', '#94a3b8', '#0d9488'];
const ROUTE_COLORS_INACTIVE = ['#93c5fd', '#cbd5e1', '#5eead4'];
const ROUTE_LABELS = ['Fastest', 'Alternate', 'Scenic'];
const ROUTE_EMOJIS = ['🚗', '🛤️', '🌿'];

const LANDMARK_CATEGORIES = [
  'restaurant',
  'cafe',
  'bakery',
  'fast_food',
  'bar',
  'pub',
  'hotel',
  'hostel',
  'resort',
  'hospital',
  'clinic',
  'pharmacy',
  'bank',
  'atm',
  'bus_stop',
  'taxi',
  'fuel',
  'parking',
  'supermarket',
  'grocery',
  'mall',
  'park',
  'museum',
  'cinema',
  'theatre',
  'school',
  'university',
  'library',
  'gym',
  'stadium',
  'church',
  'mosque',
  'temple',
  'police',
  'fire_station',
  'post_office',
  'shopping_mall',
  'tourist_attraction',
  'viewpoint',
  'monument',
  'garden',
];

const EMOJI_MAP = {
  restaurant: '🍽️',
  cafe: '☕',
  bakery: '🥐',
  fast_food: '🍔',
  bar: '🍺',
  pub: '🍺',
  hotel: '🏨',
  hostel: '🏨',
  resort: '🏨',
  hospital: '🏥',
  clinic: '🏥',
  pharmacy: '💊',
  bank: '🏦',
  atm: '💵',
  bus_stop: '🚏',
  taxi: '🚕',
  fuel: '⛽',
  parking: '🅿️',
  supermarket: '🛒',
  grocery: '🛒',
  mall: '🛍️',
  shopping_mall: '🛍️',
  park: '🌳',
  museum: '🏛️',
  cinema: '🎬',
  theatre: '🎭',
  school: '🏫',
  university: '🎓',
  library: '📚',
  gym: '💪',
  stadium: '🏟️',
  church: '⛪',
  mosque: '🕌',
  temple: '🛕',
  police: '👮',
  fire_station: '🚒',
  post_office: '📮',
  tourist_attraction: '📸',
  viewpoint: '🔭',
  monument: '🗿',
  garden: '🌸',
};

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

const calcFare = (distKm, durationMins, rideType) => {
  const pkm = FARE_PER_KM[rideType] ?? FARE_PER_KM.auto;
  const pmin = FARE_PER_MIN[rideType] ?? FARE_PER_MIN.auto;
  return Math.round((distKm || 0) * pkm + (durationMins || 0) * pmin);
};

const isOffPeak = () => {
  const h = new Date().getHours();
  return h < 8 || h > 21;
};

const calcBearing = (lon1, lat1, lon2, lat2) => {
  const toR = d => (d * Math.PI) / 180;
  const dLon = toR(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toR(lat2));
  const x =
    Math.cos(toR(lat1)) * Math.sin(toR(lat2)) -
    Math.sin(toR(lat1)) * Math.cos(toR(lat2)) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
};

const safeJsonParse = async response => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const searchCache = new Map();
const landmarkCache = new Map();

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
      // On iOS, Geolocation.requestAuthorization() triggers the system permission dialog
      return new Promise(resolve => {
        Geolocation.requestAuthorization('whenInUse');
        // Small delay to let the system process the auth request
        setTimeout(() => resolve(true), 300);
      });
    }
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Allow access to your location for pickup detection',
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

// ─────────────────────────────────────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────────────────────────────────────
const Toast = React.memo(({ message, visible }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!visible) return;
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(2200),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, message]);
  if (!message) return null;
  return (
    <Animated.View style={[styles.toast, { opacity }]}>
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// RideTypeSelector
// ─────────────────────────────────────────────────────────────────────────────
const RideTypeSelector = React.memo(({ selected, onSelect }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.rideTypeScroll}
    contentContainerStyle={{ paddingHorizontal: 2 }}
  >
    {RIDE_TYPES.map(rt => (
      <TouchableOpacity
        key={rt.id}
        style={[styles.rideChip, selected === rt.id && styles.rideChipActive]}
        onPress={() => onSelect(rt.id)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.rideChipText,
            selected === rt.id && styles.rideChipTextActive,
          ]}
        >
          {rt.label}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
));

// ─────────────────────────────────────────────────────────────────────────────
// AnimatedSuggestionRow
// ─────────────────────────────────────────────────────────────────────────────
const AnimatedSuggestionRow = React.memo(({ item, onPress, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
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

// ─────────────────────────────────────────────────────────────────────────────
// RouteSelectionSheet
// ─────────────────────────────────────────────────────────────────────────────
const RouteSelectionSheet = React.memo(
  ({ routes, selectedRouteIndex, onSelectRoute }) => {
    const slideAnim = useRef(new Animated.Value(200)).current;
    useEffect(() => {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 70,
        friction: 10,
        useNativeDriver: true,
      }).start();
      console.log(
        '[RouteSelectionSheet] Rendered — routes:',
        routes.length,
        'selected:',
        selectedRouteIndex,
      );
    }, [routes.length]);
    if (!routes || routes.length <= 1) return null;
    return (
      <Animated.View
        style={[styles.routeSheet, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.sheetHandle} />
        <Text style={styles.routeSheetTitle}>Choose a route</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4, paddingHorizontal: 2 }}
        >
          {routes.map((route, index) => {
            const isSelected = selectedRouteIndex === index;
            const routeColor = ROUTE_COLORS[index] ?? ROUTE_COLORS[2];
            const discount = isOffPeak() ? Math.round(route.fare * 0.12) : 0;
            return (
              <TouchableOpacity
                key={route.id}
                style={[
                  styles.routeCard,
                  isSelected && styles.routeCardActive,
                  isSelected && { borderColor: routeColor },
                ]}
                onPress={() => {
                  console.log(
                    `[RouteCard] Tapped index ${index} — ${ROUTE_LABELS[index]}, ${route.distance} km, ${route.duration} min`,
                  );
                  onSelectRoute(index);
                }}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.routeCardStripe,
                    { backgroundColor: routeColor },
                  ]}
                />
                <View style={styles.routeCardBody}>
                  <View style={styles.routeCardHeader}>
                    <Text style={styles.routeCardEmoji}>
                      {ROUTE_EMOJIS[index] ?? '🛣️'}
                    </Text>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text
                        style={[
                          styles.routeCardLabel,
                          isSelected && { color: routeColor },
                        ]}
                      >
                        {ROUTE_LABELS[index] ?? `Route ${index + 1}`}
                      </Text>
                      {index === 0 && (
                        <View style={styles.bestBadge}>
                          <Text style={styles.bestBadgeText}>BEST</Text>
                        </View>
                      )}
                    </View>
                    {isSelected && (
                      <View
                        style={[
                          styles.selectedDot,
                          { backgroundColor: routeColor },
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.routeCardStats}>
                    <Text style={styles.routeCardDist}>
                      {route.distance} km
                    </Text>
                    <Text style={styles.routeCardSep}>·</Text>
                    <Text style={styles.routeCardDur}>
                      {route.duration} min
                    </Text>
                  </View>
                  <View style={styles.routeCardFareRow}>
                    <Text
                      style={[
                        styles.routeCardFare,
                        isSelected && { color: routeColor },
                      ]}
                    >
                      ₹{route.fare - discount}
                    </Text>
                    {discount > 0 && (
                      <Text style={styles.routeCardDiscount}>-₹{discount}</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>
    );
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// TripInfoBar  (pre-ride)
// ─────────────────────────────────────────────────────────────────────────────
const TripInfoBar = React.memo(
  ({
    distKm,
    durationMins,
    onConfirm,
    onShowFullRoute,
    rideType,
    onSelectRide,
  }) => {
    const slideAnim = useRef(new Animated.Value(120)).current;
    const fare = calcFare(distKm, durationMins, rideType);
    const discount = isOffPeak() ? Math.round(fare * 0.12) : 0;
    useEffect(() => {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 75,
        friction: 9,
        useNativeDriver: true,
      }).start();
    }, []);
    return (
      <Animated.View
        style={[styles.tripBar, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.sheetHandle} />
        <RideTypeSelector selected={rideType} onSelect={onSelectRide} />
        <View style={styles.tripStats}>
          <View style={styles.tripStat}>
            <Text style={styles.tripStatValue}>{distKm ?? '—'} km</Text>
            <Text style={styles.tripStatLabel}>Distance</Text>
          </View>
          <View style={styles.tripDivider} />
          <View style={styles.tripStat}>
            <Text style={styles.tripStatValue}>{durationMins ?? '—'} min</Text>
            <Text style={styles.tripStatLabel}>ETA</Text>
          </View>
          <View style={styles.tripDivider} />
          <View style={styles.tripStat}>
            <View
              style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}
            >
              <Text style={styles.tripStatValue}>₹{fare - discount}</Text>
              {discount > 0 && (
                <Text style={styles.discountBadge}>-₹{discount}</Text>
              )}
            </View>
            <Text style={styles.tripStatLabel}>Est. fare</Text>
          </View>
        </View>
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.fullRouteBtn}
            onPress={onShowFullRoute}
            activeOpacity={0.8}
          >
            <Text style={styles.fullRouteBtnText}>Full route</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={onConfirm}
            activeOpacity={0.85}
          >
            <Text style={styles.confirmBtnText}>Confirm ride →</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// SimulationBar  (active ride)
// ─────────────────────────────────────────────────────────────────────────────
const SimulationBar = React.memo(
  ({
    simCoordIndex,
    totalCoords,
    distKm,
    durationMins,
    rideType,
    elapsedSecs,
    onEndRide,
    bearing,
  }) => {
    const slideAnim = useRef(new Animated.Value(120)).current;
    useEffect(() => {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 75,
        friction: 9,
        useNativeDriver: true,
      }).start();
    }, []);

    const pct =
      totalCoords > 0
        ? Math.min(100, Math.round((simCoordIndex / (totalCoords - 1)) * 100))
        : 0;
    const fare = calcFare(distKm, durationMins, rideType);
    const remainingKm =
      distKm != null ? Math.max(0, distKm * (1 - pct / 100)).toFixed(1) : '—';
    const formatElapsed = s =>
      `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const dirLabel = directions[Math.round(bearing / 45) % 8];

    return (
      <Animated.View
        style={[styles.tripBar, { transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.sheetHandle} />

        {/* Header */}
        <View style={styles.simHeader}>
          <View style={styles.simStatusDot} />
          <Text style={styles.simTitle}>Ride in Progress</Text>
          <View style={styles.simDirectionBadge}>
            <Text style={styles.simDirectionText}>
              {dirLabel} {Math.round(bearing)}°
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
        </View>
        <View style={styles.progressLabels}>
          <Text style={styles.progressStart}>Pickup</Text>
          <Text style={styles.progressPct}>{pct}% complete</Text>
          <Text style={styles.progressEnd}>Destination</Text>
        </View>

        {/* Stats */}
        <View style={styles.tripStats}>
          <View style={styles.tripStat}>
            <Text style={styles.tripStatValue}>
              {formatElapsed(elapsedSecs)}
            </Text>
            <Text style={styles.tripStatLabel}>Elapsed</Text>
          </View>
          <View style={styles.tripDivider} />
          <View style={styles.tripStat}>
            <Text style={styles.tripStatValue}>{remainingKm} km</Text>
            <Text style={styles.tripStatLabel}>Remaining</Text>
          </View>
          <View style={styles.tripDivider} />
          <View style={styles.tripStat}>
            <Text style={[styles.tripStatValue, { color: '#2563eb' }]}>
              ₹{fare}
            </Text>
            <Text style={styles.tripStatLabel}>Est. fare</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.endRideBtnFull}
          onPress={onEndRide}
          activeOpacity={0.85}
        >
          <Text style={styles.endRideBtnFullText}>🛑 End Ride</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// MapScreen
// ─────────────────────────────────────────────────────────────────────────────
const MapScreen = () => {
  const cameraRef = useRef(null);
  const landmarkAbortRef = useRef(null);
  const simIntervalRef = useRef(null);
  const { requestLocation } = usePermission();

  const [mapLoaded, setMapLoaded] = useState(false);
  const [zoom, setZoom] = useState(13);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);

  // ── Simulation ────────────────────────────────────────────────────────────
  const [isRideActive, setIsRideActive] = useState(false);
  const [simCoordIndex, setSimCoordIndex] = useState(0);
  const [simBearing, setSimBearing] = useState(0);
  const [rideElapsed, setRideElapsed] = useState(0);
  const [drivenCoords, setDrivenCoords] = useState([]); // already-travelled path

  const [rideType, setRideType] = useState('auto');
  const [driverPosition, setDriverPosition] = useState(null);
  const [landmarks, setLandmarks] = useState([]);

  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [pickupText, setPickupText] = useState('');
  const [dropoffText, setDropoffText] = useState('');
  const [activeField, setActiveField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // ── Routes ────────────────────────────────────────────────────────────────
  const [routes, setRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const activeRoute = routes[selectedRouteIndex] ?? null;
  const distKm = activeRoute?.distance ?? null;
  const durationMins = activeRoute?.duration ?? null;

  const [isLocating, setIsLocating] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = useCallback(msg => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  }, []);

  const searchQuery = activeField === 'pickup' ? pickupText : dropoffText;
  const debouncedQuery = useDebounce(searchQuery, 220);

  // ── Elapsed timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isRideActive) {
      setRideElapsed(0);
      return;
    }
    const t = setInterval(() => setRideElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [isRideActive]);

  // ── SIMULATION ENGINE ─────────────────────────────────────────────────────
  const startSimulation = useCallback(
    routeCoords => {
      if (!routeCoords || routeCoords.length < 2) {
        console.warn('[Simulation] Not enough coords:', routeCoords?.length);
        return;
      }
      console.log(
        '[Simulation] ▶ Starting — total coords:',
        routeCoords.length,
        '| step:',
        SIM_STEP,
        '| interval:',
        SIM_INTERVAL_MS,
        'ms',
      );

      // Teleport driver to route start
      let idx = 0;
      const [startLon, startLat] = routeCoords[0];
      setSimCoordIndex(0);
      setDrivenCoords([routeCoords[0]]);
      setDriverPosition({ latitude: startLat, longitude: startLon });

      // Zoom into pickup
      cameraRef.current?.flyTo({
        center: [startLon, startLat],
        zoom: 15,
        duration: 800,
      });

      simIntervalRef.current = setInterval(() => {
        idx = Math.min(idx + SIM_STEP, routeCoords.length - 1);

        const [lon, lat] = routeCoords[idx];
        const prev = routeCoords[Math.max(0, idx - SIM_STEP)];
        const bearing = calcBearing(prev[0], prev[1], lon, lat);

        setDriverPosition({ latitude: lat, longitude: lon });
        setSimCoordIndex(idx);
        setSimBearing(bearing);
        setDrivenCoords(prev => [...prev, [lon, lat]]);

        // Camera follows driver
        cameraRef.current?.flyTo({
          center: [lon, lat],
          zoom: 15,
          duration: SIM_INTERVAL_MS - 30,
          bearing,
        });

        console.log(
          `[Simulation] Tick ${idx}/${routeCoords.length - 1} | ${lat.toFixed(
            5,
          )},${lon.toFixed(5)} | bearing:${Math.round(bearing)}°`,
        );

        if (idx >= routeCoords.length - 1) {
          clearInterval(simIntervalRef.current);
          simIntervalRef.current = null;
          console.log('[Simulation] ✅ Arrived at destination');
          setTimeout(
            () => showToast('🎉 You have arrived at your destination!'),
            400,
          );
        }
      }, SIM_INTERVAL_MS);
    },
    [showToast],
  );

  const stopSimulation = useCallback(() => {
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
      console.log('[Simulation] ⏹ Stopped');
    }
  }, []);

  useEffect(() => () => stopSimulation(), [stopSimulation]);

  // ── Place search ──────────────────────────────────────────────────────────
  const searchPlaces = useCallback(async (query, lat, lon, signal) => {
    if (!query || query.length < 2) return [];
    const cacheKey = `${query}_${Math.floor(lat * 10)}_${Math.floor(lon * 10)}`;
    const cached = searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('[searchPlaces] Cache HIT:', query);
      return cached.data;
    }
    console.log(
      '[searchPlaces] Fetching:',
      query,
      '@',
      lat.toFixed(4),
      lon.toFixed(4),
    );
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
      console.log('[searchPlaces] Results:', sorted.length);
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

  // ── Landmarks ─────────────────────────────────────────────────────────────
  const landmarkFeatures = useMemo(() => {
    if (!mapLoaded || zoom < 12 || landmarks.length === 0) return null;
    return {
      type: 'FeatureCollection',
      features: landmarks.map(poi => ({
        type: 'Feature',
        id: String(poi.id),
        geometry: { type: 'Point', coordinates: [poi.longitude, poi.latitude] },
        properties: {
          name: `${poi.emoji ?? '📍'} ${poi.name}`,
          type: poi.type,
        },
      })),
    };
  }, [landmarks, zoom, mapLoaded]);

  const fetchNearbyLandmarks = useCallback(async (lat, lon, currentZoom) => {
    if (currentZoom < 12) {
      setLandmarks([]);
      return;
    }
    const regionKey = `${Math.floor(lat * 5)}_${Math.floor(
      lon * 5,
    )}_${Math.floor(currentZoom)}`;
    const cached = landmarkCache.get(regionKey);
    if (cached && Date.now() - cached.timestamp < LANDMARK_CACHE_TTL) {
      console.log('[fetchNearbyLandmarks] Cache HIT:', regionKey);
      setLandmarks(cached.data);
      return;
    }
    console.log(
      '[fetchNearbyLandmarks] Fetching @',
      lat.toFixed(4),
      lon.toFixed(4),
      'z:',
      currentZoom.toFixed(1),
    );
    if (landmarkAbortRef.current) landmarkAbortRef.current.abort();
    const controller = new AbortController();
    landmarkAbortRef.current = controller;
    await new Promise(res => setTimeout(res, 300));
    try {
      let radius, limitPerCat, maxTotal;
      if (currentZoom >= 16) {
        radius = 0.01;
        limitPerCat = 5;
        maxTotal = 80;
      } else if (currentZoom >= 14) {
        radius = 0.025;
        limitPerCat = 4;
        maxTotal = 55;
      } else {
        radius = 0.05;
        limitPerCat = 3;
        maxTotal = 35;
      }
      const bboxStr = `${lon - radius},${lat - radius},${lon + radius},${
        lat + radius
      }`;
      const seenIds = new Set();
      const allLandmarks = [];
      const BATCH = 8;
      for (let i = 0; i < LANDMARK_CATEGORIES.length; i += BATCH) {
        if (controller.signal.aborted) return;
        const batch = LANDMARK_CATEGORIES.slice(i, i + BATCH);
        const results = await Promise.all(
          batch.map(async cat => {
            try {
              const res = await fetch(
                `${PHOTON_URL}/api?q=${encodeURIComponent(
                  cat,
                )}&limit=${limitPerCat}&lat=${lat}&lon=${lon}&bbox=${bboxStr}&lang=en`,
                { signal: controller.signal },
              );
              if (!res.ok) return [];
              const data = await safeJsonParse(res);
              return data?.features ?? [];
            } catch {
              return [];
            }
          }),
        );
        results.forEach(features => {
          if (!Array.isArray(features)) return;
          features.forEach(f => {
            if (
              !f?.properties?.name ||
              !f.geometry ||
              seenIds.has(f.properties.osm_id)
            )
              return;
            const [lonC, latC] = f.geometry.coordinates;
            if (Math.abs(latC) > 90 || Math.abs(lonC) > 180) return;
            seenIds.add(f.properties.osm_id);
            const rawType = (f.properties.type || '').toLowerCase();
            const emoji =
              Object.entries(EMOJI_MAP).find(([k]) =>
                rawType.includes(k),
              )?.[1] ?? '📍';
            allLandmarks.push({
              id: f.properties.osm_id ?? `${f.properties.name}_${Date.now()}`,
              name:
                f.properties.name.length > 25
                  ? `${f.properties.name.slice(0, 22)}…`
                  : f.properties.name,
              latitude: latC,
              longitude: lonC,
              type: rawType,
              emoji,
            });
          });
        });
        if (i + BATCH < LANDMARK_CATEGORIES.length)
          await new Promise(res => setTimeout(res, 40));
      }
      const sorted = allLandmarks
        .sort((a, b) => {
          const da = (a.latitude - lat) ** 2 + (a.longitude - lon) ** 2;
          const db = (b.latitude - lat) ** 2 + (b.longitude - lon) ** 2;
          return da - db;
        })
        .slice(0, maxTotal);
      console.log('[fetchNearbyLandmarks] Loaded:', sorted.length);
      if (sorted.length > 0)
        landmarkCache.set(regionKey, { data: sorted, timestamp: Date.now() });
      setLandmarks(sorted);
    } catch (err) {
      if (err.name !== 'AbortError')
        console.error('[fetchNearbyLandmarks] Error:', err.message);
    }
  }, []);

  useEffect(
    () => () => {
      landmarkAbortRef.current?.abort();
    },
    [],
  );

  const onRegionDidChange = useCallback(
    event => {
      const { center, zoom: currentZoom } = event.nativeEvent;
      const [lon, lat] = center;
      setZoom(currentZoom);
      setMapCenter({ latitude: lat, longitude: lon });
      if (currentZoom >= 12) fetchNearbyLandmarks(lat, lon, currentZoom);
      else setLandmarks([]);
    },
    [fetchNearbyLandmarks],
  );

  const cameraInitDone = useRef(false);
  const onMapLoaded = useCallback(() => {
    console.log('[MapScreen] Map loaded');
    setMapLoaded(true);
    if (cameraInitDone.current) return;
    cameraInitDone.current = true;
    cameraRef.current?.jumpTo({
      center: toGeoCoord(DEFAULT_CENTER),
      zoom: 13,
    });
  }, []);

  useEffect(() => {
    (async () => {
      const ok = await requestLocation();
      if (!ok) return;
      Geolocation.getCurrentPosition(
        ({ coords }) => {
          console.log(
            '[MapScreen] Initial pos:',
            coords.latitude.toFixed(5),
            coords.longitude.toFixed(5),
          );
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

  // ── Route fetching ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!pickup || !dropoff) {
      setRoutes([]);
      setSelectedRouteIndex(0);
      console.log('[RouteEffect] Cleared routes');
      return;
    }
    const controller = new AbortController();
    console.log('[RouteEffect] Fetching:', pickup.label, '→', dropoff.label);
    (async () => {
      try {
        const url = `${OSRM_URL}/route/v1/driving/${pickup.longitude},${pickup.latitude};${dropoff.longitude},${dropoff.latitude}?overview=full&geometries=geojson&alternatives=3`;
        console.log('[RouteEffect] URL:', url);
        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();
        console.log(
          '[RouteEffect] OSRM routes:',
          data.routes?.length ?? 0,
          '| code:',
          data.code,
        );
        if (data.routes && data.routes.length > 0) {
          const processedRoutes = data.routes.map((route, index) => {
            const dist = Number((route.distance / 1000).toFixed(1));
            const dur = Math.ceil(route.duration / 60);
            const fare = calcFare(dist, dur, rideType);
            console.log(
              `[RouteEffect] Route ${index} (${
                ROUTE_LABELS[index] ?? 'alt'
              }): ${dist}km, ${dur}min, ₹${fare}`,
            );
            return {
              id: index,
              coordinates: route.geometry.coordinates,
              distance: dist,
              duration: dur,
              fare,
            };
          });
          setRoutes(processedRoutes);
          setSelectedRouteIndex(0);
          showToast(
            processedRoutes.length === 1
              ? 'Only one route available'
              : `${processedRoutes.length} routes found — swipe to choose`,
          );
        } else {
          console.warn('[RouteEffect] No routes returned');
          showToast('⚠️ No route found between these points');
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('[RouteEffect] Error:', err.message);
          showToast('⚠️ Could not fetch route');
        }
      }
    })();
    return () => controller.abort();
  }, [pickup, dropoff, rideType, showToast]);

  // ── Route selection ───────────────────────────────────────────────────────
  const selectRoute = useCallback(
    index => {
      if (!routes[index]) {
        console.warn('[selectRoute] Invalid index:', index);
        return;
      }
      console.log('[selectRoute] → Route', index, '—', ROUTE_LABELS[index]);
      setSelectedRouteIndex(index);
      showFullRouteForCoords(routes[index].coordinates);
    },
    [routes],
  );

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
    console.log(
      '[showFullRoute] Center:',
      centerLat.toFixed(4),
      centerLon.toFixed(4),
      'z:',
      zoomLevel,
    );
    cameraRef.current?.flyTo({
      center: [centerLon, centerLat],
      zoom: zoomLevel,
      duration: 850,
    });
  }, []);

  const showFullRoute = useCallback(() => {
    if (activeRoute) showFullRouteForCoords(activeRoute.coordinates);
  }, [activeRoute, showFullRouteForCoords]);

  // ── My location ───────────────────────────────────────────────────────────
  const moveToMyLocation = useCallback(async () => {
    const ok = await requestLocation();
    if (!ok) {
      showToast('📍 Location permission denied');
      return;
    }
    setIsLocating(true);
    Geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        console.log(
          '[moveToMyLocation]',
          latitude.toFixed(5),
          longitude.toFixed(5),
        );
        setDriverPosition({ latitude, longitude });
        cameraRef.current?.flyTo({
          center: [longitude, latitude],
          zoom: 16,
          duration: 700,
        });
        try {
          const res = await fetch(
            `${PHOTON_URL}/reverse?lon=${longitude}&lat=${latitude}`,
          );
          const data = await safeJsonParse(res);
          const name =
            data?.features?.[0]?.properties?.name ?? 'Current Location';
          console.log('[moveToMyLocation] Geocoded:', name);
          setPickup({ latitude, longitude, label: name });
          setPickupText(name);
        } catch {
          setPickup({ latitude, longitude, label: 'Current Location' });
          setPickupText('Current Location');
        } finally {
          setIsLocating(false);
        }
      },
      err => {
        console.warn('[moveToMyLocation] Error:', err.message);
        showToast('⚠️ Could not get location');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0,
        authorizationLevel: 'whenInUse', // iOS ke liye
      },
    );
  }, [requestLocation, showToast]);

  const handleSwap = useCallback(() => {
    console.log('[handleSwap] ↔ Swapping');
    setPickup(dropoff);
    setDropoff(pickup);
    setPickupText(dropoffText);
    setDropoffText(pickupText);
  }, [pickup, dropoff, pickupText, dropoffText]);

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
      console.log('[selectSuggestion]', item.name, '→', activeField);
      if (activeField === 'pickup') {
        setPickup(pt);
        setPickupText(item.name);
      } else {
        setDropoff(pt);
        setDropoffText(item.name);
      }
      setSuggestions([]);
      setActiveField(null);
      cameraRef.current?.flyTo({
        center: [item.longitude, item.latitude],
        zoom: 16,
        duration: 700,
      });
    },
    [activeField],
  );

  // ── Confirm / End ride ────────────────────────────────────────────────────
  const handleConfirmRide = useCallback(() => {
    if (!pickup || !dropoff) {
      showToast('Please set pickup and destination');
      return;
    }
    if (!activeRoute) {
      showToast('No route available');
      return;
    }
    console.log(
      '[handleConfirmRide] ▶ Starting simulation — route:',
      selectedRouteIndex,
      'type:',
      rideType,
      'coords:',
      activeRoute.coordinates.length,
    );
    setIsRideActive(true);
    startSimulation(activeRoute.coordinates);
  }, [
    pickup,
    dropoff,
    activeRoute,
    selectedRouteIndex,
    rideType,
    startSimulation,
    showToast,
  ]);

  const handleEndRide = useCallback(() => {
    console.log('[handleEndRide] ⏹ Ride ended');
    stopSimulation();
    setIsRideActive(false);
    setPickup(null);
    setDropoff(null);
    setPickupText('');
    setDropoffText('');
    setRoutes([]);
    setSelectedRouteIndex(0);
    setDrivenCoords([]);
    setSimCoordIndex(0);
    setSimBearing(0);
    cameraRef.current?.flyTo({
      center: toGeoCoord(DEFAULT_CENTER),
      zoom: 13,
      duration: 800,
      bearing: 0,
    });
  }, [stopSimulation]);

  // ── GeoJSON helpers ───────────────────────────────────────────────────────
  const routeGeoJsonList = useMemo(() => {
    if (routes.length === 0) return [];
    console.log('[routeGeoJsonList] Building', routes.length, 'layers');
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

  // Green "driven so far" line
  const drivenGeoJson = useMemo(() => {
    if (!isRideActive || drivenCoords.length < 2) return null;
    return {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: drivenCoords },
    };
  }, [isRideActive, drivenCoords]);

  // Blue "remaining route" line
  const remainingGeoJson = useMemo(() => {
    if (
      !isRideActive ||
      !activeRoute ||
      simCoordIndex >= activeRoute.coordinates.length - 1
    )
      return null;
    const rem = activeRoute.coordinates.slice(simCoordIndex);
    if (rem.length < 2) return null;
    return {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: rem },
    };
  }, [isRideActive, activeRoute, simCoordIndex]);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapStyle={MAP_STYLE}
        onDidFinishLoadingMap={onMapLoaded}
        onRegionDidChange={onRegionDidChange}
      >
        <Camera ref={cameraRef} />

        {mapLoaded && (
          <>
            {/* Landmarks — hidden during ride to reduce clutter */}
            {landmarkFeatures && zoom >= 12 && !isRideActive && (
              <ShapeSource id="landmarksSource" data={landmarkFeatures}>
                <Layer
                  type="symbol"
                  id="landmarksLayer"
                  minZoomLevel={12}
                  style={{
                    textField: '{name}',
                    textSize: zoom > 15 ? 13 : zoom > 13 ? 11 : 10,
                    textFont: ['Noto Sans Regular'],
                    textColor: zoom > 14 ? '#1a1a1a' : '#555555',
                    textHaloColor: '#ffffff',
                    textHaloWidth: 1.5,
                    textAnchor: 'top',
                    textOffset: [0, 0.5],
                    textAllowOverlap: zoom > 15,
                    textIgnorePlacement: zoom > 15,
                    textMaxWidth: 10,
                  }}
                />
              </ShapeSource>
            )}

            {/* Pre-ride: show all routes */}
            {!isRideActive && routeGeoJsonList.length > 0 && (
              <>
                {routeGeoJsonList
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
                      <ShapeSource id={`route_${r.id}`} data={r.geoJson}>
                        <Layer
                          type="line"
                          id={`routeLayer_${r.id}`}
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
                {routeGeoJsonList
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
              </>
            )}

            {/* Active ride: remaining (blue) + driven (green dashed) */}
            {isRideActive && remainingGeoJson && (
              <>
                <ShapeSource id="remainingShadow" data={remainingGeoJson}>
                  <Layer
                    type="line"
                    id="remainingShadowLayer"
                    style={{
                      lineColor: 'rgba(0,0,0,0.12)',
                      lineWidth: 9,
                      lineCap: 'round',
                      lineJoin: 'round',
                    }}
                  />
                </ShapeSource>
                <ShapeSource id="remainingRoute" data={remainingGeoJson}>
                  <Layer
                    type="line"
                    id="remainingRouteLayer"
                    style={{
                      lineColor: '#2563eb',
                      lineWidth: 5,
                      lineCap: 'round',
                      lineJoin: 'round',
                      lineOpacity: 0.9,
                    }}
                  />
                </ShapeSource>
              </>
            )}
            {isRideActive && drivenGeoJson && (
              <ShapeSource id="drivenRoute" data={drivenGeoJson}>
                <Layer
                  type="line"
                  id="drivenRouteLayer"
                  style={{
                    lineColor: '#22c55e',
                    lineWidth: 4,
                    lineCap: 'round',
                    lineJoin: 'round',
                    lineOpacity: 0.8,
                    lineDasharray: [2, 1.5],
                  }}
                />
              </ShapeSource>
            )}

            {/* Pickup */}
            {pickup && !isRideActive && (
              <MarkerView
                coordinate={toGeoCoord(pickup)}
                anchor={{ x: 0.5, y: 1 }}
              >
                <View style={styles.pickupMarker}>
                  <View style={styles.pickupMarkerDot} />
                </View>
              </MarkerView>
            )}

            {/* Dropoff — stays visible during ride so user sees destination */}
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

            {/* Driver / simulated vehicle */}
            {driverPosition && (
              <MarkerView
                coordinate={toGeoCoord(driverPosition)}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={styles.carContainer}>
                  <View
                    style={isRideActive ? styles.carGlowActive : styles.carGlow}
                  />
                  <Text style={styles.carEmoji}>🚕</Text>
                  {isRideActive && <View style={styles.focusRing} />}
                </View>
              </MarkerView>
            )}
          </>
        )}
      </MapView>

      {/* Search panel (pre-ride only) */}
      {!isRideActive && (
        <View style={styles.searchPanel}>
          <Text style={styles.searchHeaderText}>Where to?</Text>
          <View style={styles.inputContainer}>
            <View
              style={[
                styles.inputRow,
                activeField === 'pickup' && styles.inputRowActive,
              ]}
            >
              <View style={[styles.inputDot, styles.inputDotGreen]} />
              <TextInput
                style={styles.input}
                placeholder="Pickup location"
                placeholderTextColor="#9ca3af"
                value={pickupText}
                onChangeText={setPickupText}
                onFocus={() => setActiveField('pickup')}
                returnKeyType="search"
              />
              <TouchableOpacity
                onPress={moveToMyLocation}
                style={styles.locateBtn}
                hitSlop={8}
              >
                {isLocating ? (
                  <ActivityIndicator color="#2563eb" size="small" />
                ) : (
                  <Text style={{ fontSize: 18 }}>🎯</Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.midDividerRow}>
              <View style={styles.midDivider} />
              <TouchableOpacity
                style={styles.swapBtn}
                onPress={handleSwap}
                hitSlop={8}
              >
                <Text style={styles.swapBtnText}>⇅</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.inputRow,
                activeField === 'dropoff' && styles.inputRowActive,
              ]}
            >
              <View style={[styles.inputDot, styles.inputDotRed]} />
              <TextInput
                style={styles.input}
                placeholder="Destination"
                placeholderTextColor="#9ca3af"
                value={dropoffText}
                onChangeText={setDropoffText}
                onFocus={() => setActiveField('dropoff')}
                returnKeyType="search"
              />
            </View>
          </View>

          {!isSearchingPlaces &&
            suggestions.length === 0 &&
            recentSearches.length > 0 &&
            activeField && (
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
          {isSearchingPlaces && (
            <View style={styles.searchLoader}>
              <ActivityIndicator size="small" color="#2563eb" />
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
              windowSize={5}
              initialNumToRender={6}
            />
          )}
        </View>
      )}

      {/* FABs */}
      <View style={[styles.fabGroup, isRideActive && { bottom: 230 }]}>
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

      {/* Route selection sheet */}
      {routes.length > 1 && !isRideActive && (
        <RouteSelectionSheet
          routes={routes}
          selectedRouteIndex={selectedRouteIndex}
          onSelectRoute={selectRoute}
        />
      )}

      {/* Pre-ride bar */}
      {!isRideActive && distKm != null && (
        <TripInfoBar
          distKm={distKm}
          durationMins={durationMins}
          onConfirm={handleConfirmRide}
          onShowFullRoute={showFullRoute}
          rideType={rideType}
          onSelectRide={type => {
            console.log('[RideType] →', type);
            setRideType(type);
          }}
        />
      )}

      {/* Active ride simulation bar */}
      {isRideActive && (
        <SimulationBar
          simCoordIndex={simCoordIndex}
          totalCoords={activeRoute?.coordinates?.length ?? 0}
          distKm={distKm}
          durationMins={durationMins}
          rideType={rideType}
          elapsedSecs={rideElapsed}
          bearing={simBearing}
          onEndRide={handleEndRide}
        />
      )}

      {zoom < 12 && !isRideActive && (
        <View style={styles.zoomHint}>
          <Text style={styles.zoomHintText}>🔍 Zoom in to see places</Text>
        </View>
      )}

      <Toast message={toastMsg} visible={toastVisible} />
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  map: { flex: 1 },

  searchPanel: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 58 : 36,
    left: 14,
    right: 14,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    zIndex: 10,
    maxHeight: height * 0.52,
  },
  searchHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  inputContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 50,
  },
  inputRowActive: { backgroundColor: '#eff6ff' },
  inputDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  inputDotGreen: { backgroundColor: '#22c55e' },
  inputDotRed: { backgroundColor: '#ef4444' },
  input: { flex: 1, fontSize: 15, color: '#111827', padding: 0 },
  locateBtn: { padding: 6, width: 36, alignItems: 'center' },
  midDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 20,
  },
  midDivider: { flex: 1, height: 1, backgroundColor: '#e5e7eb' },
  swapBtn: {
    marginLeft: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapBtnText: { fontSize: 14, color: '#6b7280', fontWeight: '600' },

  suggestionsList: { marginTop: 4 },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  suggestionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  suggestionMain: { fontSize: 14, color: '#111827', fontWeight: '500' },
  suggestionSub: { fontSize: 11, color: '#9ca3af', marginTop: 1 },
  suggestionDist: { fontSize: 11, color: '#6b7280', marginLeft: 6 },

  recentSection: { marginTop: 4 },
  recentTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 6,
    letterSpacing: 0.8,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  recentIcon: { fontSize: 14, marginRight: 12, color: '#9ca3af' },
  recentName: { fontSize: 14, color: '#111827', fontWeight: '500' },
  recentSub: { fontSize: 11, color: '#9ca3af', marginTop: 1 },
  distLabel: { fontSize: 11, color: '#6b7280', marginLeft: 6 },

  searchLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  searchLoaderText: { color: '#6b7280', fontSize: 13, marginLeft: 8 },

  fabGroup: {
    position: 'absolute',
    bottom: 260,
    right: 14,
    gap: 10,
    zIndex: 50,
  },
  fab: {
    backgroundColor: '#fff',
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  zoomHint: {
    position: 'absolute',
    bottom: 260,
    alignSelf: 'center',
    backgroundColor: 'rgba(17,24,39,0.75)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    zIndex: 40,
  },
  zoomHintText: { color: '#fff', fontSize: 12 },

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
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
  },
  dropoffMarker: { alignItems: 'center', justifyContent: 'center' },

  carContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  carEmoji: { fontSize: 30 },
  carGlow: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(37,99,235,0.18)',
    top: -3,
    left: -3,
  },
  carGlowActive: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(34,197,94,0.25)',
    top: -6,
    left: -6,
  },
  focusRing: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2.5,
    borderColor: '#22c55e',
    opacity: 0.6,
    top: -13,
    left: -13,
  },

  // Route sheet
  routeSheet: {
    position: 'absolute',
    bottom: 190,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 25,
  },
  routeSheetTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 0.6,
    marginBottom: 10,
    textTransform: 'uppercase',
  },

  routeCard: {
    width: 150,
    marginRight: 10,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    overflow: 'hidden',
  },
  routeCardActive: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  routeCardStripe: { height: 4, width: '100%' },
  routeCardBody: { padding: 12 },
  routeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  routeCardEmoji: { fontSize: 18 },
  routeCardLabel: { fontSize: 13, fontWeight: '700', color: '#374151' },
  bestBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 5,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  bestBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#15803d',
    letterSpacing: 0.5,
  },
  selectedDot: { width: 10, height: 10, borderRadius: 5, marginLeft: 4 },
  routeCardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  routeCardDist: { fontSize: 12, fontWeight: '600', color: '#374151' },
  routeCardSep: { fontSize: 12, color: '#9ca3af', marginHorizontal: 3 },
  routeCardDur: { fontSize: 12, color: '#6b7280' },
  routeCardFareRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  routeCardFare: { fontSize: 16, fontWeight: '700', color: '#1d4ed8' },
  routeCardDiscount: {
    fontSize: 10,
    color: '#065f46',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 5,
    fontWeight: '600',
    overflow: 'hidden',
  },

  // Trip bar (shared base)
  tripBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    elevation: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 30,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 14,
  },

  rideTypeScroll: { marginBottom: 14 },
  rideChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  rideChipActive: { backgroundColor: '#111827', borderColor: '#111827' },
  rideChipText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  rideChipTextActive: { color: '#fff' },

  tripStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  tripStat: { alignItems: 'center', flex: 1 },
  tripStatValue: { fontSize: 18, fontWeight: '700', color: '#111827' },
  tripStatLabel: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  tripDivider: { width: 1, backgroundColor: '#e5e7eb' },
  discountBadge: {
    fontSize: 11,
    color: '#065f46',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    overflow: 'hidden',
    fontWeight: '600',
  },

  btnRow: { flexDirection: 'row', gap: 10 },
  fullRouteBtn: {
    flex: 1,
    backgroundColor: '#eff6ff',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  fullRouteBtnText: { color: '#1d4ed8', fontWeight: '600', fontSize: 14 },
  confirmBtn: {
    flex: 1.8,
    backgroundColor: '#111827',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.2,
  },

  // Simulation bar specifics
  simHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  simStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
    marginRight: 8,
  },
  simTitle: { fontSize: 15, fontWeight: '700', color: '#111827', flex: 1 },
  simDirectionBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  simDirectionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1d4ed8',
    letterSpacing: 0.5,
  },

  progressBarBg: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  progressStart: { fontSize: 10, color: '#22c55e', fontWeight: '600' },
  progressPct: { fontSize: 10, color: '#6b7280' },
  progressEnd: { fontSize: 10, color: '#ef4444', fontWeight: '600' },

  endRideBtnFull: {
    backgroundColor: '#fee2e2',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  endRideBtnFullText: { color: '#991b1b', fontWeight: '700', fontSize: 15 },

  toast: {
    position: 'absolute',
    bottom: 90,
    alignSelf: 'center',
    backgroundColor: 'rgba(17,24,39,0.88)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    zIndex: 100,
    maxWidth: width * 0.85,
  },
  toastText: { color: '#fff', fontSize: 13, textAlign: 'center' },
});

export default MapScreen;
