import { useMemo, useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const lightTheme = {
  bg: '#FDF2F8',
  card: '#FFFFFF',
  text: '#1E1B4B',
  muted: '#6D28D9',
  border: '#E9D5FF',
  primary: '#EC4899',
  success: '#10B981',
  danger: '#EF4444',
};


const darkTheme = {
  bg: '#0F0F1A',
  card: '#1C1C2E',
  text: '#F1F5F9',
  muted: '#A78BFA',
  border: '#312E81',
  primary: '#7C3AED',
  success: '#22C55E',
  danger: '#F43F5E',
};


export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        Lacquer: require('./assets/fonts/Lacquer-Regular.ttf'),
        RanchersRegular: require('./assets/fonts/Ranchers-Regular.ttf'),
      });
      setFontsLoaded(true);
    })();
  }, []);

  const [settings, setSettings] = useState({
    darkMode: false,
    sound: true,
  });

  const theme = useMemo(
    () => (settings.darkMode ? darkTheme : lightTheme),
    [settings.darkMode]
  );

  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.card },
          headerTitleStyle: { color: theme.text, fontFamily: 'PoppinsBold' },
          headerTintColor: theme.primary,
          contentStyle: { backgroundColor: theme.bg },
        }}
      >
        <Stack.Screen name="Home" options={{ title: 'FizzBuzz' }}>
          {(props) => <HomeScreen {...props} theme={theme} settings={settings} />}
        </Stack.Screen>

        <Stack.Screen name="Game" options={{ title: 'Game' }}>
          {(props) => <GameScreen {...props} theme={theme} settings={settings} />}
        </Stack.Screen>

        <Stack.Screen name="Leaderboard" options={{ title: 'Leaderboard' }}>
          {(props) => <LeaderboardScreen {...props} theme={theme} settings={settings} />}
        </Stack.Screen>

        <Stack.Screen name="Settings" options={{ title: 'Settings' }}>
          {(props) => (
            <SettingsScreen
              {...props}
              theme={theme}
              settings={settings}
              setSettings={setSettings}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
