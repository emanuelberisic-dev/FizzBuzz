import { useEffect, useState, useRef } from 'react';
import { Audio } from 'expo-av';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function GameScreen({ navigation, route, theme, settings }) {
  const { username } = route.params;
  const soundRef = useRef(null);
  const [number, setNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft <= 0) {
      navigation.replace('Leaderboard', { username, score });
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
    
  }, [timeLeft]);

  useEffect(() => {
  let mounted = true;

  (async () => {
    try {
      if (settings?.sound === false) {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        return;
      }

      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/background.mp3'),
        { isLooping: true, volume: 0.5 }
      );

      if (!mounted) {
        await sound.unloadAsync();
        return;
      }

      soundRef.current = sound;
      await sound.playAsync();
    } catch (e) {
      console.log('AUDIO ERROR:', e);
    }
  })();

  return () => {
    mounted = false;
    if (soundRef.current) {
      soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };
}, [settings?.sound]);



  function getCorrectAnswer(num) {
    if (num % 3 === 0 && num % 5 === 0) return 'FizzBuzz';
    if (num % 3 === 0) return 'Fizz';
    if (num % 5 === 0) return 'Buzz';
    return 'Nije djeljiv';
  }

  function handleAnswer(answer) {
  const correct = getCorrectAnswer(number);

  if (answer === correct) {
    setScore((s) => s + 1);
    setNumber((n) => (n < 100 ? n + 1 : 1));
  } else {
    navigation.replace('Leaderboard', { username, score });
  }
}



  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      
      <View style={styles.topBar}>
        <Text style={[styles.timer, { color: theme.danger }]}>
          ⏱ {timeLeft}s
        </Text>

        <Text style={[styles.score, { color: theme.muted }]}>
          Score: {score}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.number, { color: theme.primary }]}>
          {number}
        </Text>

        <View style={styles.buttons}>
          <Button title="Fizz" onPress={() => handleAnswer('Fizz')} />
          <Button title="Buzz" onPress={() => handleAnswer('Buzz')} />
          <Button title="FizzBuzz" onPress={() => handleAnswer('FizzBuzz')} />
          <Button title="Nije djeljiv" onPress={() => handleAnswer('Nije djeljiv')} />
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  timer: {
    fontSize: 18,
    fontWeight: '800',
  },
  score: {
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 60,
    fontWeight: '900',
    marginBottom: 30,
  },
  buttons: {
    width: '100%',
    gap: 10,
  },
});
