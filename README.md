# Orbit Tasks

A creative React Native CLI + TypeScript to-do application for the Modulus Seventeen Full Stack Developer assignment.

Orbit Tasks combines user authentication, task planning, priority sorting, and a polished mobile-first interface. The project includes a React Native Android app and a Node.js + MongoDB backend API.

## Features

- Email/password registration and login
- JWT based protected backend API
- Add tasks with title, description, date-time, deadline, priority, and category
- Mark tasks as completed
- Delete tasks
- View task status with pending/completed sections
- Filter by all, active, completed, and urgent tasks
- Creative priority based sorting that blends urgency, deadline proximity, and completion state
- Clean TypeScript structure with reusable services, context, components, and screens

## Project Structure

```text
modulus-todo-submission/
  mobile/      React Native CLI app source
  backend/     Node.js + Express + MongoDB API
```

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Default backend URL on your computer: `http://localhost:4000`

The default `.env.example` uses `MONGO_URI=memory` so the API runs immediately for a local demo. Use a real MongoDB connection string, such as `mongodb://127.0.0.1:27017/orbit_tasks`, when you want persistent database storage.

Mobile API URL behavior:

- Android emulator: `http://10.0.2.2:4000/api`
- iOS simulator: `http://localhost:4000/api`
- Physical phone: replace the URL in `mobile/src/config/api.ts` with your computer's LAN IP, for example `http://192.168.1.12:4000/api`

If the app cannot reach the API, confirm the backend is running with:

```bash
curl http://localhost:4000/health
```

## Mobile Setup

Create a React Native CLI project, then copy this `mobile` folder content into it:

```bash
npx react-native@latest init OrbitTasks --template react-native-template-typescript
cd OrbitTasks
npm install @react-navigation/native @react-navigation/native-stack react-native-safe-area-context react-native-screens @react-native-async-storage/async-storage
```

Copy the files from `mobile/` into the generated project root, then run:

```bash
npm run android
```

## Test Account Flow

1. Start MongoDB locally or use MongoDB Atlas.
2. Start the backend.
3. Open the Android app.
4. Register with any valid email and password.
5. Add tasks with different priorities and deadlines.
6. Use the filter chips and complete/delete actions.

## Creative UI Direction

The app uses a deep navy canvas, glowing accent cards, pill controls, priority color bands, and compact task metadata to make the assignment feel more product-like while staying simple and usable.
