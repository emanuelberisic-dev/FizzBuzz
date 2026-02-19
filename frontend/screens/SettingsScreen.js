import { View, Text, Switch, StyleSheet } from 'react-native';
import { Pressable } from 'react-native';


export default function SettingsScreen({ settings, setSettings, theme }) {
  const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }));

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>Dark mode</Text>
          <Switch
            value={settings.darkMode}
            onValueChange={() => toggle('darkMode')}
          />
        </View>

        <View style={[styles.sep, { backgroundColor: theme.border }]} />

        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.text }]}>Sound</Text>
          <Switch
            value={settings.sound}
            onValueChange={() => toggle('sound')}
          />
        </View>
      </View>

      <Text style={[styles.hint, { color: theme.muted }]}>
        *Ovo su lokalne postavke aplikacije.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 12 },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '600' },
  sep: { height: 1, marginVertical: 12 },
  hint: { marginTop: 12, fontSize: 12 },
});
