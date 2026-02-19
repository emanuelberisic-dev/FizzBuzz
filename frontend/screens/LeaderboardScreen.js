import { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'http://10.67.76.187:3000';

export default function LeaderboardScreen({ route, navigation, theme }) {
  const { score = 0, username = '' } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [saving, setSaving] = useState(false);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

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

      {(saving || loading) && (
        <ActivityIndicator size="large" style={{ marginTop: 16 }} />
      )}

      {!loading && (
        <>
          {top3.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Top 3
              </Text>

              <View style={styles.podiumRow}>
                {top3.map((item, idx) => {
                  const medal =
                    idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';

                  const accent =
                    idx === 0
                      ? '#FACC15'
                      : idx === 1
                      ? '#94A3B8'
                      : '#CD7F32';

                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.podiumCard,
                        { backgroundColor: theme.card, borderColor: theme.border },
                      ]}
                    >
                      <Text style={styles.medal}>{medal}</Text>
                      <Text
                        numberOfLines={1}
                        style={[styles.podiumName, { color: theme.text }]}
                      >
                        {item.username}
                      </Text>
                      <Text style={[styles.podiumScore, { color: accent }]}>
                        {item.score}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          <FlatList
            style={{ marginTop: 24 }}
            data={rest}
            keyExtractor={(item) => String(item.id)}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item, index }) => (
              <View
                style={[
                  styles.row,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.rank, { color: theme.muted }]}>
                  {index + 4}.
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
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  title: { fontSize: 26, fontWeight: '900' },
  subTitle: { marginTop: 6, fontSize: 14 },

  topButtons: { marginTop: 12, gap: 10 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 10,
  },

  podiumRow: {
    flexDirection: 'row',
    gap: 10,
  },

  podiumCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },

  medal: {
    fontSize: 22,
    marginBottom: 6,
  },

  podiumName: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },

  podiumScore: {
    fontSize: 22,
    fontWeight: '900',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },

  rank: {
    width: 34,
    fontWeight: '800',
  },

  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
  },

  score: {
    width: 60,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: '900',
  },

  empty: {
    marginTop: 20,
    textAlign: 'center',
  },

});
