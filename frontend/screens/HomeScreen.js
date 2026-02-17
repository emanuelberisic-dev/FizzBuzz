import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';

export default function HomeScreen({ navigation, theme }) {
  const [username, setUsername] = useState('');

  const startGame = () => {
    const trimmed = username.trim();
    if (!trimmed) return Alert.alert('Greška', 'Unesi korisničko ime.');
    navigation.navigate('Game', { username: trimmed });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.title, { color: theme.text }]}>FizzBuzz</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>
          Odaberi točan odgovor što brže.
        </Text>

        <TextInput
          style={[styles.input, { borderColor: theme.border, color: theme.text }]}
          placeholder="Korisničko ime"
          placeholderTextColor={theme.muted}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Pressable style={[styles.primaryBtn, { backgroundColor: theme.primary }]} onPress={startGame}>
          <Text style={styles.primaryBtnText}>Start game</Text>
        </Pressable>

        <Pressable
          style={[styles.secondaryBtn, { borderColor: theme.border }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={[styles.secondaryBtnText, { color: theme.text }]}>Settings</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'top', padding: 16 },
  card: { borderWidth: 1, borderRadius: 20, padding: 18 },
  title: { fontSize: 34, fontWeight: '900' },
  subtitle: { marginTop: 6, marginBottom: 16, fontSize: 14 },
  input: { borderWidth: 1, borderRadius: 14, padding: 12, fontSize: 16, marginBottom: 12 },
  primaryBtn: { padding: 14, borderRadius: 14, alignItems: 'center' },
  primaryBtnText: { color: 'white', fontWeight: '800', fontSize: 16 },
  secondaryBtn: { marginTop: 10, padding: 12, borderRadius: 14, alignItems: 'center', borderWidth: 1 },
  secondaryBtnText: { fontWeight: '700', fontSize: 15 },
});
