import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { CreateTaskInput, Task } from '../types/task';

type Filter = 'all' | 'active' | 'completed' | 'urgent';

const filters: Filter[] = ['all', 'active', 'completed', 'urgent'];

export const HomeScreen = () => {
  const { token, email, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [refreshing, setRefreshing] = useState(false);

  const loadTasks = useCallback(async () => {
    if (!token) {
      return;
    }
    const result = await api.getTasks(token);
    setTasks(result);
  }, [token]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const createTask = async (input: CreateTaskInput) => {
    if (!token) {
      return;
    }

    const nextTask = await api.createTask(token, input);
    setTasks((current) => [nextTask, ...current]);
  };

  const toggleTask = async (task: Task) => {
    if (!token) {
      return;
    }

    const updated = await api.toggleTask(token, task._id);
    setTasks((current) => current.map((item) => (item._id === updated._id ? updated : item)));
  };

  const deleteTask = async (task: Task) => {
    if (!token) {
      return;
    }

    await api.deleteTask(token, task._id);
    setTasks((current) => current.filter((item) => item._id !== task._id));
  };

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === 'active') {
        return !task.completed;
      }
      if (filter === 'completed') {
        return task.completed;
      }
      if (filter === 'urgent') {
        return ['high', 'critical'].includes(task.priority) && !task.completed;
      }
      return true;
    });
  }, [filter, tasks]);

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Orbit Tasks</Text>
          <Text style={styles.title}>Today's Control Room</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
        <Pressable style={styles.logout} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{tasks.length}</Text>
          <Text style={styles.statLabel}>Tasks</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{completedCount}</Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{tasks.length - completedCount}</Text>
          <Text style={styles.statLabel}>Open</Text>
        </View>
      </View>

      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <>
            <TaskForm onSubmit={createTask} />
            <View style={styles.filters}>
              {filters.map((item) => (
                <Pressable key={item} style={[styles.filterChip, filter === item && styles.filterActive]} onPress={() => setFilter(item)}>
                  <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text>
                </Pressable>
              ))}
            </View>
          </>
        }
        renderItem={({ item }) => <TaskCard task={item} onToggle={() => toggleTask(item)} onDelete={() => deleteTask(item)} />}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => {
          setRefreshing(true);
          await loadTasks();
          setRefreshing(false);
        }} tintColor="#22d3ee" />}
        ListEmptyComponent={<Text style={styles.empty}>No tasks here yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#090b1f'
  },
  header: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  kicker: {
    color: '#22d3ee',
    fontWeight: '900',
    marginBottom: 8
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900'
  },
  email: {
    color: '#94a3b8',
    marginTop: 6
  },
  logout: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#27294f'
  },
  logoutText: {
    color: '#ffffff',
    fontWeight: '800'
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 16
  },
  stat: {
    flex: 1,
    padding: 14,
    borderRadius: 20,
    backgroundColor: '#10132b',
    borderWidth: 1,
    borderColor: '#29305f'
  },
  statValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900'
  },
  statLabel: {
    color: '#94a3b8',
    marginTop: 4
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 34
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14
  },
  filterChip: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#1a1f43'
  },
  filterActive: {
    backgroundColor: '#22d3ee'
  },
  filterText: {
    color: '#cbd5e1',
    fontWeight: '800',
    textTransform: 'capitalize'
  },
  filterTextActive: {
    color: '#05111f'
  },
  empty: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 28
  }
});
