import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { CreateTaskInput, Priority } from '../types/task';

const priorities: Priority[] = ['low', 'medium', 'high', 'critical'];

interface Props {
  onSubmit: (input: CreateTaskInput) => Promise<void>;
}

export const TaskForm = ({ onSubmit }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState<Priority>('medium');
  const [deadline, setDeadline] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 16));
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!title.trim()) {
      return;
    }

    setSaving(true);
    await onSubmit({
      title: title.trim(),
      description,
      category,
      priority,
      dateTime: new Date().toISOString(),
      deadline: new Date(deadline).toISOString()
    });
    setTitle('');
    setDescription('');
    setSaving(false);
  };

  return (
    <View style={styles.panel}>
      <Text style={styles.heading}>Create Mission</Text>
      <TextInput style={styles.input} placeholder="Task title" placeholderTextColor="#667085" value={title} onChangeText={setTitle} />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Description"
        placeholderTextColor="#667085"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <View style={styles.row}>
        <TextInput style={[styles.input, styles.half]} placeholder="Category" placeholderTextColor="#667085" value={category} onChangeText={setCategory} />
        <TextInput style={[styles.input, styles.half]} value={deadline} onChangeText={setDeadline} />
      </View>
      <View style={styles.priorityRow}>
        {priorities.map((item) => (
          <Pressable key={item} style={[styles.chip, priority === item && styles.selectedChip]} onPress={() => setPriority(item)}>
            <Text style={[styles.chipText, priority === item && styles.selectedChipText]}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={styles.submit} onPress={submit} disabled={saving}>
        <Text style={styles.submitText}>{saving ? 'Saving...' : 'Add Task'}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    padding: 18,
    borderRadius: 26,
    backgroundColor: '#10132b',
    borderWidth: 1,
    borderColor: '#27305f',
    marginBottom: 18
  },
  heading: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 14
  },
  input: {
    backgroundColor: '#0b0e24',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#29305f',
    marginBottom: 10
  },
  multiline: {
    minHeight: 74,
    textAlignVertical: 'top'
  },
  row: {
    flexDirection: 'row',
    gap: 10
  },
  half: {
    flex: 1
  },
  priorityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#20264e'
  },
  selectedChip: {
    backgroundColor: '#8b5cf6'
  },
  chipText: {
    color: '#cbd5e1',
    fontWeight: '700',
    textTransform: 'capitalize'
  },
  selectedChipText: {
    color: '#ffffff'
  },
  submit: {
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 14,
    backgroundColor: '#22d3ee'
  },
  submitText: {
    color: '#05111f',
    fontWeight: '900',
    fontSize: 16
  }
});

