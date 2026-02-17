import { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'http://10.67.76.187:3000';
//const API_BASE_URL = 'http://localhost:3000';

export default function LeaderboardScreen({ route, navigation, theme}) {
  const { score = 0, username = '' } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [saving, setSaving] = useState(false);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/leaderboard`);
      setLeaderboard(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      Alert.alert('Greška', 'Ne mogu dohvatiti leaderboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveResult = useCallback(async () => {
    if (!username) return;

    try {
      setSaving(true);
      await axios.post(`${API_BASE_URL}/result`, { username, score });
    } catch (e) {
      Alert.alert('Greška', 'Spremanje rezultata nije uspjelo.');
    } finally {
      setSaving(false);
    }
  }, [username, score]);

  useEffect(() => {
    (async () => {
      await saveResult();
      await fetchLeaderboard();
    })();
  }, [saveResult, fetchLeaderboard]);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>

      <Text style={[styles.title, { color: theme.text }]}>Leaderboard</Text>

      <Text style={[styles.subTitle, { color: theme.muted }]}>
        Zadnji rezultat: {username} — {score}
      </Text>


      <View style={styles.topButtons}>
        <Button title="Play again" onPress={() => navigation.replace('Game', { username })} />
        <Button title="Home" onPress={() => navigation.popToTop()} />
      </View>

      {(saving || loading) && <ActivityIndicator size="large" style={{ marginTop: 16 }} />}

      {!loading && (
  <FlatList
    style={{ marginTop: 16 }}
    data={leaderboard}
    keyExtractor={(item) => String(item.id)}
    ItemSeparatorComponent={() => <View style={[styles.sep, { backgroundColor: theme.border }]} />}
    renderItem={({ item, index }) => (
      <View
        style={[
          styles.row,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <Text style={[styles.rank, { color: theme.muted }]}>
          {index + 1}.
        </Text>

        <Text style={[styles.name, { color: theme.text }]}>
          {item.username}
        </Text>

        <Text style={[styles.score, { color: theme.primary }]}>
          {item.score}
        </Text>
      </View>
    )}
    ListEmptyComponent={
      <Text style={[styles.empty, { color: theme.muted }]}>
        Nema rezultata još.
      </Text>
    }
      />
    )}

      <View style={{ marginTop: 12 }}>
        <Button title="Refresh" onPress={fetchLeaderboard} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 26, fontWeight: 'bold' },
  subTitle: { marginTop: 6, opacity: 0.8 },

  topButtons: { marginTop: 12, gap: 10 },

  sep: { height: 1, backgroundColor: '#ddd', marginVertical: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rank: { width: 28, fontWeight: 'bold' },
  name: { flex: 1, fontSize: 16 },
  score: { width: 60, textAlign: 'right', fontSize: 16, fontWeight: 'bold' },

  empty: { marginTop: 20, textAlign: 'center' },
});
