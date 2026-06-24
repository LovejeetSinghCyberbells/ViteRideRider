import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { restoreToken } from '../redux/fetures/authSlice';

import MainNavigator from './MainNavigator';
import AuthNavigator from './AuthNavigator';

const RootNavigator = () => {
  const dispatch = useDispatch();
  const { userToken, isLoading } = useSelector(state => state.auth);
  console.log(
    'RootNavigator Rendered - Token:',
    userToken,
    'Loading:',
    isLoading,
  );

  useEffect(() => {
    dispatch(restoreToken());
  }, [dispatch]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <ActivityIndicator size="large" color="#4A00E0" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;
