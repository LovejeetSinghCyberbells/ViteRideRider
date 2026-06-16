import { StyleSheet, View, Image, Text, Dimensions } from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import CommonButton from '../../components/CommonButton';
import colors from '../../common/Colors';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function OnboardingSecondScreen() {
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

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Welcome to Vite Ride</Text>
                <Text style={styles.cardSubtitle}>Your journey starts here</Text>
                <View style={styles.buttonContainer}>
                    <CommonButton
                        title="Login"
                        color={colors.secondaryColor}
                        textColor={colors.primaryColor}
                        style={styles.button}
                        onPress={() => navigation.push('Login')}
                    />
                    <CommonButton
                        title="Create Account"
                        color={colors.whiteColor}
                        textColor={colors.primaryColor}
                        style={styles.button}
                        onPress={() => navigation.push('SignUpScreen')}
                    />
                    <Text style={styles.guestText}>Continue as guest</Text>
                </View>
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
        justifyContent: 'center',
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
    card: {
        backgroundColor: colors.cardWhiteOpacity,
        padding: 16,
        borderRadius: 38,
        borderWidth: 1,
        borderColor: colors.borderColor,
        width: '100%',
        marginTop: 80,
    },
    cardTitle: {
        fontSize: 28,
        fontWeight: '600',
        color: colors.whiteColor,
        lineHeight: 42,
        alignSelf: 'center',
    },
    cardSubtitle: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 24,
        color: colors.secondaryColor,
        alignSelf: 'center',
    },
    buttonContainer: {
        width: '100%',
        alignSelf: 'center',
        gap: 8,
        marginTop: 40,
    },
    button: {
        borderRadius: 50,
        height: 58,
    },
    guestText: {
        fontWeight: '500',
        fontSize: 14,
        lineHeight: 20,
        color: colors.lightGreyColor,
        textDecorationLine: 'underline',
        alignSelf: 'center',
        marginTop: 8,
    },
});