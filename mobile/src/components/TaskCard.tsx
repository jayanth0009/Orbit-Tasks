import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Priority, Task } from '../types/task';

const priorityColors: Record<Priority, string> = {
  low: '#7dd3fc',
  medium: '#a7f3d0',
  high: '#fbbf24',
  critical: '#fb7185'
};

interface Props {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
}

export const TaskCard = ({ task, onToggle, onDelete }: Props) => {
  const deadline = new Date(task.deadline);

  return (
    <View style={[styles.card, task.completed && styles.completedCard]}>
      <View style={[styles.priorityBar, { backgroundColor: priorityColors[task.priority] }]} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.title, task.completed && styles.completedText]}>{task.title}</Text>
          <Text style={[styles.priority, { color: priorityColors[task.priority] }]}>{task.priority.toUpperCase()}</Text>
        </View>
        <Text style={styles.description}>{task.description}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{task.category}</Text>
          <Text style={styles.meta}>{deadline.toLocaleDateString()} {deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        </View>
        <View style={styles.actions}>
          <Pressable style={[styles.button, task.completed && styles.activeButton]} onPress={onToggle}>
            <Text style={styles.buttonText}>{task.completed ? 'Reopen' : 'Complete'}</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.deleteButton]} onPress={onDelete}>
            <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginBottom: 14,
    borderRadius: 22,
    backgroundColor: '#171a36',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2b315e'
  },
  completedCard: {
    opacity: 0.65
  },
  priorityBar: {
    width: 7
  },
  content: {
    flex: 1,
    padding: 16
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12
  },
  title: {
    flex: 1,
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800'
  },
  completedText: {
    textDecorationLine: 'line-through'
  },
  priority: {
    fontSize: 12,
    fontWeight: '900'
  },
  description: {
    marginTop: 8,
    color: '#b8c0ff',
    lineHeight: 20
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 10
  },
  meta: {
    color: '#94a3b8',
    fontSize: 12
  },
  actions: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 10
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#29305f'
  },
  activeButton: {
    backgroundColor: '#155e75'
  },
  deleteButton: {
    backgroundColor: '#5f2336'
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700'
  }
});

