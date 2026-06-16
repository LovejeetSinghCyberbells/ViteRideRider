import { StyleSheet, View, Image, Text, Dimensions, TouchableOpacity } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import CommonButton from '../../components/CommonButton';
import colors from '../../common/Colors';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
            />
            <Text style={styles.labelText}>
                Ride <Text style={styles.labelHighlight}>Anywhere</Text> Anytime
            </Text>

            <Image
                source={require('../../assets/images/buildings_bg.png')}
                style={styles.buildingImage}
                resizeMode="contain"
            />

            <Image
                source={require('../../assets/images/road.png')}
                style={styles.roadImage}
                resizeMode="contain"
            />

            <Image
                source={require('../../assets/images/car.png')}
                style={styles.carImage}
                resizeMode="contain"
            />

            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                marginTop: height * 0.7,
            }}>
                <View style={styles.infoCard}>
                    <Text style={styles.infoCardTitle}>Cab Booking Made Smooth</Text>
                    <Text style={styles.infoCardBody}>
                        Get Faster Anywhere and Everywhere you will need to Go , Easy Booking and Comfortable Ride Experience
                    </Text>
                </View>

                <View style={styles.dotsContainer}>
                    <View style={styles.dotActive} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                </View>

                <TouchableOpacity  activeOpacity={0.8} style={styles.ctaButton} onPress={() => { navigation.replace('OnboardingSecondScreen'); }}>
                    <Text style={styles.ctaButtonText}>Let's Gooo</Text>
                    <Image
                        source={require('../../assets/images/stearing.png')}
                        style={styles.stearingIcon}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primaryColor,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    logoImage: {
        width: 250,
        height: 105,
        alignSelf: 'center',
        marginBottom: 12,
        marginTop: 60,
    },
    labelText: {
        fontSize: 15,
        fontWeight: '300',
        color: colors.whiteColor,
        textAlign: 'center',
        letterSpacing: 2,
    },
    labelHighlight: {
        color: colors.secondaryColor,
        fontWeight: '500',
    },
    buildingImage: {
        width: width * 1.2,       // was hardcoded 600 — overflowed on narrow screens
        height: height * 0.45,    // was hardcoded 500 — proportional to screen height now
        alignSelf: 'center',
        position: 'absolute',
        marginTop: height * 0.22,
    },
    carImage: {
        width: width * 1.1,       // was hardcoded 512
        height: width * 0.82,     // was hardcoded 384 — same ~3:4 ratio preserved
        alignSelf: 'center',
        marginTop: height * 0.16,
        marginStart: 80,
    },
    roadImage: {
        width: width,
        height: width,      // was `width` (square) — too tall, caused overflow
        position: 'absolute',
        marginTop: height * 0.56,
    },
    stearingIcon: {
        width: 24,
        height: 24,
    },
    // Info Card
    infoCard: {
        backgroundColor: colors.cardWhiteOpacity,
        borderRadius: 12,
        padding: 24,
        width: width - 40,        // was missing — card could overflow on narrow screens
        borderWidth: 1,
        borderColor: colors.borderColor,
    },
    infoCardTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.secondaryColor,
    },
    infoCardBody: {
        fontSize: 14,
        fontWeight: '400',
        color: colors.whiteColor,
    },
    // Dots
    dotsContainer: {
        flexDirection: 'row',
        gap: 5,
        marginTop: 20,
    },
    dotActive: {
        width: 8,
        height: 8,
        borderRadius: 100,
        backgroundColor: colors.whiteColor,
        borderColor: colors.whiteColor,
        borderWidth: 1,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 100,
        borderColor: colors.whiteColor,
        borderWidth: 1,
    },
    // CTA Button
    ctaButton: {
        backgroundColor: colors.lightGreyColor,
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
    },
    ctaButtonText: {
        fontSize: 16,
        fontWeight: '400',
        color: colors.blackColor,
        textAlign: 'center',
    },
});