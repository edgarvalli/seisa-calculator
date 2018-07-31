import React from 'react';
import { StatusBar, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import Home from './src/components/Home';
import Result from './src/components/Result';

const Router = createStackNavigator({
  Home: { screen: Home, navigationOptions: { header: null } },
  Result: { screen: Result }
}, { initialRouteName: 'Home' })

export default App = () => <Router />