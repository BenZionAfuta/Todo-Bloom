import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type Task = Database['public']['Tables']['tasks']['Row'];
type TaskStatus = Database['public']['Enums']['task_status'];
type TaskInsert = Database['public']['Tables']['tasks']['Insert'];

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (task: Omit<TaskInsert, 'created_by'>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({ ...task, created_by: user.id })
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => [...prev, data]);
      toast.success('Task created successfully');
      return data;
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to create task');
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    await updateTask(id, { status });
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Task deleted');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(t => t.status === status);
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    getTasksByStatus,
    refetch: fetchTasks,
  };
};
