import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>📱 React Native Expo</Text>
        <Text style={styles.subtitle}>Cross-platform mobile app</Text>
        <Text style={styles.description}>
          Built with Expo, React Navigation, and Zustand state management.
        </Text>
        <View style={styles.features}>
          <Text style={styles.featureTitle}>Features:</Text>
          <Text style={styles.feature}>✅ Expo Router navigation</Text>
          <Text style={styles.feature}>✅ Zustand state management</Text>
          <Text style={styles.feature}>✅ Supabase integration</Text>
          <Text style={styles.feature}>✅ TypeScript support</Text>
          <Text style={styles.feature}>✅ Responsive design</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    padding: 20,
    paddingTop: 30
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16
  },
  description: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
    marginBottom: 24
  },
  features: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12
  },
  feature: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    paddingLeft: 10
  }
});
