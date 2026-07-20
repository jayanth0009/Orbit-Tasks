import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export const AuthScreen = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to continue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.orbitOne} />
      <View style={styles.orbitTwo} />
      <View style={styles.hero}>
        <Text style={styles.logo}>ORBIT</Text>
        <Text style={styles.title}>Plan your work like a launch board.</Text>
        <Text style={styles.subtitle}>Smart priorities, fast capture, and clean task focus for every day.</Text>
      </View>

      <View style={styles.panel}>
        <View style={styles.switcher}>
          <Pressable style={[styles.switchButton, mode === 'login' && styles.switchActive]} onPress={() => setMode('login')}>
            <Text style={[styles.switchText, mode === 'login' && styles.switchTextActive]}>Login</Text>
          </Pressable>
          <Pressable style={[styles.switchButton, mode === 'register' && styles.switchActive]} onPress={() => setMode('register')}>
            <Text style={[styles.switchText, mode === 'register' && styles.switchTextActive]}>Register</Text>
          </Pressable>
        </View>

        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#7b849d"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#7b849d"
          value={password}
          onChangeText={setPassword}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable style={styles.cta} onPress={submit} disabled={loading}>
          <Text style={styles.ctaText}>{loading ? 'Please wait...' : mode === 'login' ? 'Enter Workspace' : 'Create Account'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#090b1f',
    padding: 22
  },
  orbitOne: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#312e81',
    top: -50,
    right: -60,
    opacity: 0.7
  },
  orbitTwo: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#155e75',
    left: -45,
    top: 150,
    opacity: 0.55
  },
  hero: {
    marginBottom: 34
  },
  logo: {
    color: '#22d3ee',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 18
  },
  title: {
    color: '#ffffff',
    fontSize: 42,
    lineHeight: 47,
    fontWeight: '900'
  },
  subtitle: {
    color: '#b8c0ff',
    fontSize: 16,
    lineHeight: 23,
    marginTop: 14
  },
  panel: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: '#11142f',
    borderWidth: 1,
    borderColor: '#29305f'
  },
  switcher: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 18,
    backgroundColor: '#080a1d',
    marginBottom: 14
  },
  switchButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderRadius: 14
  },
  switchActive: {
    backgroundColor: '#8b5cf6'
  },
  switchText: {
    color: '#94a3b8',
    fontWeight: '800'
  },
  switchTextActive: {
    color: '#ffffff'
  },
  input: {
    backgroundColor: '#090b1f',
    borderWidth: 1,
    borderColor: '#29305f',
    color: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12
  },
  error: {
    color: '#fb7185',
    marginBottom: 12
  },
  cta: {
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 18,
    backgroundColor: '#22d3ee'
  },
  ctaText: {
    color: '#06111f',
    fontWeight: '900',
    fontSize: 16
  }
});

