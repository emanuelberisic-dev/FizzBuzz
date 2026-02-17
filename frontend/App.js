import { useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();

const lightTheme = {
  bg: '#F6F7FB',
  card: '#FFFFFF',
  text: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  primary: '#2563EB',
  danger: '#DC2626',
};

const darkTheme = {
  bg: '#0B1220',
  card: '#121A2B',
  text: '#E5E7EB',
  muted: '#94A3B8',
  border: '#24304A',
  primary: '#60A5FA',
  danger: '#F87171',
};


export default function App() {
  const [settings, setSettings] = useState({
    darkMode: false,
    sound: true,
  });

  const theme = useMemo(
    () => (settings.darkMode ? darkTheme : lightTheme),
    [settings.darkMode]
  );

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.card },
          headerTitleStyle: { color: theme.text },
          headerTintColor: theme.primary,
          contentStyle: { backgroundColor: theme.bg },
        }}
      >
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} theme={theme} settings={settings} />}
        </Stack.Screen>

        <Stack.Screen name="Game">
          {(props) => <GameScreen {...props} theme={theme} settings={settings} />}
        </Stack.Screen>

        <Stack.Screen name="Leaderboard">
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
