import { Platform } from 'react-native';

const LOCAL_API_PORT = 4000;

// Android emulators reach the host machine through 10.0.2.2.
// iOS simulators can use localhost. For a physical phone, replace this with
// your computer's LAN IP, for example: http://192.168.1.12:4000/api
export const API_URL =
  Platform.OS === 'android'
    ? `http://10.0.2.2:${LOCAL_API_PORT}/api`
    : `http://localhost:${LOCAL_API_PORT}/api`;

