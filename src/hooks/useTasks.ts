import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Task | null>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  fetchTasks: (filters?: { status?: string; priority?: string }) => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  const fetchTasks = async (filters?: { status?: string; priority?: string }) => {
    if (!isAuthenticated) return;

    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.priority) queryParams.append('priority', filters.priority);

      const response = await fetch(
        `http://localhost:5000/api/tasks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar tarefas');
      }

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Task | null> => {
    if (!isAuthenticated) return null;

    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar tarefa');
      }

      const data = await response.json();
      const newTask = data.task;
      
      setTasks(prev => [newTask, ...prev]);
      
      toast({
        title: "Sucesso",
        description: "Tarefa criada com sucesso!",
      });

      return newTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>): Promise<Task | null> => {
    if (!isAuthenticated) return null;

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar tarefa');
      }

      const data = await response.json();
      const updatedTask = data.task;
      
      setTasks(prev => prev.map(task => 
        task.id === id ? updatedTask : task
      ));

      toast({
        title: "Sucesso",
        description: "Tarefa atualizada com sucesso!",
      });

      return updatedTask;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir tarefa');
      }

      setTasks(prev => prev.filter(task => task.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Tarefa excluída com sucesso!",
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks,
  };
};