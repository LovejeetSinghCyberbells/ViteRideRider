// import React, { useState, useEffect } from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
// import CommonButton from '../../components/CommonButton';
// import CommonTextField from '../../components/CommonTextField';
// import colors from '../../common/Colors';
// import { useNavigation } from '@react-navigation/native';
// import { useDispatch, useSelector } from 'react-redux';
// import { registerUser, clearError } from '../../redux/fetures/authSlice'; // Adjust import path if needed

// export default function SignUpScreen() {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   const { isLoading, error } = useSelector(state => state.auth);

//   const [email, setEmail] = useState('');
//   const [name, setName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [checkPrivacyAndTerms, setCheckPrivacyAndTerms] = useState(false); // Can use for checking terms if UI element is added

//   useEffect(() => {
//     dispatch(clearError());
//   }, [dispatch]);

//   useEffect(() => {
//     if (error) {
//       Alert.alert('Registration Error', error);
//       dispatch(clearError());
//     }
//   }, [error, dispatch]);

//   const handleSubmit = () => {
//     if (!name || !email || !phone || !password || !confirmPassword) {
//       Alert.alert('Error', 'Please fill in all details.');
//       return;
//     }
//     if (password !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match.');
//       return;
//     }
//     const signUpData = {
//       name,
//       email,
//       phone,
//       password,
//       confirmPassword,
//     };
//     console.log('Dispatching registerUser with data:', signUpData);
//     dispatch(registerUser(signUpData));
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         onPress={() => {
//           navigation.goBack();
//         }}
//         activeOpacity={0.8}
//       >
//         <MaterialDesignIcons
//           name="chevron-left"
//           size={40}
//           color={colors.whiteColor}
//           style={{ marginEnd: 10 }}
//         />
//       </TouchableOpacity>
//       <View style={{ gap: 40 }}>
//         <View style={styles.card}>
//           <Text style={styles.titleText}>Create your account</Text>
//           <Text style={styles.subTitleText}>Join millions of users today</Text>
//           <View style={{ height: 20 }} />

//           <View>
//             <CommonTextField
//               placeholder="Enter your Name"
//               value={name}
//               onChangeText={setName}
//             />
//             <View style={{ height: 20 }} />
//             <CommonTextField
//               placeholder="Enter your email"
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//             <View style={{ height: 20 }} />
//             <CommonTextField
//               placeholder="Enter your phone number"
//               value={phone}
//               onChangeText={setPhone}
//               keyboardType="phone-pad"
//             />
//             <View style={{ height: 20 }} />
//             <CommonTextField
//               placeholder="Create Password"
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry={true}
//             />
//             <View style={{ height: 20 }} />
//             <CommonTextField
//               placeholder="Confirm Password"
//               value={confirmPassword}
//               onChangeText={setConfirmPassword}
//               secureTextEntry={true}
//             />
//           </View>

//           <View style={{ height: 20 }} />

//           {isLoading ? (
//             <ActivityIndicator size="large" color={colors.secondaryColor} />
//           ) : (
//             <CommonButton
//               title="Create Account"
//               color={colors.secondaryColor}
//               textColor={colors.primaryColor}
//               style={styles.button}
//               onPress={handleSubmit}
//             />
//           )}
//         </View>
//         <Text style={styles.labelText}>
//           Already have an account?{' '}
//           <Text
//             style={styles.labelHighlight}
//             onPress={() => navigation.replace('Login')}
//           >
//             Log in
//           </Text>
//         </Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.primaryColor,
//     paddingHorizontal: 20,
//     justifyContent: 'space-evenly',
//   },
//   card: {
//     backgroundColor: colors.cardWhiteOpacity,
//     borderRadius: 38,
//     paddingVertical: 40,
//     paddingHorizontal: 24,
//     borderWidth: 1,
//     borderColor: colors.borderColor,
//   },
//   titleText: {
//     fontSize: 24,
//     fontWeight: '400',
//     color: colors.whiteColor,
//     textAlign: 'center',
//   },
//   subTitleText: {
//     marginTop: 10,
//     fontSize: 16,
//     fontWeight: '400',
//     color: colors.secondaryColor,
//     textAlign: 'center',
//   },
//   labelText: {
//     fontSize: 15,
//     fontWeight: '300',
//     color: colors.whiteColor,
//     textAlign: 'center',
//   },
//   labelHighlight: {
//     color: colors.secondaryColor,
//     fontWeight: '500',
//   },
// });

// import React, { useState, useEffect } from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
// import CommonButton from '../../components/CommonButton';
// import CommonTextField from '../../components/CommonTextField';
// import colors from '../../common/Colors';
// import { useNavigation } from '@react-navigation/native';
// import { useDispatch, useSelector } from 'react-redux';
// import { registerUser, clearError } from '../../redux/fetures/authSlice'; // Adjust import path if needed

// export default function SignUpScreen() {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   const { isLoading, error } = useSelector(state => state.auth);

//   const [email, setEmail] = useState('');
//   const [name, setName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [checkPrivacyAndTerms, setCheckPrivacyAndTerms] = useState(false); // Can use for checking terms if UI element is added

//   useEffect(() => {
//     dispatch(clearError());
//   }, [dispatch]);

//   useEffect(() => {
//     if (error) {
//       Alert.alert('Registration Error', error);
//       dispatch(clearError());
//     }
//   }, [error, dispatch]);

//   const handleSubmit = () => {
//     if (!name || !email || !phone || !password || !confirmPassword) {
//       Alert.alert('Error', 'Please fill in all details.');
//       return;
//     }
//     if (password !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match.');
//       return;
//     }
//     const signUpData = {
//       name,
//       email,
//       phone,
//       password,
//       confirmPassword,
//     };
//     console.log('Dispatching registerUser with data:', signUpData);
//     dispatch(registerUser(signUpData));
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         onPress={() => {
//           navigation.goBack();
//         }}
//         activeOpacity={0.8}
//       >
//         <MaterialDesignIcons
//           name="chevron-left"
//           size={40}
//           color={colors.whiteColor}
//           style={{ marginEnd: 10 }}
//         />
//       </TouchableOpacity>
//       <View style={{ gap: 40 }}>
//         <View style={styles.card}>
//           <Text style={styles.titleText}>Create your account</Text>
//           <Text style={styles.subTitleText}>Join millions of users today</Text>
//           <View style={{ height: 20 }} />

//           <View>
//             <CommonTextField
//               placeholder="Enter your Name"
//               value={name}
//               onChangeText={setName}
//             />
//             <View style={{ height: 20 }} />
//             <CommonTextField
//               placeholder="Enter your email"
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//             <View style={{ height: 20 }} />
//             <CommonTextField
//               placeholder="Enter your phone number"
//               value={phone}
//               onChangeText={setPhone}
//               keyboardType="phone-pad"
//             />
//             <View style={{ height: 20 }} />
//             <CommonTextField
//               placeholder="Create Password"
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry={true}
//             />
//             <View style={{ height: 20 }} />
//             <CommonTextField
//               placeholder="Confirm Password"
//               value={confirmPassword}
//               onChangeText={setConfirmPassword}
//               secureTextEntry={true}
//             />
//           </View>

//           <View style={{ height: 20 }} />

//           {isLoading ? (
//             <ActivityIndicator size="large" color={colors.secondaryColor} />
//           ) : (
//             <CommonButton
//               title="Create Account"
//               color={colors.secondaryColor}
//               textColor={colors.primaryColor}
//               style={styles.button}
//               onPress={handleSubmit}
//             />
//           )}
//         </View>
//         <Text style={styles.labelText}>
//           Already have an account?{' '}
//           <Text
//             style={styles.labelHighlight}
//             onPress={() => navigation.replace('Login')}
//           >
//             Log in
//           </Text>
//         </Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.primaryColor,
//     paddingHorizontal: 20,
//     justifyContent: 'space-evenly',
//   },
//   card: {
//     backgroundColor: colors.cardWhiteOpacity,
//     borderRadius: 38,
//     paddingVertical: 40,
//     paddingHorizontal: 24,
//     borderWidth: 1,
//     borderColor: colors.borderColor,
//   },
//   titleText: {
//     fontSize: 24,
//     fontWeight: '400',
//     color: colors.whiteColor,
//     textAlign: 'center',
//   },
//   subTitleText: {
//     marginTop: 10,
//     fontSize: 16,
//     fontWeight: '400',
//     color: colors.secondaryColor,
//     textAlign: 'center',
//   },
//   labelText: {
//     fontSize: 15,
//     fontWeight: '300',
//     color: colors.whiteColor,
//     textAlign: 'center',
//   },
//   labelHighlight: {
//     color: colors.secondaryColor,
//     fontWeight: '500',
//   },
// });

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import CommonButton from '../../components/CommonButton';
import CommonTextField from '../../components/CommonTextField';
import colors from '../../common/Colors';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../redux/fetures/authSlice';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { isAuthLoading, error } = useSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('Registration Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all details.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    const signUpData = {
      name,
      email,
      phone,
      password,
      confirmPassword,
    };

    console.log('Dispatching registerUser with data:', signUpData);

    try {
      // Unwrap standard response to enforce custom sequential block execution
      await dispatch(registerUser(signUpData)).unwrap();

      Alert.alert('Success', 'Account created successfully! Please login.', [
        {
          text: 'OK',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]);
    } catch (err) {
      console.log('Registration flow exception caught:', err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            activeOpacity={0.8}
            style={styles.backButton}
          >
            <MaterialDesignIcons
              name="chevron-left"
              size={40}
              color={colors.whiteColor}
            />
          </TouchableOpacity>

          <View style={styles.card}>
            <Text style={styles.titleText}>Create your account</Text>
            <Text style={styles.subTitleText}>
              Join millions of users today
            </Text>
            <View style={{ height: 20 }} />

            <View>
              <CommonTextField
                placeholder="Enter your Name"
                value={name}
                onChangeText={setName}
              />
              <View style={{ height: 20 }} />
              <CommonTextField
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={{ height: 20 }} />
              <CommonTextField
                placeholder="Enter your phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <View style={{ height: 20 }} />
              <CommonTextField
                placeholder="Create Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
              <View style={{ height: 20 }} />
              <CommonTextField
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
              />
            </View>

            <View style={{ height: 20 }} />

            {isAuthLoading ? (
              <ActivityIndicator size="large" color={colors.secondaryColor} />
            ) : (
              <CommonButton
                title="Create Account"
                color={colors.secondaryColor}
                textColor={colors.primaryColor}
                style={styles.button}
                onPress={handleSubmit}
              />
            )}
          </View>

          <Text style={styles.labelText}>
            Already have an account?{' '}
            <Text
              style={styles.labelHighlight}
              onPress={() => navigation.replace('Login')}
            >
              Log in
            </Text>
          </Text>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryColor,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-evenly',
    paddingVertical: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.cardWhiteOpacity,
    borderRadius: 38,
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.borderColor,
    marginVertical: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '400',
    color: colors.whiteColor,
    textAlign: 'center',
  },
  subTitleText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '400',
    color: colors.secondaryColor,
    textAlign: 'center',
  },
  labelText: {
    fontSize: 15,
    fontWeight: '300',
    color: colors.whiteColor,
    textAlign: 'center',
    marginBottom: 10,
  },
  labelHighlight: {
    color: colors.secondaryColor,
    fontWeight: '500',
  },
});
