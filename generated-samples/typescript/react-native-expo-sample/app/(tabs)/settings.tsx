import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useAppStore } from '../../src/store/appStore';

export default function SettingsScreen() {
  const { isDarkMode, toggleDarkMode } = useAppStore();

  return (
    <ScrollView style={[styles.container, isDarkMode && styles.dark]}>
      <View style={styles.content}>
        <View style={styles.setting}>
          <Text style={[styles.label, isDarkMode && styles.darkText]}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
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
  dark: {
    backgroundColor: '#1a1a1a'
  },
  content: {
    padding: 20
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  label: {
    fontSize: 16,
    color: '#333'
  },
  darkText: {
    color: '#fff'
  }
});
