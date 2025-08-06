import React, { useState } from 'react';
import { Filter, Search, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import TaskItem from './TaskItem';
import { Task } from '@/types';
import { cn } from '@/lib/utils';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onEditTask: (task: Task) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => Promise<Task | null>;
  onDeleteTask: (id: string) => Promise<boolean>;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  loading, 
  onEditTask, 
  onUpdateTask, 
  onDeleteTask 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || task.status === statusFilter;
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStatusChange = async (id: string, status: Task['status']) => {
    await onUpdateTask(id, { status });
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      await onDeleteTask(id);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPriorityFilter('');
  };

  const hasActiveFilters = searchTerm || statusFilter || priorityFilter;

  const getTaskStats = () => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(t => t.status === 'completed').length;
    const inProgress = filteredTasks.filter(t => t.status === 'in_progress').length;
    const pending = filteredTasks.filter(t => t.status === 'pending').length;
    const overdue = filteredTasks.filter(t => {
      if (!t.due_date || t.status === 'completed') return false;
      const today = new Date();
      const due = new Date(t.due_date);
      today.setHours(0, 0, 0, 0);
      due.setHours(0, 0, 0, 0);
      return due < today;
    }).length;

    return { total, completed, inProgress, pending, overdue };
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando tarefas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-muted-foreground">Concluídas</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          <div className="text-sm text-muted-foreground">Em Andamento</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
          <div className="text-sm text-muted-foreground">Pendentes</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-muted-foreground">Atrasadas</div>
        </Card>
      </div>

      {/* Barra de pesquisa e filtros */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder="Pesquisar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2",
                hasActiveFilters && "border-primary text-primary"
              )}
            >
              <Filter size={16} />
              Filtros
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Limpar
              </Button>
            )}
          </div>
        </div>

        {/* Filtros expansíveis */}
        {showFilters && (
          <Card className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Todos os status</option>
                  <option value="pending">Pendente</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Concluída</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Prioridade</label>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Todas as prioridades</option>
                  <option value="high">Alta</option>
                  <option value="medium">Média</option>
                  <option value="low">Baixa</option>
                </select>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Lista de tarefas */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-muted-foreground">
              {tasks.length === 0 ? (
                <>
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-semibold mb-2">Nenhuma tarefa encontrada</h3>
                  <p>Crie sua primeira tarefa para começar a organizar suas atividades.</p>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold mb-2">Nenhum resultado encontrado</h3>
                  <p>Tente ajustar os filtros ou termos de pesquisa.</p>
                </>
              )}
            </div>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;